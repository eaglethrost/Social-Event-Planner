-- *****************************
--  Requests for queries *******
-- *****************************

-- index.js

SELECT * FROM Users WHERE email_id = ?;

SELECT user_id, first_name, last_name, email_id, phone_no, user_type FROM Users WHERE email_id = ?;

SELECT user_id, first_name, last_name, email_id, phone_no, user_type FROM Users WHERE email_id = ?;

SELECT user_id, first_name, last_name, email_id, phone_no from Users WHERE email_id = ?;

INSERT INTO Users (first_name, last_name, email_id, phone_no, user_type, user_password) VALUES (?, ?, ?, ?, ?, ?);

SELECT user_id, first_name, last_name, email_id, phone_no from Users WHERE email_id = ?;

SELECT Events.*, first_name, last_name, email_id FROM Events INNER JOIN Users ON Events.event_creator = Users.user_id WHERE event_id = ?

SELECT first_name, last_name FROM Users INNER JOIN Participants Using(user_id) WHERE event_id = ?

SELECT Events.event_title, Events.event_date_start, Events.event_date_end, Events.event_start_time, Events.event_end_time FROM Events INNER JOIN Participants USING(event_id) WHERE Participants.user_id = ? AND participants_availability = 'Yes'

INSERT INTO Participants (event_id, user_id, participants_availability) VALUES ?

INSERT IGNORE INTO Calendar VALUES ?

INSERT INTO Users (first_name, last_name) VALUES ?

INSERT INTO Participants (event_id, user_id, participants_availability) VALUES (?, (SELECT user_id FROM Users ORDER BY user_id DESC LIMIT 1), ?)

SELECT Events.*, Users.first_name, Users.last_name FROM Participants INNER JOIN Events USING(event_id) INNER JOIN Users ON Users.user_id = Events.event_creator WHERE Participants.user_id = ? AND (participants_availability = 'Yes' OR participants_availability = 'TBC')

SELECT event_id, first_name, last_name FROM (SELECT event_id FROM Events INNER JOIN Participants USING(event_id) WHERE user_id = ?) a INNER JOIN Participants USING(event_id) INNER JOIN Users USING(user_id) WHERE NOT participants_availability = 'No'

INSERT IGNORE INTO Calendar VALUES ?

INSERT INTO Events (event_title, event_creator, event_description, event_address, event_date_start, event_date_end, event_start_time, event_end_time) VALUES ?

INSERT INTO Participants (event_id, user_id, participants_availability) SELECT event_id, event_creator, 'Yes' FROM Events ORDER BY event_id DESC LIMIT 1

SELECT event_id FROM Events ORDER BY event_id DESC LIMIT 1

UPDATE Events SET event_title = ?, event_description = ?, event_address = ?, event_date_start = ?, event_date_end = ?, event_start_time = ?, event_end_time = ? WHERE event_id = ?

UPDATE Participants SET participants_availability = ? WHERE event_id = ? AND user_id = ?

DELETE FROM Events WHERE event_id = ?




-- user.js

SELECT * FROM Users WHERE email_id = '" + req.body.userEmail + "' AND user_password = '" + req.body.userPassword + "';

INSERT INTO Users (first_name, last_name, email_id, phone_no, user_password) VALUES ?

SELECT user_id, first_name, last_name, email_id, phone_no FROM Users;

DELETE FROM Users WHERE user_id=?;

UPDATE Users SET user_type='admin' WHERE user_id = ?;

SELECT * FROM Users WHERE user_id = ?;

UPDATE Users SET first_name=?,last_name=?,email_id=?,phone_no=? WHERE user_id=?;

UPDATE Users SET user_password = ? WHERE user_id = ?;

SELECT  event_id, event_title, event_creator, event_description, event_address, event_date_start, event_date_end, event_start_time, event_end_time FROM Events;

DELETE FROM Events WHERE event_id=?;

SELECT * FROM Events WHERE event_id = ?;

UPDATE Events SET event_title=?,event_creator=?,event_description=?,event_address=?,event_date_start=?,event_date_end=?,event_start_time=?,event_end_time=? WHERE event_id=?;
