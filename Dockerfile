FROM python:3
RUN mkdir /ingestor
WORKDIR /ingestor
ADD . .
# ADD . /ingestor
RUN pip install nexradaws pika
CMD ["python","./main.py"]


