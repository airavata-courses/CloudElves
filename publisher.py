#!/usr/bin/env python

import pika
import json
import os

class Publisher:
	def __init__(self) -> None:
		self.__credentials = pika.PlainCredentials(os.getenv('rmq_user') or 'guest',os.getenv('rmq_password') or 'guest')
		self.__connection = pika.BlockingConnection(pika.ConnectionParameters(host=os.getenv('rmq_host') or 'localhost', credentials=self.__credentials))
		self.__channel = self.__connection.channel()

	
	def publish(self,queue,exchange,body):
		self.__channel.exchange_declare(exchange='elvesExchange',exchange_type='direct')
		self.__channel.queue_declare(queue=queue, durable=True)

		self.__channel.queue_bind(exchange="elvesExchange", queue=queue, routing_key=queue)
		self.__channel.basic_publish(exchange='elvesExchange', routing_key=queue, body=json.dumps(body), properties=pika.BasicProperties())
		print("---> Message sent to queue:",queue)
		self.__connection.close()