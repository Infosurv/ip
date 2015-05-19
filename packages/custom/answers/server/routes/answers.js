'use strict';

/* jshint -W098 */
// The Package is past automatically as first parameter
module.exports = function(Answers, app, auth, database) {
  app.get('/api/answers', function(req, res, next) {
    res.send([
      {
        id: 0987654,
        survey_id: 134,
        text: 'im some answer text'
      },
      {
        id: 0987655,
        survey_id: 134,
        text: 'im some answer text also'
      },
    ]);
  });

  app.post('/api/answers', function(req, res, next) {
    var answers = req.body.answers;
    //run a loop over the answers and save each one.

  });

  app.get('/answers/example/render', function(req, res, next) {
    Answers.render('index', {
      package: 'answers'
    }, function(err, html) {
      //Rendering a view from the Package server/views
      res.send(html);
    });
  });
};
