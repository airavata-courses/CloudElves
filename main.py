from consumer import Consumer
import os
from multiprocessing import Process, set_start_method

def foo(p):
        print('Process:',p)
        obj = Consumer(os.getenv('data_input_queue') or "elves.ingestor.data.in")
        obj.consume()

if __name__ == "__main__":
<<<<<<< HEAD
    # numConsumers = os.getenv('numConsumers') or 1
    # numConsumers = 1
    # subscriber_list = []

    # for i in range(numConsumers):
    #     subscriber_list.append(Consumer(os.getenv('data_input_queue') or "elves.ingestor.data.in"))
    #
    # # execute
    # process_list = []
    # for sub in subscriber_list:
    #     process = Process(target=sub.consume)
    #     process.start()
    #     process_list.append(process)
    #
    # # wait for all process to finish
    # for process in process_list:
    #     process.join()
    obj = Consumer(os.getenv('data_input_queue') or "elves.ingestor.data.in")
    obj.consume()
=======
    numConsumers = int( os.getenv('numConsumers') or 10 )
    subscriber_list = []
    process_list = []
    
    for i in range(numConsumers):
        process = Process(target=foo, args=[i] )
        process.start()
        process_list.append(process)
    
    # wait for all process to finish
    for process in process_list:
        process.join()
    
>>>>>>> b584317c86c751ebfe471f74588904f67f60db93
