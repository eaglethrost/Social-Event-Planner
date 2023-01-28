# SOCIAL-EVENT-PLANNER
WDC Group Project 2022

This is an social event planner that allows users to plan events by creating, viewing, editing and inviting others to the events they create using the application.

# HOW TO OPEN/START THE PLANNER
- Access the project folder (/Social-Event-Planner/project)
- Enter "sql_start" into the terminal
- Enter "npm start" into the terminal
- Set visibility of the forwarded port to "public"
- Use the forwarded link to access the planner

If the port disconnects, restart the port by inputting "npm start" into the terminal again, and change the visibility to public before accessing the forwarded link.

# CREATING THE FIRST ADMIN
Only Admins can make other users into admins. However, when first using the application, there are no admins.
To insert the first admin into the database:
- Access the project folder (/Social-Event-Planner/project)
- Enter "mysql --host=127.0.0.1" into the terminal to open MySQL
- Enter the following lines into the terminal:

        SOURCE events.sql;
        USE EventsPlanner;
        INSERT INTO Users (first_name, last_name, email_id, phone_no, user_type, user_password)
        VALUES ("admin", "admin", "admin", "admin", "admin", "$argon2i$v=19$m=4096,t=3,p=1$kd5fJIpqbbkSKdRaPpE+9Q$zjViq1iAh/GPKUxxdugw0aHuenUOXbkeaVj+i6p6sJc");

This will create a user with the admin status and login credentials:

        email: "admin"
        password: "admin"

# HOW TO USE THE PLANNER
When first opened, the planner will have no users (besides the first admin if created) or events.

To create a user, click on the "Sign Up" button (located at the top-right of the page). This will take the user to the sign up page.
(Note: form will not be submitted until all fields are filled)

To log in as a pre-existing user, click on the "Log In" button (located at the top-right of the page, next to the "Sign Up" button).
If the user has signed up with their google email address, they may sign in through Google (either automatically or by clicking on the google sign in button).
Successfully signing up or logging in will redirect the user back to the main page.

To access the main page of the application from any point in the application, click on the "Social Event Planner" title at the top of the page.

To create an event, the user must be logged in. Events can be created using the "Create Event +" button in the upper left section of the page.
This will generate a pop-up with input fields for the user to fill out.
(Note: form will not be submitted until at least the event name, start date, end date, start time, end time and location are given)
(Note: If email addresses are included in "Guests", the application is designed to automatically send invitation links to those addresses)

To view events, click on the date on the calendar when the event starts. A list of events on that date will appear, and clicking on a event will show the provided details of the event.
To edit the event, click on the "Edit" button, which will generate a pop-up. An option to delete the event in included.

To change user details or passwords that were entered during sign up, navigate to the "Profile" button.
For admins, navigate to the "Menu" button, which will dropdown a list of options and click on "Profile".

To log out, click on the "Log Out" button (replaces the the Log In/Sign Up buttons when logged in).

**FOR ADMINS:**

To manage users, navigate to the "Menu" button, which will dropdown a list of options and click on "Manage Users".
To manage events, navigate to the "Menu" button, which will dropdown a list of options and click on "Manage Events".

# CREDITS
The planner was designed and made by T.A.D.K.
- Tejveer Mangat
- Anthony Tran
- Dimas Anugerah
- Keval Keval Popatbhai Goyani