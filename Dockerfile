# Use Python 3.8 as the base image
FROM python:3.8

RUN rm /bin/sh && ln -s /bin/bash /bin/sh

RUN apt-get -y update
RUN apt-get install -y curl nano wget nginx git


RUN wget -qO - https://www.mongodb.org/static/pgp/server-4.4.asc | apt-key add - \
    && echo "deb http://repo.mongodb.org/apt/debian buster/mongodb-org/4.4 main" | tee /etc/apt/sources.list.d/mongodb-org-4.4.list

# Install libssl1.1 for MongoDB compatibility
RUN echo "deb http://archive.debian.org/debian/ stretch main" | tee /etc/apt/sources.list.d/stretch.list
RUN apt-get update \
    && apt-get install -y libssl1.1 mongodb-org

# Install Yarn
RUN curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add - \
    && echo "deb https://dl.yarnpkg.com/debian/ stable main" | tee /etc/apt/sources.list.d/yarn.list \
    && apt-get update \
    && apt-get install -y yarn

# Install PIP
RUN curl https://bootstrap.pypa.io/get-pip.py -o get-pip.py && \
    python get-pip.py && \
    rm get-pip.py


ENV ENV_TYPE=staging
ENV MONGO_HOST=mongo
ENV MONGO_PORT=27017


ENV PYTHONPATH=$PYTHONPATH:/src/

# Copy the dependencies file to the working directory
COPY src/requirements.txt .

# Install  dependencies
RUN pip install --no-cache-dir -r requirements.txt
