const express = require('express')
const router = express.Router()
const NodeCouchdb = require('node-couchdb')

const couch = new NodeCouchdb({
  auth: {
    user: 'admin',
    password: 'admin'
  }
})

const dbName = 'mycompany'
const viewUrl = '_design/company-design/_view/company-view'

couch.listDatabases().then(dbs => {
  console.info(dbs)
})

router.get('/', (req, res) => {
  couch.get(dbName, viewUrl).then(({data, headers, status}) => {
    res.render('index', {
      users: data.rows
    })
  }, err => {
    res.send(err)
  })
})

router.post('/user/add', (req, res) => {
  const name = req.body.name
  const email = req.body.email
  const username = req.body.username
  // get one unique id
  couch.uniqid().then(ids => {
    const id = ids[0]

    couch.insert(dbName, {
      _id: id,
      name,
      email,
      username
    }).then(({data, headers, status}) => {
      res.redirect('/')
    }, err => {
      res.send(err)
    })
  })
})

router.delete('/user/remove/:id', (req, res) => {
  const id = req.body.id
  const rev = req.body.rev
  couch.del(dbName, id, rev).then(({data, headers, status}) => {
    res.redirect('/')
  }, err => {
    res.send(err)
  })
})

router.put('/user/update/:id', (req, res) => {
  const id = req.body.id
  const rev = req.body.rev
  // TODO: merge objects
  const name = req.body.name
  const email = req.body.email
  const username = req.body.username
  couch.update(dbName, {
    _id: id,
    _rev: rev,
    name,
    email,
    username
  }).then(({data, headers, status}) => {
    res.redirect('/')
  }, err => {
    res.send(err)
  })
})

module.exports = router
