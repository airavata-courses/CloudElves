#!/usr/bin/env python

import pika
import json
import os
from processor import Processor

class Consumer:
	def __init__(self, queue) -> None:

		print("ENV VARS:",os.getenv('rmq_user'), os.getenv('rmq_password'), os.getenv('rmq_host'))
		self.__credentials = pika.PlainCredentials(os.getenv('rmq_user') or 'guest',os.getenv('rmq_password') or 'guest')
		
		if os.getenv('rmq_service_name'):
			print("pointing to kubernetes cluster")
			rmqServiceName = os.getenv('rmq_service_name')
			rmq_host, rmq_port = os.getenv('{}_SERVICE_HOST'.format(rmqServiceName)), os.getenv('{}_SERVICE_PORT'.format(rmqServiceName))
		else:
			print("pointing to local")
			rmq_host, rmq_port = os.getenv('rmq_host') or 'localhost', os.getenv('{}_SERVICE_PORT') or '5672'
		
		print('rmq_host: {} and rmq_port: {}'.format(rmq_host, rmq_port))
		self.__connection = pika.BlockingConnection(pika.ConnectionParameters(host=rmq_host, port=rmq_port, credentials=self.__credentials))
		self.__channel = self.__connection.channel()
		self.queue = queue

	def __getMessage(self,ch, method, properties, body):

		print("--> in callback")
		payload = json.loads(body.decode('utf8'))
		print("Message:",payload)
		Processor(payload)

	def consume(self):
		self.__channel.queue_declare(queue=self.queue, durable=True)
		self.__channel.basic_consume(queue=self.queue, auto_ack = True, on_message_callback = self.__getMessage)
		self.__channel.start_consuming()
