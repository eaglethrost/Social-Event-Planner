var express = require('express');
var router = express.Router();

const argon2 = require('argon2');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});


// Check if there is a user logged in

router.get('/check', function(req, res, next) {
     if (req.session.user)
     {
       res.send(req.session.user.user_type);
     }
     else
     {
       res.send('No');
     }
});

//
router.post('/user-login', function (req, res, next) {
  req.pool.getConnection(function (err) {
    if (err) throw err;
    console.log("Connected!");
    var sql = "SELECT * FROM Users WHERE email_id = '" + req.body.userEmail + "' AND user_password = '" + req.body.userPassword + "';";
    console.log(sql);
    req.pool.query(sql, function (err, result, fields) {
      if (err) throw err;
      console.log(fields);
      console.log(result);
    });
  });
  // console.log(result);
  res.redirect('/');
});


//
router.post('/form-submit', function (req, res, next) {
  if (req.body.userName === '') {
    res.redirect('/signup');
  }
  if (req.body.userFamilyName === '') {
    res.redirect('/signup');
  }
  if (req.body.userEmail) {
    res.redirect('/signup');
  }
  if (req.body.userPhone.length) {
    res.redirect('/signup');
  }
  if (req.body.userPassword != req.body.userConfirmPassword) {
    res.redirect('/signup');
  }

  req.pool.getConnection(function (err) {
    if (err) throw err;
    console.log("Connected!");
    var sql = "INSERT INTO Users (first_name, last_name, email_id, phone_no, user_password) VALUES ?";
    var values = [
      [req.body.userName, req.body.userFamilyName, req.body.userEmail, req.body.userPhone, req.body.userPassword]
    ];
    req.pool.query(sql, [values], function (err, result) {
      if (err) throw err;
      console.log("Number of records inserted: " + result.affectedRows);
    });
  });
  console.log(req.body);
  res.redirect('/');
});


//Log out of user's account
router.post('/logout', function(req, res, next)
{
    delete req.session.user;
    delete req.session.user_type;
    res.sendStatus(200);
});

//Make admin table from Database
router.get('/makeAdminTable', function(req, res, next)
{
  req.pool.getConnection(function(err, connection)
  {
    if (err)
    {
      res.sendStatus(500);
      return;
    }

    var query = "SELECT user_id, first_name, last_name, email_id, phone_no, user_type FROM Users;";
    connection.query(query, function(err, rows, fields)
    {
      connection.release();
      if (err)
      {
        res.sendStatus(500);
        return;
      }
      res.json(rows);
    });
  });
});


//Delete user from Database and admin table
router.post('/deleteUser', function(req, res, next) {
  // if (req.session.user.is_admin.data == 1) {
    if (req.session.user.user_type == 'admin') {
    req.pool.getConnection(function(err, connection) {
      if (err)
      {
        res.sendStatus(500);
        return;
      }

      var query = "DELETE FROM Users WHERE user_id=?;";
      connection.query(query, req.body.a_userid, function(err, rows, fields)
      {
        connection.release();
        if (err)
        {
          res.sendStatus(500);
          return;
        }
        res.send();
      });
    });
  } else {
    res.sendStatus(401);
  }
});


// Make user Admin
router.post('/makeAdmin', function(req, res, next) {
  // if (req.session.user.is_admin.data == 1) {
    if (req.session.user.user_type == 'admin') {
    req.pool.getConnection(function(err, connection) {
      if (err) {
        res.sendStatus(500);
        return;
      }

      // var query = "UPDATE Users SET is_admin=1 WHERE user_id = ?;";
      var query = "UPDATE Users SET user_type='admin' WHERE user_id = ?;";
      connection.query(query, req.body.a_userid, function(err, rows, fields) {
        connection.release();
        if (err) {
          res.sendStatus(500);
          return;
        } else {
          console.log('new admin assigned');
          res.sendStatus(200);
        }
      });
    });
  } else {
    res.sendStatus(401);
  }
});

//Get User Information from Database
router.get('/getUser', function(req, res, next) {
  if (req.session.user) {
    req.pool.getConnection(function(err,connection) {
      if(err) {
        res.sendStatus(500);
        return;
      }

      var query = "SELECT * FROM Users WHERE user_id = ?;";
      connection.query(query, req.session.user.user_id, function(err, rows, fields) {
        connection.release();
          if(err) {
            res.sendStatus(500);
            return;
          } if(rows.length === 0) {
            res.sendStatus(401);
            return;
          } else {
            res.json(rows[0]);
          }
          res.end();
      });
    });
  } else {
    res.sendStatus(401);
    return;
  };
});


