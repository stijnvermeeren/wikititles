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
    console.log('data', results.length)
    results = results.concat(data.toString().split('\n'))
    if (results.length > maxResults) {
      earlyStopping = true
      grep.kill()
    }
  });

  grep.stderr.on('data', (data) => {
    error += data.toString()
  });

  grep.on('exit', (code) => {
    if (code === 0 || earlyStopping) {
      // return at most 1000 results
      res.end(JSON.stringify(results.slice(0, maxResults)))
    } else {
      next(new Error(error))
    }
  })
})

module.exports = router

