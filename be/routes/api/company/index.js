var express = require('express');
var createError = require('http-errors');
var router = express.Router();
const Company = require('../../../models/companys');

/* Routing Methods */
router.get('/home', function(req, res, next) {
  // 홈페이지에서 부대정보 받아오기 위한 get
  Company.findOne({ name: req.user.company })
    .then(r => {
      res.send({ success: true, company: r, user: req.user, token: req.token});
    })
    .catch(e => {
      res.send({ success: false });
    });
});
router.get('/register', function(req, res, next) {
  // 회원가입시에 존재하는 부대정보 받아오기 위한 get
  Company.find()
    .then(r => {
      res.send({ success: true, company: r, token: req.token });
    })
    .catch(e => {
      res.send({ success: false });
    });
});

router.all('*', function(req, res, next) {
  next(createError(404, 'company: 그런 api 없어용'));
});

module.exports = router;