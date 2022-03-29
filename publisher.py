#!/usr/bin/env python

import pika
import json
import os

class Publisher:
	def __init__(self) -> None:
		self.credentials = pika.PlainCredentials(os.getenv('rmq_user') or 'elves',os.getenv('rmq_password') or 'cloudelves')
		
		if os.getenv('rmq_service_name'):
			print("pointing to kubernetes cluster")
			rmqServiceName = os.getenv('rmq_service_name')
			rmq_host, rmq_port = os.getenv('{}_SERVICE_HOST'.format(rmqServiceName)), os.getenv('{}_SERVICE_PORT'.format(rmqServiceName))
		else:
			print("pointing to local")
			rmq_host, rmq_port = os.getenv('rmq_host') or 'localhost', os.getenv('{}_SERVICE_PORT') or '5672'
		print('rmq_host: {} and rmq_port: {}'.format(rmq_host, rmq_port))
		self.connection = pika.BlockingConnection(pika.ConnectionParameters(host=rmq_host, port=rmq_port, credentials=self.credentials))
		self.channel = self.connection.channel()

	
	def publish(self,queue,exchange,body):
		self.channel.exchange_declare(exchange='elvesExchange',exchange_type='direct', durable=True)
		self.channel.basic_publish(exchange='', routing_key=queue, body=json.dumps(body), properties=pika.BasicProperties())
		print("---> Message sent to queue:",queue)
		self.connection.close()