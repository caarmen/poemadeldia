FROM python:3.10-slim

WORKDIR /app

RUN apt-get update && \
    apt-get install -y locales && \
    sed -i -e 's/# es_ES.UTF-8 UTF-8/es_ES.UTF-8 UTF-8/' /etc/locale.gen && \
    dpkg-reconfigure --frontend=noninteractive locales

COPY requirements/app.txt requirements.txt

RUN pip install -r requirements.txt

COPY poemadeldia.py poemadeldia.py
COPY templates templates