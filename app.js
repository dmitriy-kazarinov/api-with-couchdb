const express = require('express')
const bodyParser = require('body-parser')
const path = require('path')
const router = require('./routes/company')

const app = express()

const HOSTNAME = process.env.HOSTNAME || '0.0.0.0'
const PORT = process.env.PORT || 3000

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))

app.use('/', router)

app.listen(PORT, HOSTNAME, (err) => {
  let url = `http://${HOSTNAME}`

  if (err) {
    return console.error(err)
  }

  if (PORT !== 80) {
    url = url + `:${PORT}`
  }

  console.info(`==> 🌎  Running server. Open up ${url} in your browser.`)
})
