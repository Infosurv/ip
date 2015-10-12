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
  
};
