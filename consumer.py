#!/usr/bin/env python

import pika
import json
import os
from processor import Processor

class Consumer:
	def __init__(self) -> None:
		print(os.getenv('rmq_user'), os.getenv('rmq_password'), os.getenv('rmq_host'))
		self.__credentials = pika.PlainCredentials(os.getenv('rmq_user') or 'guest',os.getenv('rmq_password') or 'guest')
		self.__connection = pika.BlockingConnection(pika.ConnectionParameters(host= os.getenv('rmq_host') or 'localhost', credentials=self.__credentials))
		self.__channel = self.__connection.channel()

	def __getMessage(self,ch, method, properties, body):
		print("--> in callback")
		payload = json.loads(body.decode('utf8'))
		print("Message:",payload)
		Processor(payload)

	def consume(self,queue):
		self.__channel.queue_declare(queue=queue, durable=True)
		self.__channel.basic_consume(queue=queue, auto_ack = True, on_message_callback = self.__getMessage)
		self.__channel.start_consuming()
