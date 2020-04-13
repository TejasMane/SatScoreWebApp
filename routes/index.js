var express = require('express');
var router = express.Router();
var path = require('path');

// Connect string to MySQL
var mysql = require('mysql');
var connection = mysql.createConnection({
  host: 'cis450550-1.c4dt1opq0rso.us-east-1.rds.amazonaws.com',
  user: 'CIS450550',
  password: 'CIS450550!',
  database: 'cis450550',
  port: '3306'
});

connection.connect(function (err) {
  if (err) {
    console.log("Error Connection to DB" + err);
    return;
  }
  console.log("Connection established...");
});

/* GET home page. */
router.get('/login.html', function (req, res) {
  res.sendFile(path.join(__dirname, '../', 'views', 'login.html'));
});

router.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, '../', 'views', 'dashboard.html'));
});

router.get('/predict-score-by-par-edu', function (req, res) {
  res.sendFile(path.join(__dirname, '../', 'views', 'predict-score-by-par-edu.html'));
});

router.get('/predict-score-by-race-inc', function (req, res) {
  res.sendFile(path.join(__dirname, '../', 'views', 'predict-score-by-race-inc.html'));
});

router.get('/show-colleges', function (req, res) {
  res.sendFile(path.join(__dirname, '../', 'views', 'show-colleges.html'));
});

router.get('/predict-score-by-intended-major', function (req, res) {
  res.sendFile(path.join(__dirname, '../', 'views', 'predict-score-by-intended-major.html'));
});


router.get('/inverse-predictor', function (req, res) {
  res.sendFile(path.join(__dirname, '../', 'views', 'inverse-predictor.html'));
});

router.get('/predict-score-by-deg-goals', function (req, res) {
  res.sendFile(path.join(__dirname, '../', 'views', 'predict-score-by-deg-goals.html'));
});

router.get('/predict-score-by-first-language', function (req, res) {
  res.sendFile(path.join(__dirname, '../', 'views', 'predict-score-by-first-language.html'));
});

router.get('/reference', function (req, res) {
  res.sendFile(path.join(__dirname, '../', 'views', 'reference.html'));
});

// To add a new page, use the templete below
/*
router.get('/routeName', function(req, res) {
  res.sendFile(path.join(__dirname, '../', 'views', 'fileName.html'));
});
*/

// Login uses POST request

router.post('/login', function (req, res) {
  // use console.log() as print() in case you want to debug, example below:
  // console.log(req.body); will show the print result in your terminal

  // req.body contains the json data sent from the loginController
  // e.g. to get username, use req.body.username

  var query = "INSERT query here"; /* Write your query here and uncomment line 21 in javascripts/app.js*/
  connection.query(query, function (err, rows, fields) {
    console.log("rows", rows);
    console.log("fields", fields);
    if (err) console.log('insert error: ', err);
    else {
      res.json({
        result: 'success'
      });
    }
  });
});

router.post('/postStateEdu', function (req, res) {
  // use console.log() as print() in case you want to debug, example below:
  // console.log(req.body); will show the print result in your terminal

  // req.body contains the json data sent from the loginController
  // e.g. to get username, use req.body.username

  var query = "SELECT Total, ERW, Math, avg.average AS average FROM Parental_education, (SELECT Avg(Total) AS average FROM Parental_education WHERE parental_education = '" + req.body.parental_education + "') AS avg WHERE state = '" + req.body.state + "' AND parental_education = '" + req.body.parental_education + "';"
  connection.query(query, function (err, rows, fields) {
    console.log("rows", rows);
    console.log("fields", fields);
    if (err) console.log('insert error: ', err);
    else {
      res.json({
        result: 'success',
        row: rows
      });
    }
  });
});

router.post('/postRaceInc', function (req, res) {
  // use console.log() as print() in case you want to debug, example below:
  // console.log(req.body); will show the print result in your terminal

  // req.body contains the json data sent from the loginController
  // e.g. to get username, use req.body.username

  var query = "SELECT re.Total AS total_from_race, re.ERW AS ERW_from_race, re.Math AS Math_from_race, i.Total AS total_from_income, i.ERW AS ERW_from_income, i.Math AS Math_from_income FROM Race_ethnicity re, Income i WHERE re.Race = '" + req.body.race + "' AND " + req.body.income_low_range + " = i.low_range AND re.state = '" + req.body.state + "';";
  connection.query(query, function (err, rows, fields) {
    console.log("rows", rows);
    console.log("fields", fields);
    if (err) console.log('insert error: ', err);
    else {
      res.json({
        result: 'success',
        row: rows
      });
    }
  });
});

