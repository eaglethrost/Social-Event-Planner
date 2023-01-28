
//function to make the admin table
function adminTable()
{
    const table = document.querySelector("#admin_table > tbody");

    var xhttp = new XMLHttpRequest();

    xhttp.onreadystatechange = function()
    {
        if (this.readyState == 4 && this.status == 200)
        {
            var user = JSON.parse(this.responseText);

            for(let i = 0; i<user.length; i++)
            {
                table.innerHTML += `
                    <tr>
                        <td>${user[i].user_id}</td>
                        <td>${user[i].first_name}</td>
                        <td>${user[i].last_name}</td>
                        <td>${user[i].email_id}</td>
                        <td>${user[i].phone_no}</td>
                        <td>${user[i].user_type}</td>
                        <td><button type="submit" class="button" onclick="make_Admin(${user[i].user_id})">Make Admin</button></td>
                        <td><button type="submit" class="delete button" onclick="delete_User(${user[i].user_id})">Delete User</button></td>
                    </tr>
                `;
            }
        }
    };
    xhttp.open("GET", "/users/makeAdminTable", true);
    xhttp.send();
}


//function to delete user from database and admin table
function delete_User(user_id) {
    if (confirm("Warning: You are about to delete this user! Confirm?") == true) {
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                location.reload();
            } else if (this.readyState == 4 && this.status == 401) {
                alert('This request requires admin role');
            } else if (this.readyState == 4 && this.status >= 400) {
                alert('Request failed');
            }
        };
        xhttp.open("POST", "/users/deleteUser", true);
        xhttp.setRequestHeader("Content-type", "application/json");
        xhttp.send(JSON.stringify({a_userid:user_id}));
    }
}


//function to make the user an admin
function make_Admin(user_id) {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            location.reload();
            alert('Admin role assigned');
        } else if (this.readyState == 4 && this.status == 401) {
            alert('This request requires admin role');
        } else if (this.readyState == 4 && this.status > 401) {
            alert('Request failed');
        }
    };
    xhttp.open("POST", "/users/makeAdmin", true);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send(JSON.stringify({a_userid:user_id}));
}


//Load user information from database in User Profile
function loadUserInfo()
{
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var user = JSON.parse(this.responseText);
            document.getElementById("sign-first-name").innerText = user.first_name;
            document.getElementById("sign-last-name").innerText = user.last_name;
            document.getElementById("sign-email").innerText = user.email_id;
            document.getElementById("sign-phone").innerText = user.phone_no;
        } if (this.readyState == 4 && this.status == 401) {
            alert('You need to be logged in');
        }
    };
    xhttp.open("GET", "/users/getUser", true);
    xhttp.send();
}


//Update User Information in the database
function updateUserInfo()
{
    var user = {
        "first_name": document.getElementById("sign-first-name").value,
        "last_name": document.getElementById("sign-last-name").value,
        "email": document.getElementById("sign-email").value,
        "phone": document.getElementById("sign-phone").value

    };
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            document.getElementById("update-alert").style.backgroundColor = "green";
            document.getElementById("update-alert").innerText = "Details Updated!";
            document.getElementById("update-alert").style.display = "block";
        }
    };
    xhttp.open("POST", "/users/update", true);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send(JSON.stringify(user));
}


//Function to change a users password
function changePassword()
{
    var password = document.getElementById("sign-password").value;
    var cPassword = document.getElementById("sign-confirm-password").value;
    var pass = {
        "password": password
    };

    //Alert user if no new password was entered or passwords dont match
    if(!password || !cPassword)
    {
        document.getElementById("password-alert").style.display = "block";
        document.getElementById("sign-password").style.borderColor = "#f44336";
        document.getElementById("sign-confirm-password").style.borderColor = "#f44336";
        document.getElementById("password-alert").innerText = "Please Enter a new Password!";
    }
    else if(password != cPassword)
    {
        document.getElementById("password-alert").style.display = "block";
        document.getElementById("sign-password").style.borderColor = "#f44336";
        document.getElementById("sign-confirm-password").style.borderColor = "#f44336";
        document.getElementById("password-alert").innerText = "Passwords Do Not Match!";
    }
    else
    {
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                document.getElementById("password-alert").style.display = "block";
                document.getElementById("sign-password").style.borderColor = "green";
                document.getElementById("sign-confirm-password").style.borderColor = "green";
                document.getElementById("password-alert").style.backgroundColor = "green";
                document.getElementById("password-alert").innerText = "Password Successfully Changed!";
                document.location.href="/profile.html";
            }
        };

        xhttp.open("POST", "/users/changepassword", true);
        xhttp.setRequestHeader("Content-type", "application/json");
        xhttp.send(JSON.stringify(pass));
    }
}

