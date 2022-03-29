FROM python:3
RUN mkdir /ingestor
WORKDIR /ingestor
ADD . .
# ADD . /ingestor
RUN pipenv shell
RUN pip3 install -r requirements.txt
CMD ["python","./main.py"]


