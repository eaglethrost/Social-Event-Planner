CREATE DATABASE EventsPlanner;
USE EventsPlanner;


CREATE TABLE Admins (
    admin_id int AUTO_INCREMENT,
    first_name varchar(20),
    last_name varchar(20),
    admin_password varchar(255),
    PRIMARY KEY(admin_id)
);

CREATE TABLE Users (
    user_id int AUTO_INCREMENT,
    first_name varchar(20),
    last_name varchar(20),
    email_id varchar(50),
    phone_no varchar(15),
    user_type varchar(5),
    user_password varchar(255),
    PRIMARY KEY(user_id)
);

CREATE TABLE Calendar (
    user_id int,
    event_date DATE,
    PRIMARY KEY(event_date, user_id),
    FOREIGN KEY(user_id) REFERENCES Users(user_id) ON DELETE CASCADE
);

CREATE TABLE Events (
    event_id int AUTO_INCREMENT,
    event_title varchar(40),
    event_creator int,
    event_description varchar(255),
    event_address varchar(255),
    event_date_start DATE,
    event_date_end DATE,
    event_start_time TIME,
    event_end_time TIME,
    FOREIGN KEY(event_date_start) REFERENCES Calendar(event_date) ON DELETE NO ACTION,
    FOREIGN KEY(event_creator) REFERENCES Users(user_id) ON DELETE CASCADE,
    PRIMARY KEY(event_id)
);

CREATE TABLE Participants (
    event_id int,
    user_id int,
    participants_availability VARCHAR(10) DEFAULT 'TBC',
    FOREIGN KEY(user_id) REFERENCES Users(user_id) ON DELETE CASCADE,
    FOREIGN KEY(event_id) REFERENCES Events(event_id) ON DELETE CASCADE,
    PRIMARY KEY(event_id,user_id)
);