//Update user's information in the database
router.post('/update', function(req, res, next)
{
    req.pool.getConnection(function(err,connection)
    {
        if(err)
        {
          res.sendStatus(500);
          return;
        }

        var query = "UPDATE Users SET first_name=?,last_name=?,email_id=?,phone_no=? WHERE user_id=?;";
        connection.query(query, [
                req.body.first_name,
                req.body.last_name,
                req.body.email,
                req.body.phone,
                req.session.user.user_id
            ], function(err, rows, fields)
        {
            connection.release();
            if(err)
            {
                res.sendStatus(500);
                return;
            }
            res.end();
        });
    });
});


//Change user's password
router.post('/changepassword', function(req, res, next)
{
    req.pool.getConnection(async function(err,connection) {
        if(err) {
          res.sendStatus(500);
          return;
        } try {
          req.body.password = await argon2.hash(req.body.password);
        } catch (err) {
          console.log('system error');
          res.sendStatus(500);
        }
        let query = 'UPDATE Users SET user_password = ? WHERE user_id = ?;';
        connection.query(query, [req.body.password, req.session.user.user_id], function(err, rows, fields)
        {
            connection.release();
            if(err)
            {
                res.sendStatus(500);
                return;
            }
            res.sendStatus(200);
        });
    });
});

//Make event table from Database
router.get('/makeEventTable', function(req, res, next)
{
  req.pool.getConnection(function(err, connection)
  {
    if (err)
    {
      res.sendStatus(500);
      return;
    }

    var query = "SELECT  event_id, event_title, event_creator, event_description, event_address, event_date_start, event_date_end, event_start_time, event_end_time FROM Events;";
    connection.query(query, function(err, rows, fields)
    {
      connection.release();
      if (err)
      {
        res.sendStatus(500);
        return;
      }
      res.json(rows);
    });
  });
});


//Delete event from Database and event table
router.post('/deleteEvent', function(req, res, next) {
  // if (req.session.user.is_admin.data == 1) {
    if (req.session.user.user_type == 'admin') {
    req.pool.getConnection(function(err, connection) {
      if (err)
      {
        res.sendStatus(500);
        return;
      }

      var query = "DELETE FROM Events WHERE event_id=?;";
      connection.query(query, req.body.a_eventid, function(err, rows, fields)
      {
        connection.release();
        if (err)
        {
          res.sendStatus(500);
          return;
        }
        res.send();
      });
    });
  } else {
    res.sendStatus(401);
  }
});

//Get event Information from Database
router.get('/getEvents', function(req, res, next) {
  // router.get('/modifyEvent', function(req, res, next) {
  if (req.session.user) {
    req.pool.getConnection(function(err,connection) {
      if(err) {
        console.log("here");
          console.log(err);
        res.sendStatus(500);
        return;
      }

      var query = "SELECT * FROM Events WHERE event_id = ?;";
      console.log(req.query.e);
      // connection.query(query, req.session.user.event_id, function(err, rows, fields) {
        connection.query(query, req.query.e, function(err, rows, fields) {
        connection.release();
          if(err) {
            console.log("here1");
            console.log(err);
            res.sendStatus(500);
            return;
          } if(rows.length === 0) {
            res.sendStatus(401);
            return;
          } else {
            res.json(rows[0]);

          }
          res.end();
      });
    });
  } else {
    res.sendStatus(401);
    return;
  };
});


//Update event's information in the database
router.post('/eventUpdate', function(req, res, next)
{
   // let today = date.getDate();
    req.pool.getConnection(function(err,connection)
    {
        if(err)
        {
          console.log(err);
          res.sendStatus(500);
          return;
        }

        var query = "UPDATE Events SET event_title=?,event_creator=?,event_description=?,event_address=?,event_date_start=?,event_date_end=?,event_start_time=?,event_end_time=? WHERE event_id=?;";

        console.log(req.body.event_title);
        console.log(req.body.event_address);
        console.log(req.body.e_id);
        connection.query(query, [
                req.body.event_title,
                req.body.event_creator,
                req.body.event_description,
                req.body.event_address,
                req.body.event_date_start,
                req.body.event_date_end,
                req.body.event_start_time,
                req.body.event_end_time,
                req.body.e_id
            ], function(err, rows, fields)
        {
            connection.release();
            if(err)
            {
              console.log(err);
                res.sendStatus(500);
                return;
            }
            res.end();
        });
    });
});


module.exports = router;
