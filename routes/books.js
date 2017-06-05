'use strict';

const express = require('express');
const humps = require('humps');
const knex = require('../knex');

// eslint-disable-next-line new-cap
const router = express.Router();

router.get('/books', (req, res, next) => {
  knex('books').orderBy('title')
    .then((result) => {
      var camel = humps.camelizeKeys(result);
      res.send(camel);
    })
    .catch(err => {
      next(err);
    });
});

router.get('/books/:id', (req, res, next) => {
  knex('books').select().orderBy('id')
    .then((result) => {
      var camel = humps.camelizeKeys(result[0]);
      res.send(camel);
    })
    .catch(err => {
      next(err);
    });
});

router.post('/books', (req, res, next) => {
  knex.max('id').from('books').then(function(table) {
    req.body['id'] = table[0]['max'] + 1;
     knex('books').insert(req.body);
     res.send(req.body);
  });
});

router.patch('/books/:id', (req, res, next) => {
  knex.max('id').from('books').then(function(table) {
    req.body['id'] = 1;
     knex('books').insert(req.body);
     res.send(req.body);
  });
});

router.delete('/books/:id', (req, res, next) => {
knex('books').where({id: req.params.id}).then(function(book){
  var entry = humps.camelizeKeys(book[0]);
  delete entry.id;
  knex.del('books').where({id:req.params.id});
  res.send(entry);
});
});

module.exports = router;
