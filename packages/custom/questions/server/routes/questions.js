'use strict';

var questions = require('../controllers/questions');

/* jshint -W098 */
// The Package is past automatically as first parameter
module.exports = function(Questions, app, auth, database) {
  app.route('/api/questions').get(questions.index);
  app.route('/api/questions').post(questions.create);
  app.route('/api/questions').put(questions.update);                                 //Inline updating
  app.route('/api/questions/updateQuestion/:question_id').post(questions.update);    //Detail view saving 
  app.route('/api/questions/:question_id').delete(questions.delete);

  app.get('/questions/example/anyone', function(req, res, next) {
    res.send('Anyone can access this');
  });

  app.get('/questions/example/render', function(req, res, next) {
    Questions.render('index', {
      package: 'questions'
    }, function(err, html) {
      //Rendering a view from the Package server/views
      res.send(html);
    });
  });
};