router.get('/predictByEdu', function (req, res) {
  var query = 'select distinct parental_education from Parental_education order by parental_education;';
  console.log("reached");

  connection.query(query, function (err, rows, fields) {
    console.log("rows:" + rows);
    if (err) console.log(err);
    else {
      res.json({
        result: 'success',
        row: rows
      });
    }
  });
});

router.get('/fillStates', function (req, res) {
  var query = 'select state from State_code'
  connection.query(query, function (err, rows, fields) {
    if (err) console.log(err);
    else {
      res.json({
        result: 'success',
        row: rows
      });
    }
  });

});

router.get('/fillRace', function (req, res) {
  var query = 'select distinct Race AS race from Race_ethnicity'
  connection.query(query, function (err, rows, fields) {
    if (err) console.log(err);
    else {
      res.json({
        result: 'success',
        row: rows
      });
    }
  });

});

router.get('/populateIncome', function (req, res) {
  var query = 'select low_range, up_range from Income order by low_range;';
  connection.query(query, function (err, rows, fields) {
    console.log("rows:" + rows);
    if (err) console.log(err);
    else {
      res.json({
        result: 'success',
        row: rows
      });
    }
  });
});


router.get('/getSatScore/:customParameter1/:customParameter2', function (req, res) {

  var myMATH = req.params.customParameter1; // if you have a custom parameter
  var myERW = req.params.customParameter2;
  var mySAT = parseInt(myMATH) + parseInt(myERW);
  // console.log("myData3 is ", myData3);
  var query = 'SELECT college, region, SAT2 AS total_score_75, ERW2 AS ERW_score_75, Math2 AS Math_score_75 FROM ScoreColleges WHERE ? > SAT2 AND ? > ERW2 AND ? > Math2 ORDER BY total_score_75 DESC;';
  var values = [mySAT, myERW, myMATH];
  console.log("Query is " + query);
  connection.query(query, values, function (err, rows, fields) {
    if (err) console.log(err);

    res.json(rows);

  });
});

router.get('/getSatScoreInverse/:customParameter1', function (req, res) {
  var mySAT = req.params.customParameter1; // if you have a custom parameter
  // console.log("myData3 is ", myData3);
  var query = 'SELECT im.intended_major as intended_major, AVG(im.Total) as avg FROM Intended_major im GROUP BY intended_major HAVING avg < ? ORDER BY avg  DESC;';
  var values = [mySAT];
  console.log("Query is " + query);
  connection.query(query, values, function (err, rows, fields) {
    if (err) console.log(err);

    res.json(rows);

  });
});

router.get('/predictByDegGoals/:customParameter1/:customParameter2', function (req, res) {
  var deg_goal = req.params.customParameter1; // if you have a custom parameter
  var state = req.params.customParameter2;
  // console.log("myData3 is ", myData3);
  var query = 'SELECT Total, ERW, Math FROM Degree_goal WHERE degree_goal = "'+ deg_goal +'" AND state = "'+ state +'";';
  var values = [deg_goal, state];
  console.log("Query is " + query);
  connection.query(query, values, function (err, rows, fields) {
    if (err) console.log(err);

    res.json({
      result: 'success',
      row: rows
    });

  });
});

router.get('/fillDegGoals', function (req, res) {
  var query = 'select distinct degree_goal from Degree_goal'
  connection.query(query, function (err, rows, fields) {
    if (err) console.log(err);
    else {
      res.json({
        result: 'success',
        row: rows
      });
    }
  });

});


router.get('/GetHighSchoolRaceProp/:customParameter', function (req, res) {

  var myState = req.params.customParameter; // if you have a custom parameter
  var query = 'SELECT Race AS Race, ((number * 100.0) / (SELECT SUM(re.number) FROM Race_ethnicity re WHERE state = "'+myState+'")) AS Proportion FROM Race_ethnicity WHERE state = "'+myState+'";';
  var values = [myState];
  console.log("Query is " + query);
  connection.query(query, values, function (err, rows, fields) {
    if (err) console.log(err);

    res.json(rows);

  });
});

