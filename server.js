var express = require('express');
var app = express();
var path = require('path');
var bodyParser = require('body-parser');
var pg = require('pg');

// globals
var port = 8080;
var config = {
  database: 'todo',
  host: 'localhost',
  port: 5432, // default port for localhost postgres databases
  max: 12
};

var pool = new pg.Pool(config);

// uses
app.use(express.static('public'));
app.use(bodyParser.urlencoded({
  extended: true
}));

// spin up server
app.listen(port, function() {
  console.log('server is up on:', port);
});

// base url
app.get('/', function(req, res) {
  console.log('in base url');
  res.sendFile(path.resolve('views/index.html'));
}); // end base url

app.get('/tasks', function(req, res) {
  console.log('get tasks');
  pool.connect(function(err, connection, done) {
    if (err) {
      console.log('error');
      done();
      res.send(400);
    } else {
      console.log('connected to db');
      var allTasks = [];
      var resultSet = connection.query('SELECT * FROM todolist');
      resultSet.on('row', function(row) {
        allTasks.push(row);
      }); //end resultSet
      resultSet.on('end', function() {
        done();
        res.send(allTasks);
      }); //end end resultSet
    }
  });
}); //done pool get

// post route
app.post('/add', function(req, res) {
  console.log('post hit to /addtasks:', req.body);
  pool.connect(function(err, connection, done) {
    if (err) {
      console.log('error');
      done();
      res.send(400);
    } else {
      console.log('connected to DB');
      connection.query("INSERT INTO todolist (task) Values ('" + req.body.task + "' )");
      done();
      res.send(200);
    } //end else
  }); //end pool connect
});

app.post('/update', function(req, res) {
  console.log('/update url hit');
  pool.connect(function(err, connection, done) {
    if (err) {
      console.log('error connection to the server');
      done();
      res.send(400);
    } //end err if
    else {
      console.log('connected to db');
      connection.query('UPDATE todolist SET completed = $1 WHERE id = $2', [true, req.body.id]);
      done();
      res.send(200);
    } // end elseif
  }); //end pool.connec
  res.send(200);
});

app.post('/updateagain', function(req, res) {
  console.log('/updateagain url hit');
  pool.connect(function(err, connection, done) {
    if (err) {
      console.log('error connection to the server');
      done();
      res.send(400);
    } //end err if
    else {
      console.log('connected to db');
      connection.query('UPDATE todolist SET completed = $1 WHERE id = $2', [false, req.body.id]);
      done();
      res.send(200);
    } // end elseif
  }); //end pool.connec
  res.send(200);
});

app.delete('/delete', function(req, res) {
  res.send('DELETE request to homepage');
  pool.connect(function(err, connection, done) {
    if (err) {
      console.log('error');
      done();
      res.send(400);
    } else {
      console.log('connected to DB');
      console.log(req.body.id);
      connection.query('DELETE FROM todolist WHERE id = $1', [req.body.id]);
      done();
      res.send(200);
    } //end else
  }); //end pool connect
});
