var express = require('express');
var router = express.Router();

const {OAuth2Client} = require('google-auth-library');
const client = new OAuth2Client('386121880437-ln1bcmok9f3r5r87oroq1evh6e53hggp.apps.googleusercontent.com');

const argon2 = require('argon2');
const sanitize = require('sanitize-html');

var nodemailer = require("nodemailer");
var transporter = nodemailer.createTransport({
  host: 'smtp.ethereal.email',
  port: 587,
  secure: false,
  auth: {
      user: 'kristoffer.schuppe69@ethereal.email',
      pass: 'DRZPdA991WjXX2szBY'
  }
});

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/about', function (req, res, next) {
  res.render('about.html', { title: 'about' });
});

router.get('/contact', function (req, res, next) {
  res.render('contact.html', { title: 'contact' });
});

router.get('/faq', function (req, res, next) {
  res.render('faq.html', { title: 'faq' });
});

router.get('/signup', function (req, res, next) {
  res.render('signup.html', { title: 'signup' });
});

router.get('/login', function (req, res, next) {
  res.render('login.html', { title: 'login' });
});

router.post('/login', function(req, res, next) {
  console.log(req.body);
  if ('user' in req.body && 'password' in req.body) {
    req.pool.getConnection(function(error, connection) {
      if(error) {
        console.log(error);
        res.sendStatus(500);
        return;
      }
      let query = "SELECT * FROM Users WHERE email_id = ?;";
      connection.query(query, [req.body.user], async function(error, rows, fields) {
        if (error) {
          console.log(error);
          res.sendStatus(500);
          return;
        } if (rows.length > 0) {
          try {
            if (await argon2.verify(rows[0].user_password, req.body.password)) {
              let query = "SELECT user_id, first_name, last_name, email_id, phone_no, user_type FROM Users WHERE email_id = ?;"
              connection.query(query, [req.body.user], function(error, rows, fields) {
              if (error) {
                console.log(error);
                res.sendStatus(500);
                return;
              }
              console.log('login success');
              req.session.user = rows[0];
              //req.session.user.user_type;
              res.sendStatus(200);
            });
            } else {
              console.log('login fail');
              res.sendStatus(401);
            }
          } catch (err) {
            console.log('system fail');
            res.sendStatus(500);
          }
        } else {
          console.log('login fail');
          res.sendStatus(401);
        }
      })
    })
  } else if ('token' in req.body) {
    let email = null;
    async function verify() {
      const ticket = await client.verifyIdToken({
        idToken: req.body.token,
        audience: '386121880437-ln1bcmok9f3r5r87oroq1evh6e53hggp.apps.googleusercontent.com',
      });
      const payload = ticket.getPayload();
      const userid = payload['sub'];
      email = payload['email'];
    }
    verify().then(function() {
      req.pool.getConnection(function(error, connection) {
        if(error) {
          console.log(error);
          res.sendStatus(500);
          return;
        }
        let query = "SELECT user_id, first_name, last_name, email_id, phone_no, user_type FROM Users WHERE email_id = ?;";
        connection.query(query, [email], function(error, rows, fields) {
          connection.release();
          if (error) {
            console.log(error);
            res.sendStatus(500);
            return;
          }
          if (rows.length > 0) {
            console.log('login success');
            req.session.user = rows[0];
            res.sendStatus(200);
          } else {
            console.log('login fail');
            res.sendStatus(401);
          }
        })
      })
    }).catch(function() {
      res.sendStatus(403);
    });
  }
});

