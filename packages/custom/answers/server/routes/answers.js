'use strict';

var answersController = require('../controllers/answers');

/* jshint -W098 */
// The Package is past automatically as first parameter
module.exports = function(Answers, app, auth, database) {
  app.route('/api/answers')
    .get(answersController.index)
    .post(answersController.create)
    .put(answersController.update)
    .delete(answersController.delete);
};
