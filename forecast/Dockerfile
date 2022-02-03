# The first instruction is what image we want to base our container on
# We Use an official Python runtime as a parent image
FROM python:3

RUN apt-get update
RUN apt-get install -y --no-install-recommends
ENV PYTHONDONTWRITEBYTECODE=1

# The enviroment variable ensures that the python output is set straight
# to the terminal with out buffering it first
ENV PYTHONUNBUFFERED 1
ENV PATH=/root/.local/bin:$PATH

# create root directory for our project in the container
RUN mkdir /forecaster

# Set the working directory to /music_service
WORKDIR /forecaster

# Copy the current directory contents into the container at /music_service
ADD . /forecaster/

# Install any needed packages specified in requirements.txt
# RUN pip3 install -r requirements.txt
RUN python3 -m pip install --user -r requirements.txt

ENTRYPOINT ["python3","forecast/manage.py", "runserver"]
