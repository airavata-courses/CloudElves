from consumer import Consumer
import os
from multiprocessing import Process

if __name__ == "__main__":
    numConsumers = os.getenv('numConsumers') or 10
    numConsumers = int(numConsumers)
    subscriber_list = []
    
    for i in range(numConsumers):
        subscriber_list.append(Consumer(os.getenv('data_input_queue') or "elves.ingestor.data.in"))

    # execute
    process_list = []
    for sub in subscriber_list:
        process = Process(target=sub.consume)
        process.start()
        process_list.append(process)

    # wait for all process to finish
    for process in process_list:
        process.join()
    