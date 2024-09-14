# Poema del día
Generate the poem of the day for a Facebook page.

This is a tool to choose a poem of the day, and to post it on the Facebook page [Francisco Álvarez Hidalgo](https://www.facebook.com/poesiadelmomento).

This script is open source, even though it's very specific and surely of limited interest to anybody else :)

As of today (2024), the actual database of poems isn't open source. A small sample database of some "lorem ipsum" poem content is provided here so the script can be tested by anybody else who is so bored they're actually testing this.

Pre-requisites:
* Install nodejs
* Run `npm install`
* On Facebook:
  - Create an app.
  - Create a page.
  - Get a short-lived user access token: https://developers.facebook.com/tools/explorer/
  - Exchange this token for a long-lived page access token: `npx tsx src/fetch-token.ts <short-lived user access token>`

Usage:
```
npx tsx src/post-poem.ts </path/to/db> <long-lived page access token>
```