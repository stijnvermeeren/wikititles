# wikititles

## Installation

Download all dependencies using [npm](https://www.npmjs.com/get-npm) by executing `npm install`.

Download the relevant [Wikipedia dumps](https://dumps.wikimedia.org/backup-index-bydb.html), i.e. the "all-titles-in-ns0" dump for all the relevant languages, and unzip them into the `data` folder.

Create a file `data/data.js` that contains a list of all the data files and corresponding language identifiers. E.g.
```javascript
module.exports = [
  {
    languageId: 'en',
    dataFile: 'enwiki-20191020-all-titles'
  }
]
```
where `data/enwiki-20191020-all-titles` is the file containing the page titles for the English wikipedia. The `languageId` must correspond to the wikipedia.org subdomain, e.g. in this case `https://en.wikipedia.org`.


## Running in development

Start with `npm run serve` or (with [nodemon](https://nodemon.io/) for the server) `nodemon --exec 'npm run serve'`.