//Log out user account
function userLogOut()
{
    var xhttp = new XMLHttpRequest();

    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            document.location.href="/";
        }
    };

    xhttp.open("POST", "/users/logout", true);
    xhttp.send();
}

var event_mod_id = -1;

//function to make the event table
function eventTable()
{
    const table = document.querySelector("#event_table > tbody");

    var xhttp = new XMLHttpRequest();

    xhttp.onreadystatechange = function()
    {
        if (this.readyState == 4 && this.status == 200)
        {
            var user = JSON.parse(this.responseText);

            for(let i = 0; i<user.length; i++)
            {
                var start_time = new Date(user[i].event_date_start);
                var month = start_time.getUTCMonth() + 1; //months from 1-12
                var day = start_time.getUTCDate();
                var year = start_time.getUTCFullYear();

                var newStartTime = year + "/" + month + "/" + day;
                var end_time = new Date(user[i].event_date_end);
                var month = start_time.getUTCMonth() + 1; //months from 1-12
                var day = start_time.getUTCDate();
                var year = start_time.getUTCFullYear();

                var newEndTime = year + "/" + month + "/" + day;
                table.innerHTML += `
                    <tr>
                        <td>${user[i].event_id}</td>
                        <td>${user[i].event_title}</td>
                        <td>${user[i].event_creator}</td>
                        <td>${user[i].event_description}</td>
                        <td>${user[i].event_address}</td>
                        <td>${newStartTime}</td>
                        <td>${newEndTime}</td>
                        <td>${user[i].event_start_time}</td>
                        <td>${user[i].event_end_time}</td>
                        <td><button type="submit" class="button" onclick="modify_Event(${user[i].event_id})">Modify Event</button></td>
                        <td><button type="submit" class="delete button" onclick="delete_Event(${user[i].event_id})">Delete Event</button></td>
                    </tr>
                `;
            }
        }
    };
    xhttp.open("GET", "/users/makeEventTable", true);
    xhttp.send();
}

//function to delete event from database and event table
function delete_Event(event_id)
{
    if (confirm("Warning: You are about to delete this event! Confirm?") == true) {
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                location.reload();
            } else if (this.readyState == 4 && this.status == 401) {
                alert('This request requires admin role');
            } else if (this.readyState == 4 && this.status >= 400) {
                alert('Request failed');
            }
        };
        xhttp.open("POST", "/users/deleteEvent", true);
        xhttp.setRequestHeader("Content-type", "application/json");
        xhttp.send(JSON.stringify({a_eventid:event_id}));
    }
}


//function to load event details
function modify_Event(event_id)
{
    event_mod_id = event_id;

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var user = JSON.parse(this.responseText);
            var start_time = new Date(user.event_date_start);
                var month = start_time.getUTCMonth() + 1; //months from 1-12
                var day = start_time.getUTCDate();
                var year = start_time.getUTCFullYear();

                var newStartTime = year + "/" + month + "/" + day;
                var end_time = new Date(user.event_date_end);
                var month = start_time.getUTCMonth() + 1; //months from 1-12
                var day = start_time.getUTCDate();
                var year = start_time.getUTCFullYear();
                var newEndTime = year + "/" + month + "/" + day;
            document.getElementById("e_event_title").innerText = user.event_title;
            document.getElementById("e_event_creator").innerText = user.event_creator;
            document.getElementById("e_event_description").innerText = user.event_description;
            document.getElementById("e_event_address").innerText = user.event_address;
            document.getElementById("e_event_date_start").innerText = newStartTime;
            document.getElementById("e_event_date_end").innerText = newEndTime;
            document.getElementById("e_event_start_time").innerText = user.event_start_time;
            document.getElementById("e_event_end_time").innerText = user.event_end_time;

            document.getElementById("event-section").style.display = "block";

        } if (this.readyState == 4 && this.status == 401) {
            alert('You need to be logged in');
        }
    };
    xhttp.open("GET", "/users/getEvents?e="+encodeURIComponent(event_id), true);
    xhttp.send();
}

//Update Event Information in the database
function updateEvent()
{
    var event = {
        "event_title": document.getElementById("e_event_title").value,
        "event_creator": document.getElementById("e_event_creator").value,
        "event_description": document.getElementById("e_event_description").value,
        "event_address": document.getElementById("e_event_address").value,
        "event_date_start": document.getElementById("e_event_date_start").value,
        "event_date_end": document.getElementById("e_event_date_end").value,
        "event_start_time": document.getElementById("e_event_start_time").value,
        "event_end_time": document.getElementById("e_event_end_time").value,
        "e_id":event_mod_id

    };
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            document.getElementById("update-alert").style.backgroundColor = "green";
            document.getElementById("update-alert").innerText = "Event Updated!";
            document.getElementById("update-alert").style.display = "block";
            location.reload();
        }
    };
    xhttp.open("POST", "/users/eventUpdate", true);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send(JSON.stringify(event));
}