router.post('/signup', function(req, res, next) {
  console.log(req.body);
  if ('first_name' in req.body && 'last_name' in req.body && 'email' in req.body && 'phone' in req.body && 'user_type' in req.body && 'password' in req.body) {
    req.pool.getConnection(function(error, connection) {
      if(error) {
        console.log(error);
        res.sendStatus(500);
        return;
      }
      let query = "SELECT user_id, first_name, last_name, email_id, phone_no from Users WHERE email_id = ?;";
      connection.query(query, [sanitize(req.body.email)], async function(error, rows, fields) {
        if (error) {
          console.log(error);
          res.sendStatus(500);
          return;
        } if (rows.length > 0) {
          connection.release();
          console.log('existing email');
          res.sendStatus(403);
          return;
        } else {
          try {
            req.body.password = await argon2.hash(req.body.password);
          } catch (err) {
            console.log('system error');
            res.sendStatus(500);
          }
          // let query = "INSERT INTO Users (first_name, last_name, email_id, phone_no, is_admin, user_password) VALUES (?, ?, ?, ?, 0, ?);";
          let query = "INSERT INTO Users (first_name, last_name, email_id, phone_no, user_type, user_password) VALUES (?, ?, ?, ?, ?, ?);";
          // connection.query(query, [req.body.first_name, req.body.last_name, req.body.email, req.body.phone, req.body.password], function(error, rows, fields) {
          connection.query(query, [sanitize(req.body.first_name), sanitize(req.body.last_name), sanitize(req.body.email), sanitize(req.body.phone), req.body.user_type, req.body.password], function(error, rows, fields) {
            connection.release();
            if (error) {
            console.log(error);
            res.sendStatus(500);
            return;
            }
            let query = "SELECT user_id, first_name, last_name, email_id, phone_no from Users WHERE email_id = ?;";
            connection.query(query, [sanitize(req.body.email)], function(error, rows, fields) {
              if (error) {
                console.log(error);
                res.sendStatus(500);
                return;
              } else if (rows.length > 0) {
                req.session.user = rows[0];
                res.sendStatus(200);
              } else {
                res.sendStatus(500);
              }
            })
          })
        }
      })
    })
  } else {
    console.log('sign in fail');
    res.sendStatus(400);
  }
});

// SCRIPT TO LOAD EVENT FOR THE RESPONSE FORM
router.get('/event-response', function (req, res, next) {
  req.pool.getConnection(function (err,connection) {
    if (err){
      console.log(err);
      res.sendStatus(500);
      return;
    }
    // get events details from event id
    var id = req.query.param1;
    var sql = "SELECT Events.*, first_name, last_name, email_id FROM Events INNER JOIN Users ON Events.event_creator = Users.user_id WHERE event_id = ?";
    var values = [[id]];
    connection.query(sql, values, function (err,result) {
      if (err){
        console.log(err);
        res.sendStatus(500);
        return;
      }
      //console.log(result);
      var event = result;
      // get participatns of event
      var sql = "SELECT first_name, last_name FROM Users INNER JOIN Participants Using(user_id) WHERE event_id = ?";
      connection.query(sql, values, function (err,result) {
        if (err){
          console.log(err);
          res.sendStatus(500);
          return;
        }
        for (let i=0;i<event.length;i++){
          event[i]["attendees"] = [];
          for (let j=0;j<result.length;j++){
              event[i]["attendees"].push(result[j].first_name + " " + result[j].last_name);
          }
        }
        // if a user is already logged in, get their first and last name as well to be printed out in the response form
        if (req.session.user){
          event[0]["user_first_name"] = req.session.user.first_name;
          event[0]["user_last_name"] = req.session.user.last_name;
          // get the date of events from the user as well to check if the event clashes
          var sql = "SELECT Events.event_title, Events.event_date_start, Events.event_date_end, Events.event_start_time, Events.event_end_time FROM Events INNER JOIN Participants USING(event_id) WHERE Participants.user_id = ? AND participants_availability = 'Yes'";
          connection.query(sql, [req.session.user.user_id], function (err,result) {
            if (err){
              console.log(err);
              res.sendStatus(500);
              return;
            }
            // combine the json
            event[0]["events"] = [];
            for (let i=0;i < result.length; i++){
              event[0]["events"].push(result[i]);
            }
            console.log(event);
            res.json(event);
          });
        } else{
          res.json(event);
        }
        //console.log(result);
      });
    });
  });
});

