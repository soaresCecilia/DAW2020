var express = require('express');
var router = express.Router();

var Student = require('../controllers/student')

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/students', function(req, res) {
  // Data retrieve
  Student.list()
    .then(data => res.render('students', { list: data }))
    .catch(err => res.render('error', {error: err}))
  ;
});

router.get('/:idStudent', function(req, res) {
  Student.lookUp(req.params.idStudent)
    .then(data => res.render('student', { Student: data }))
    .catch(err => res.render('error', {error: err}))
    ;
});

router.get('/students/registar', function(req, res) {
  Student.list()
    .then(data => res.render('students', { list: data }))
    .catch(err => res.render('error', {error: err}))
    ;
});

router.post('/students/eliminar/:idStudent', function(req, res){
  Student.delete(req.params.idStudent)
    .then(data => res.render('ok', { ok: data }))
    .catch(err => res.render('error', {error: err}))
    ;
});


router.get('/students/editar/:idStudent', function(req, res) {
  Student.lookUp(req.params.idStudent)
    .then(data => res.render('studentUpdate', { Student: data }))
    .catch(err => res.render('error', {error: err}))
    ;
});


//post insere se o id não funcionar
router.post('/students', function(req, res, next) {
  console.log("AQUI -> " + req.body.numero);

  Student.consult(req.body.numero, function(err, student) {
    if (err) {
      res.render('error', {error: err})
    }
    else if (student) {
      res.render('studentExists')
    }
    else {
      next()
    }
  })
}, function(req, res) {
  Student.insert(req.body)
    .then(data => res.render('ok', { Student: data }))
    .catch(err => res.render('error', {error: err}))
    ;
});




//put altera
router.post('/students/alterar/:idStudent', function(req, res){
  Student.update(req.params.idStudent, req.body)
  .then(data => res.render('ok', { ok: data }))
  .catch(err => res.render('error', {error: err}))
  ;
});


module.exports = router;
