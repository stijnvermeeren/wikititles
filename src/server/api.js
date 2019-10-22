const express = require('express')
const router = express.Router()
const { spawn } = require('child_process')

const data = require('../../data/data')

const maxResults = 1000

async function grep(file, regex, caseSensitive) {
  return new Promise((resolve, reject) => {
    const caseInsensitiveFlag = caseSensitive ? [] : ['-i']
    const grep = spawn('grep', caseInsensitiveFlag.concat([regex, file]));

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
  const caseSensitive = !!req.query.caseSensitive
  const caseSensitiveResults = !!req.query.caseSensitiveResults

  const promises = data.map(({languageId, dataFile}) => {
    return grep(`data/${dataFile}`, regex, caseSensitive).then(languageResults => {
      return {
        languageId,
        languageResults
      }
    })
  })

  await Promise.all(promises).then(results => {
    const resultMap = new Map()

    function normaliseResult(article) {
      return caseSensitiveResults ? article : article.toLowerCase()
    }

    results.forEach(({languageId, languageResults}) => {
      languageResults.forEach(article => {
        const key = normaliseResult(article)
        if (resultMap.has(key)) {
          const languageIds = resultMap.get(key).languageIds
          if (!languageIds.includes(languageId)) {
            resultMap.get(key).languageIds.push(languageId)
          }
        } else {
          resultMap.set(key, {article, languageIds: [languageId]})
        }
      })
    })

    const combinedResults = [...resultMap.entries()].sort().map(item => item[1])
    console.log(combinedResults)

    res.end(JSON.stringify(combinedResults.slice(0, maxResults)))
  }).catch(next)
})

module.exports = router
