# Poema del día
Generate the poem of the day for a Facebook page.

The page is the [Poesía del Momento page](https://www.facebook.com/poesiadelmomento/
), with poems by Francisco Álvarez Hidalgo.


This is done in two ways:

* Legacy: [rss](rss) subproject:
  - Upload an rss feed to https://poesiadelmomento.com/poemadeldia.xml
  - Configure dlvr.it to read this rss and post to the Facebook page.
* New: [Facebook api](facebook) subproject:
  - Use the Facebook graph api to post to the page directly.