// SCRIPT TO UPDATE GUEST'S PARTICIPATION
router.post('/response', function (req, res, next) {
  req.pool.getConnection(function (err,connection){
    if (err){
      console.log(err);
      res.sendStatus(500);
      return;
    }
    console.log("inside response");
    // if a user is logged in, use their id to update participants list
    if (req.session.user){
      // update participants list
      console.log("there is a user!");
      var sql = "INSERT INTO Participants (event_id, user_id, participants_availability) VALUES ?";
      var values = [[req.body.event_id, req.session.user.user_id, req.body.availability]];
      connection.query(sql, [values], function (err,result) {
        if (err){
          console.log(err);
          res.sendStatus(500);
          return;
        }
        console.log("added user to participant");
        // if user says yes, update to calendar
        if (req.body.availability == 'Yes'){
          var sql = "INSERT IGNORE INTO Calendar VALUES ?";
          var args = [[req.session.user.user_id, req.body.date]];
          connection.query(sql, [args], function (err,result) {
            connection.release();
            if (err){
              console.log(err);
              res.sendStatus(500);
              return;
            }
            console.log("updated user's calendar");
            res.send(result);
          });
        } else {
          // if user proposes new date, email the creator
          if (req.body.propose_new == 'Yes'){
            let info = transporter.sendMail({
              from: '"Social Event Planner" <kristoffer.schuppe69@ethereal.email>',
              to: req.body.creator_email,
              subject: "Request to Change Event Date",
              text: req.session.user.email_id + ' has requested a change in date for an event.'+
              '\nOld Date: ' + req.body.date +
                '\nNew Date: ' + req.body.new_proposed_date + '\nNew Start Time: ' + req.body.new_start_time +
                '\nNew End Time: ' + req.body.new_end_time,
              html: ""
            });
            // req.body.new_proposed_date, req.body.new_start_time, req.body.new_end_time, req.body.creator_email
            console.log("email sent");
            res.send();
          }
          res.send();
        }
      });
    } else {
    // else, create a temporary user first
    console.log("no user!creating one");
    var sql = "INSERT INTO Users (first_name, last_name) VALUES ?";
    var values = [[sanitize(req.body.first_name), sanitize(req.body.last_name)]];
    connection.query(sql, [values], function (err,result) {
      if (err){
        console.log(err);
        res.sendStatus(500);
        return;
      }
      console.log("created temp user");
      // update participants list
      var sql = "INSERT INTO Participants (event_id, user_id, participants_availability) VALUES (?, (SELECT user_id FROM Users ORDER BY user_id DESC LIMIT 1), ?)";
      connection.query(sql, [req.body.event_id, req.body.availability], function (err,result) {
        connection.release();
        if (err){
          console.log(err);
          res.sendStatus(500);
          return;
        }
        console.log("logged in participants");
        // if user proposes new date, email the creator
        if (req.body.propose_new == 'Yes'){
          // TO-DO: Email creator of new propose date
          // req.body.new_proposed_date, req.body.new_start_time, req.body.new_end_time,
          console.log("sending email..");
          console.log(req.body.creator_email);
          res.send();
        }
        res.send();
       });
     });
    }
  });
});

// Check if user is logged in
router.use(function (req, res, next) {
  if (req.session.user) {
    next();
  } else {
    res.sendStatus(401);
  }
});


// SCRIPT TO GET EVENTS OF A USER FROM DATABASE
router.get('/get-events', function (req, res, next) {
  req.pool.getConnection(function(err,connection){
    if (err){
      console.log(err);
      res.sendStatus(500);
      return;
    }
    // query the database for events of a user
    // check if there is a user loggend in or not
    if (!('user' in req.session)){
      console.log("cant get events cuz no user");
      return;
    }
    var user = req.session.user.user_id;
    console.log(user);
    var sql = "SELECT Events.*, Users.first_name, Users.last_name FROM Participants INNER JOIN Events USING(event_id) INNER JOIN Users ON Users.user_id = Events.event_creator WHERE Participants.user_id = ? AND (participants_availability = 'Yes' OR participants_availability = 'TBC')";
    connection.query(sql, [user], function (err,result,fields) {
      if (err){
        console.log(err);
        res.sendStatus(500);
        return;
      }
      var events = result;
      //console.log(result);
      // get the participants of the events in that day
      var sql = "SELECT event_id, first_name, last_name FROM (SELECT event_id FROM Events INNER JOIN Participants USING(event_id) WHERE user_id = ?) a INNER JOIN Participants USING(event_id) INNER JOIN Users USING(user_id) WHERE NOT participants_availability = 'No'";
      connection.query(sql, [user], function (err,result,fields) {
        if (err){
          console.log(err);
          res.sendStatus(500);
          return;
        }
        // console.log(result);
        // append the participants list in the event json
        for (let i=0;i<events.length;i++){
          events[i]["attendees"] = [];
          // have isOwner variable to make it easier in making sidebar
          events[i]["isOwner"] = events[i].event_creator == user ? true : false;
          for (let j=0;j<result.length;j++){
            if (events[i].event_id == result[j].event_id){
              events[i]["attendees"].push(result[j].first_name + " " + result[j].last_name);
            }
          }
        }
        //console.log(events);
        res.json(events);
      });
    });
  });
});


