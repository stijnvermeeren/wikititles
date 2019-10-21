const express = require('express')
const router = express.Router()
const { spawn } = require('child_process')

const data = require('../../data/data')

const maxResults = 1000

async function grep(file, regex) {
  return new Promise((resolve, reject) => {
    const grep = spawn('grep', ['-i', regex, file]);

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
        resolve(results)
      } else {
        reject(new Error(`Error for regex "${regex}": ${error}`))
      }
    })
  })
}

router.get('/', async function (req, res, next) {
  const regex = req.query.regex

  const promises = data.map(async ({languageId, dataFile}) => {
    return {
      languageId,
      languageResults: await grep(`data/${dataFile}`, regex).catch(error => {
        throw error
      })
    }
  })

  await Promise.all(promises).then(results => {
    const flattenedResults = results.map(({languageId, languageResults}) => {
      return languageResults.map(article => {
        return {languageId, article}
      })
    }).flat()

    res.end(JSON.stringify(flattenedResults.slice(0, maxResults)))
  }).catch(next)
})

module.exports = router
