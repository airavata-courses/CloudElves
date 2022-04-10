from consumer.consumer import Consumer
import os
from flask import Flask
import threading

from flask_controller.default_controllers import simple_page

print('starting flask server..')
app = Flask(__name__)
app.register_blueprint(simple_page)
def foo(p):
    print('Process:', p)
    obj = Consumer(os.getenv('data_input_queue') or "elves.ingestor.data.in")
    obj.consume()

if __name__ == "__main__":
    numConsumers = int(os.getenv('numConsumers') or 2)
    subscriber_list = []
    process_list = []

    l1CacheMutex = threading.Lock()
    plotMutex = threading.Lock()

    print('starting consumers on nexrad data')

    for i in range(numConsumers):
        consumer = Consumer(os.getenv('data_input_queue') or "elves.ingestor.nexrad.data.in", l1CacheMutex, plotMutex)
        consumer.start()

    print('starting consumers on mera data')
    for i in range(numConsumers):
        consumer = Consumer(os.getenv('data_input_queue') or "elves.ingestor.mera1.data.in", l1CacheMutex, plotMutex)
        consumer.start()

    app.run(host='0.0.0.0', port=int(os.getenv('ingestor_http_port') or 8083))

