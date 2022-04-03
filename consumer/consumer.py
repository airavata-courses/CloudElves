import json
import logging
import os
import threading

import pika

from services.nexrad_services import NexradService

logging.basicConfig(level=logging.CRITICAL, format='%(asctime)s  %(name)s  %(levelname)s: %(message)s')

log = logging.getLogger(__name__)
log.setLevel(logging.INFO)


class Consumer(threading.Thread):
    def __init__(self, queue) -> None:
        threading.Thread.__init__(self)
        rmq_username = os.getenv('rmq_username') or 'guest'
        rmq_password = os.getenv('rmq_password') or 'guest'
        log.info('rmq_username: {}, rmq_password: {}'.format(rmq_username, rmq_password))
        self.credentials = pika.PlainCredentials(rmq_username, rmq_password)
        if os.getenv('rmq_service_name'):
            log.info("pointing to kubernetes cluster")
            rmqServiceName = os.getenv('rmq_service_name')
            rmq_host, rmq_port = os.getenv('{}_SERVICE_HOST'.format(rmqServiceName)), os.getenv('{}_SERVICE_PORT'.format(rmqServiceName))
        else:
            log.info("is this from log? pointing to local")
            rmq_host, rmq_port = os.getenv('rmq_host') or 'localhost', os.getenv('rmq_port') or '5672'
        log.info('rmq_url: {}:{}'.format(rmq_host, rmq_port))
        self.connection = pika.BlockingConnection(pika.ConnectionParameters(host=rmq_host, port=rmq_port, credentials=self.credentials))
        self.channel = self.connection.channel()
        self.channel.basic_qos(prefetch_count=10)
        self.queue = queue
        self.nexradService = NexradService()

    def getMessage(self, ch, method, properties, body):
        try:
            payload = json.loads(body.decode('utf8'))
            # log.info('payload: ', payload)
            self.nexradService.download_and_plot(payload['id'], payload['data'])
        except Exception as e:
            log.info('error while processing message: ', e)

    def consume(self):
        log.info('starting consumer')
        self.channel.queue_declare(queue=self.queue, durable=True)
        self.channel.basic_consume(queue=self.queue, auto_ack=True, on_message_callback=self.getMessage)
        self.channel.start_consuming()

    def run(self):
        self.consume()
