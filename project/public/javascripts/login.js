//function to sign up a new user
function signUp() {
  var firstName = document.getElementById("first_name").value;
  var lastName = document.getElementById("last_name").value;
  var email = document.getElementById("email").value;
  var phone = document.getElementById("phone").value;
  var password = document.getElementById("password").value;
  var user_type;

  //Get input of radio button
  if(document.getElementById("user").checked === true)
  {
    user_type = "user";
  }
  var user =
  {
      "first_name": firstName,
      "last_name": lastName,
      "email": email,
      "phone": phone,
      "user_type": user_type,
      "password": password
  };

  if (document.getElementById("password").value == document.getElementById("confirm_password").value)
  {

    if(user.first_name && user.last_name && user.email && user.phone && user.password)
    {
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function()
        {
          if (this.readyState == 4 && this.status == 200)
          {
            alert("Sign up success!");
            document.location.href="/";
          }
          if (this.readyState == 4 && this.status == 403)
          {
            alert("Email or phone is already registered.");
            document.location.href="/";
          }
          else if (this.readyState == 4 && this.status >= 400)
          {
            alert("Sign up failed!");
          }
        };
      }

        xhttp.open("POST", "/signup", true);
        xhttp.setRequestHeader("Content-type", "application/json");
        xhttp.send(JSON.stringify(user));
  }
  else
  {
    alert("Passwords do not match!");
  }
}


//function to login a user
function logIn() {
  let xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      alert("Sucessfully logged in!");
      document.location.href="/";
    } else if (this.readyState == 4 && this.status >= 400) {
      alert("Login failed!");
    }
  };
  xhttp.open('POST', '/login');
  xhttp.setRequestHeader('Content-Type', 'application/json');
  xhttp.send(JSON.stringify({
    user: document.getElementById("user").value,
    password: document.getElementById("password").value
  }));
}

//function to check if user is logged in
function loggedIn()
{
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var userId = this.responseText;
            // if (userId === 'Yes' )
            // {
            //   console.log('test5');
            //     console.log('userId');
            //     document.getElementById("logout").style.visibility = "visible";
            //     document.getElementById("logout").style.display = "inline";
            //     if(document.getElementById("sign-log") != null)
            //     {
            //         document.getElementById("sign-log").style.display = "none";
            //     }
            // }

            if(userId === "admin")
            {
                document.getElementById("normal_options").style.display = "none";
                document.getElementById("sign-log").style.display = "none";
                document.getElementById("admin_options").style.display = "block";
                document.getElementById("logout").style.visibility = "visible";

            }
            else
            {
                document.getElementById("admin_options").style.display = "none";
                document.getElementById("sign-log").style.display = "none";
                document.getElementById("normal_options").style.display = "block";
                document.getElementById("logout").style.visibility = "visible";
            }
        }
    };
    xhttp.open("GET", "/users/check", true);
    xhttp.send();
}




//google sign in function
function onSignIn(googleUser) {
  let xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      alert("Sucessfully logged in!");
    } else if (this.readyState == 4 && this.status == 401) {
      alert("Incorrect email or password!");
    } else if (this.readyState == 4 && this.status > 401) {
      alert("Login failed!");
    }
  };
  xhttp.open('POST', '/login');
  xhttp.setRequestHeader('Content-Type', 'application/json');
  xhttp.send(JSON.stringify({
    token: googleUser.getAuthResponse().id_token
  }));
}

document.getElementById("index-body").onload = loggedIn();