// SCRIPT TO STORE EVENT CREATED BY USER TO DATABASE
router.post('/create-event', function(req, res, next) {
  req.pool.getConnection(function (err,connection) {
    if (err){
      console.log(err);
      res.sendStatus(500);
      return;
    }
    console.log("Connected!");
    // check if there is a user loggend in or not
    if (!('user' in req.session)){
      console.log("cant create event cuz no user");
      res.sendStatus(401);
      return;
    }
    var user = req.session.user.user_id;
    console.log(user);
    // insert event date to calendar first
    var sql = "INSERT IGNORE INTO Calendar VALUES ?";
    var calendar = [[user,req.body.event_date]];
    connection.query(sql, [calendar], function (err,result) {
      if (err){
        console.log(err);
        res.sendStatus(500);
        return;
      }
      // create event entry
      var sql = "INSERT INTO Events (event_title, event_creator, event_description, event_address, event_date_start, event_date_end, event_start_time, event_end_time) VALUES ?";
      var event_values = [
        [sanitize(req.body.event_name), user, sanitize(req.body.event_desc), sanitize(req.body.location), req.body.event_date, req.body.event_date_end, req.body.start_time, req.body.end_time]
      ];
      connection.query(sql, [event_values], function (err,result) {
        if (err){
          console.log(err);
          res.sendStatus(500);
          return;
        }
        // update participants table
        var sql = "INSERT INTO Participants (event_id, user_id, participants_availability) SELECT event_id, event_creator, 'Yes' FROM Events ORDER BY event_id DESC LIMIT 1";
        connection.query(sql, function (err,result) {
          if (err){
            console.log(err);
            res.sendStatus(500);
            return;
          }
          // get newly created event id
          var sql = "SELECT event_id FROM Events ORDER BY event_id DESC LIMIT 1";
          connection.query(sql, function (err,result) {
            connection.release();
            if (err){
              console.log(err);
              res.sendStatus(500);
              return;
            }
            // create invitation link
            console.log("creating link");
            console.log(result[0].event_id);
            var event_id = result[0].event_id;

            // assuming port 8080
            var link = "https://eaglethrost-code50-63914983-pjrgj4x77c65r7-8080.githubpreview.dev/response.html?q=" + event_id;

            // send email if there are invited guests
            if (req.body.guests[0] != ''){
              let info = transporter.sendMail({
                from: '"Social Event Planner" <kristoffer.schuppe69@ethereal.email>',
                to: req.body.guests,
                subject: "Invitation",
                text: 'You are invited to an event. Here is the link:\n'+link,
                html: "<p>You are invited to an event.</p>"
              });
              console.log('email sent');
            }
            console.log(link);
            res.end(link);
            });
          });
        });
      });
   });
});

// SCRIPT TO EDIT EVENT OF USER
router.post('/edit-event-owner', function (req, res, next) {
  req.pool.getConnection(function (err,connection) {
    if (err){
      console.log(err);
      res.sendStatus(500);
      return;
    }
    console.log("inside owner");
    var sql = "UPDATE Events SET event_title = ?, event_description = ?, event_address = ?, event_date_start = ?, event_date_end = ?, event_start_time = ?, event_end_time = ? WHERE event_id = ?";
    connection.query(sql, [sanitize(req.body.event_name), sanitize(req.body.event_desc), sanitize(req.body.location), req.body.event_date, req.body.event_date_end, req.body.start_time, req.body.end_time, req.body.id], function (err,result,fields) {
      connection.release();
      if (err){
        console.log(err);
        res.sendStatus(500);
        return;
      }
      console.log("done updating");
      res.send();
    });
  });
});


// SCRIPT TO UPDATE GUEST'S PARTICIPATION
router.post('/edit-event-guest', function (req, res, next) {
  req.pool.getConnection(function (err,connection) {
    if (err){
      console.log(err);
      res.sendStatus(500);
      return;
    }
    var sql = "UPDATE Participants SET participants_availability = ? WHERE event_id = ? AND user_id = ?";
    console.log(req.body.availability);
    connection.query(sql, [req.body.availability, req.body.id, req.session.user.user_id], function (err,result,fields) {
      if (err){
        console.log(err);
        res.sendStatus(500);
        return;
      }
      res.send();
    });
  });
});

// SCRIPT TO DELETE EVENT
router.post('/delete', function (req, res, next) {
  req.pool.getConnection(function (err,connection) {
    if (err){
      console.log(err);
      res.sendStatus(500);
      return;
    }
    var sql = "DELETE FROM Events WHERE event_id = ?";
    connection.query(sql, [req.body.id], function (err,result,fields) {
      if (err){
        console.log(err);
        res.sendStatus(500);
        return;
      }
      res.send();
    });
  });
});

module.exports = router;