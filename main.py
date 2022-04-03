from consumer.consumer import Consumer
import os

def foo(p):
    print('Process:', p)
    obj = Consumer(os.getenv('data_input_queue') or "elves.ingestor.data.in")
    obj.consume()

if __name__ == "__main__":
    numConsumers = int(os.getenv('numConsumers') or 2)
    subscriber_list = []
    process_list = []

    for i in range(numConsumers):
        consumer = Consumer(os.getenv('data_input_queue') or "elves.ingestor.data.in")
        consumer.start()

    for i in range(numConsumers):
        consumer = Consumer(os.getenv('merra_data_input_queue') or "elves.ingestor.merra.in")
        consumer.start()