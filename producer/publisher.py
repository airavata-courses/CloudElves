import logging

import pika
import json
import os

logging.basicConfig(level=logging.CRITICAL, format='%(asctime)s  %(name)s  %(levelname)s {%(pathname)s:%(lineno)d}: %(message)s')

log = logging.getLogger(__name__)
log.setLevel(logging.INFO)

class Publisher:
    def __init__(self) -> None:
        self.credentials = pika.PlainCredentials(os.getenv('rmq_user') or 'guest', os.getenv('rmq_password') or 'guest')

        if os.getenv('rmq_service_name'):
            log.info("pointing to kubernetes cluster")
            rmqServiceName = os.getenv('rmq_service_name')
            self.rmq_host, self.rmq_port = os.getenv('{}_SERVICE_HOST'.format(rmqServiceName)), os.getenv('{}_SERVICE_PORT'.format(rmqServiceName))
        else:
            log.info("pointing to local")
            self.rmq_host, self.rmq_port = os.getenv('rmq_host') or 'localhost', os.getenv('rmq_port') or '5672'
        log.info('rmq_host: {} and rmq_port: {}'.format(self.rmq_host, self.rmq_port))
        self.connection = pika.BlockingConnection(pika.ConnectionParameters(host=self.rmq_host, port=self.rmq_port, credentials=self.credentials))
        self.connection.channel().exchange_declare(exchange='elvesExchange', exchange_type='direct', durable=True)

    def publish(self, queue, body):
        connection = pika.BlockingConnection(pika.ConnectionParameters(host=self.rmq_host, port=self.rmq_port, credentials=self.credentials))
        connection.channel().basic_publish(exchange='', routing_key=queue, body=json.dumps(body), properties=pika.BasicProperties(delivery_mode=1))
        log.info('message sent to queue: {}'.format(queue))
