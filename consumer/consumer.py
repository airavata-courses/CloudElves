import threading

import pika
import json
import os
from services.processor import Processor

class Consumer(threading.Thread):
    def __init__(self, queue) -> None:
        threading.Thread.__init__(self)
        rmq_username = os.getenv('rmq_username') or 'guest'
        rmq_password = os.getenv('rmq_password') or 'guest'
        print('rmq_username: {}, rmq_password: {}'.format(rmq_username, rmq_password))
        self.credentials = pika.PlainCredentials(rmq_username, rmq_password)
        if os.getenv('rmq_service_name'):
            print("pointing to kubernetes cluster")
            rmqServiceName = os.getenv('rmq_service_name')
            rmq_host, rmq_port = os.getenv('{}_SERVICE_HOST'.format(rmqServiceName)), os.getenv('{}_SERVICE_PORT'.format(rmqServiceName))
        else:
            print("pointing to local")
            rmq_host, rmq_port = os.getenv('rmq_host') or 'localhost', os.getenv('rmq_port') or '5672'
        print('rmq_url: {}:{}'.format(rmq_host, rmq_port))
        self.connection = pika.BlockingConnection(pika.ConnectionParameters(host=rmq_host, port=rmq_port, credentials=self.credentials))
        self.channel = self.connection.channel()
        # self.channel.basic_qos(1)
        self.queue = queue

    def __getMessage(self, ch, method, properties, body):
        print("--> in callback")
        payload = json.loads(body.decode('utf8'))
        print("Message:", payload)
        Processor(payload)

    def consume(self):
        print('starting consumer')
        self.channel.queue_declare(queue=self.queue, durable=True)
        self.channel.basic_consume(queue=self.queue, auto_ack=True, on_message_callback=self.__getMessage)
        self.channel.start_consuming()

    def run(self):
        self.consume()
