# Poema del día
Generate the poem of the day for https://poesiadelmomento.com/poemadeldia.xml

This is a tool to generate the poem of the day, in rss format, for the poesiadelmomento.com website.
This RSS feed is used in the facebook page for [Francisco Álvarez Hidalgo](https://www.facebook.com/poesiadelmomento).

This script is open source, even though it's very specific and surely of limited interest to anybody else :)

As of today (2022), the actual database of poems isn't open source. A small sample database of some "lorem ipsum" poem content is provided here so the script can be tested by anybody else who is so bored they're actually testing this.

Pre-requisites:
* Install Python
* Optional: Activate a python virtual environment
* Run `pip install -r requirements/app.txt`

Usage:
```
python -m poemadeldia --help
usage: poemadeldia.py [-h] db

Print a random poem from a database and templates

positional arguments:
  db          Path to the poems database

options:
  -h, --help  show this help message and exit
```

Example:
```
python -m poemadeldia example/poems.db
```
