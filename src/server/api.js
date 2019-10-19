const express = require('express')
const router = express.Router()
const { spawn } = require('child_process');

const maxResults = 1000

router.get('/', function (req, res, next) {
  const regex = req.query.regex
  const grep = spawn('grep', ['-i', regex, 'data/enwiki']);

  let results = []
  let error = ''
  let earlyStopping = false

  grep.stdout.on('data', (data) => {
    const newResults = data.toString().split('\n').filter(value => value.length > 0)
    results = results.concat(newResults)
    if (results.length > maxResults) {
      earlyStopping = true
      grep.kill()
    }
  });

  grep.stderr.on('data', (data) => {
    error += data.toString()
  });

  grep.on('exit', (code) => {
    // grep exit codes: 0 = match found, 1 = no match found, 2 = error
    if (code === 0 || code === 1 || earlyStopping) {
      // return at most 1000 results
      res.end(JSON.stringify(results.slice(0, maxResults)))
    } else {
      next(new Error(`Error for regex "${regex}": ${error}`))
    }
  })
})

module.exports = router

