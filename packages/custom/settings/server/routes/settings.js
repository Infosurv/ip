'use strict';

var util        = require('util');
var mongoose    = require('mongoose');
var Setting     = mongoose.model('Setting');


/* jshint -W098 */
// The Package is past automatically as first parameter
module.exports = function(Settings, app, auth, database) { 
  app.route('/api/settings/app')
  .get(function(req, res){
    var host;
    
    var settings   = Setting.find({survey_id: 0}, function(err, settings){
      settings.type = 'app';
      //host    = (typeof process.env.APPHOST !== 'undefined') ?  process.env.APPHOST : 'http://intengopear.com';
      //settings.host = host;
      res.status(200).send(settings); 
    });
  })
  .post(function(req, res){
    var appHost     = req.body.appHost;

    console.log('post body');
    console.log(util.inspect(req.body));

    var setting     = new Setting(req.body);
    
    console.log('Creating setting');
    console.log(util.inspect(setting));

    setting.save(function(err){
      if(err){
        console.log(err);
        return res.status(500).send('Oops, setting creation error.');
      }

      return res.status(200).json(setting);
    });
  })
  .put(function(req, res){
    var survey_id = 0;
    var settings  = req.body;
    
    Setting.findOneAndUpdate({survey_id: survey_id}, settings, function(err, setting){
      if(err){
        console.log(err);
        return res.status(500).send('Oops, setting creation error.');
      }

      return res.status(200).json(settings);
    });
  });

  app.route('/api/settings/survey/:survey_id')
  .get(function(req, res){
    var sid         = req.params.survey_id;
    console.log('fetching settings for survey: ' + sid);

    var settings    = Setting.findOne({survey_id: sid}, function(err, settings){
      if(typeof settings == 'undefined' || settings == null) settings = {};
      settings.type = 'survey';
      if(typeof settings.length == 'undefined') settings = [settings];

      res.status(200).send(settings); 
    });
  })
  .post(function(req, res){
    var setting     = new Setting(req.body);

    setting.save(function(err){
      if(err){
        console.log(err);
        return res.status(500).send('Oops, setting creation error.');
      }

      return res.status(200).json(setting);
    });
  })
  .put(function(req, res){
    var survey_id = req.body.survey_id;
    var settings  = req.body;

    Setting.findOneAndUpdate({survey_id: survey_id}, settings, function(err, setting){
      if(err){
        console.log(err);
        return res.status(500).send('Oops, setting creation error.');
      }

      return res.status(200).json(settings);
    });
  });
};

/*
exports.create    = function(req, res, next){
  var question  = new Question(req.body);
  console.log('Creating question', question);

  question.save(function(err){
      if(err){
        console.log(err);
        return res.status(500).send('Oops, question creation error.');
      }

      return res.status(200).json(question);
    });
};

exports.update        = function(req, res, next){
  var content       = req.body;
  var query       = { _id : content._id };
  var data      = { survey_id: content.survey_id, delay: parseInt(content.delay), secondaryDelay: parseInt(content.secondaryDelay), description: content.description, indecision_options: content.indecision_options, styles: content.styles };
  
  Question.findOneAndUpdate(query, data, function(err, doc){
    if (err) return res.send(500, { error: err });
      return res.send(data);
  });
};
*/