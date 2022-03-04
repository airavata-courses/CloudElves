from consumer import Consumer
import os
if __name__ == "__main__":
    obj = Consumer()
    print("here")
    obj.consume(os.getenv('data_input_queue') or "elves.ingestor.data.in")