router.get('/getAboveMeanStates/:customParameter', function (req, res) {

  var mySAT = req.params.customParameter; // if you have a custom parameter
  // console.log("myData3 is ", myData3);
  var query = 'SELECT DISTINCT average_major.major AS Major, average_major.avg_score AS  average_score FROM ( SELECT AVG(Total) AS avg_score, intended_major AS major   FROM Intended_major GROUP BY intended_major ) AS average_major  WHERE ? > average_major.avg_score  ORDER BY average_score DESC;';
  var values = [mySAT];
  console.log("Query is " + query);
  connection.query(query, values, function (err, rows, fields) {
    if (err) console.log(err);

    res.json(rows);

  });
});

// Intended Major Requests
router.post('/postStateMajor', function (req, res) {
  // use console.log() as print() in case you want to debug, example below:
  // console.log(req.body); will show the print result in your terminal

  // req.body contains the json data sent from the loginController
  // e.g. to get username, use req.body.username

  var query = "SELECT Total, ERW, Math, avg.average AS average FROM Intended_major, (SELECT Avg(Total) AS average FROM Intended_major WHERE intended_major = '" + req.body.intended_major + "') AS avg WHERE state = '" + req.body.state + "' AND intended_major = '" + req.body.intended_major + "';"
  connection.query(query, function (err, rows, fields) {
    console.log("rows", rows);
    console.log("fields", fields);
    if (err) console.log('insert error: ', err);
    else {
      res.json({
        result: 'success',
        row: rows
      });
    }
  });
});

router.get('/predictByMajor', function (req, res) {
  var query = 'select distinct intended_major from Intended_major order by intended_major;';
  console.log("reached");

  connection.query(query, function (err, rows, fields) {
    console.log("rows:" + rows);
    if (err) console.log(err);
    else {
      res.json({
        result: 'success',
        row: rows
      });
    }
  });
});

router.post('/postOutOfState', function(req, res) {
  // use console.log() as print() in case you want to debug, example below:
  // console.log(req.body); will show the print result in your terminal

  // req.body contains the json data sent from the loginController
  // e.g. to get username, use req.body.username

  var query = "SELECT ss.institution, sc.state FROM State_code AS sc JOIN Score_sent_to AS ss ON sc.code = ss.institution_state_code WHERE ss.from_state = '"+req.body.state+"' AND sc.code NOT IN ( SELECT sc1.code FROM State_code AS sc1 WHERE sc1.state = '"+req.body.state+"' ) ORDER BY ss.number DESC;"
  connection.query(query, function(err, rows, fields) {
    console.log("rows", rows);
    console.log("fields", fields);
    if (err) console.log('insert error: ', err);
    else {
      res.json(
        rows
      );
    }
  });
});


// First Language Learned Requests
router.post('/postStateFirstLanguage', function (req, res) {
  // use console.log() as print() in case you want to debug, example below:
  // console.log(req.body); will show the print result in your terminal

  // req.body contains the json data sent from the loginController
  // e.g. to get username, use req.body.username

  var query = "SELECT Total, ERW, Math, avg.average AS average FROM First_language_learned, (SELECT Avg(Total) AS average FROM First_language_learned WHERE first_language = '" + req.body.first_language + "') AS avg WHERE state = '" + req.body.state + "' AND first_language = '" + req.body.first_language + "';"
  connection.query(query, function (err, rows, fields) {
    console.log("rows", rows);
    console.log("fields", fields);
    if (err) console.log('insert error: ', err);
    else {
      res.json({
        result: 'success',
        row: rows
      });
    }
  });
});

router.get('/predictByFirstLanguage', function (req, res) {
  var query = 'select distinct first_language from First_language_learned order by first_language;';
  // console.log("reached");

  connection.query(query, function (err, rows, fields) {
    console.log("rows:" + rows);
    if (err) console.log(err);
    else {
      res.json({
        result: 'success',
        row: rows
      });
    }
  });
});

// template for GET requests
/*
router.get('/routeName/:customParameter', function(req, res) {

  var myData = req.params.customParameter;    // if you have a custom parameter
  var query = '';

  // console.log(query);

  connection.query(query, function(err, rows, fields) {
    if (err) console.log(err);
    else {
      res.json(rows);
    }
  });
});
*/

module.exports = router;
