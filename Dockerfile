FROM python:3.8.10
RUN mkdir /ingestor
WORKDIR /ingestor

# ADD . .
# ADD . /ingestor
# RUN pipenv shell

# ==================================
COPY ./requirements.txt /ingestor/requirements.txt

RUN apt-get -y update

RUN python -m pip install --upgrade pip
RUN pip3 install numpy

# Required for rioxarray
RUN apt install -y libgdal-dev

# Required for Cartopy
RUN apt-get install -y libproj-dev proj-bin proj-data
RUN apt-get install -y libgeos-dev python3-dev
RUN pip3 uninstall -y shapely
RUN pip3 install --no-binary shapely shapely

RUN pip3 install -r requirements.txt

RUN touch $HOME/.netrc && echo "machine urs.earthdata.nasa.gov login asangar password Cloud_Elves123" >> $HOME/.netrc && chmod 0600 $HOME/.netrc

# ==================================
COPY . /ingestor

CMD ["python","./main.py"]