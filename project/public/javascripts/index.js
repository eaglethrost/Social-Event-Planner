const months = ["JANUARY","FEBRUARY","MARCH","APRIL","MAY","JUNE","JULY","AUGUST","SEPTEMBER","OCTOBER","NOVEMBER","DECEMBER"];
var events = [];

var app = new Vue({
    el: '#app',
    data: {
        show_create_event_box: false,
        month_index: 5,
        month: months[5],
        year: 2022,
        show_events_sidebar: false,
        show_edit_event: true,
        user_login: 2
    },
    methods: {
        collapse_sidebar: function(){
            document.querySelector(".events_sidebar").style.display = "none";
        },

        update_month: function(action){
            // decrement or increment month
            if (action == -1){
                this.month_index--;
            }else{
                this.month_index++;
            }
            // if index out of bounds, wrap around
            if (this.month_index < 0){
                this.month_index = 11;
                this.year--;
            }
            else if (this.month_index > 11){
                this.month_index = 0;
                this.year++;
            }
            // update calendar
            this.month = months[this.month_index];
            this.generate_calendar();
        },

        update_year: function(action){
            if (action == -1){
                this.year--;
            }else{
                this.year++;
            }
            this.generate_calendar();
        },

        // CONSTRUCT CALENDAR DYNAMICALLY
        // creates a calendar according to the selected month and year
        // adds event listener to dates
        // which is showing the sidebar filled with events on the selected date
        generate_calendar: function(){

            // and determine at which day does the 1st start
            var first_day = new Date(this.year, this.month_index, 1);
            const first_day_index = first_day.getDay();

            // and determine the last date number
            var last_day = new Date(this.year, this.month_index + 1, 0);
            const last_day_index = last_day.getDate();

            const calendar_dates = document.querySelector(".calendar-dates");
            // populate slot 0 -- 1st day index - 1 with empty divs
            let date_div = '';
            for (let i=0;i<first_day_index;i++){
                date_div += `<div></div>`;
            }

            // start populating the calendar with the dates of the month
            for (let i=1;i<=last_day_index;i++){
                date_div += `<div class="date">${i}</div>`;
                calendar_dates.innerHTML = date_div;
            }

            var year = this.year;
            var month = this.month;
            var month_num = this.month_index+1;

            // add an event listener so that when a date is selected, it is highlighted and a sidebar is visible
            $(document).ready(function(){
                $(".date").click(function(){
                    // highlight date
                    $(this).addClass("date-selected").siblings().removeClass("date-selected");

                    // update sidebar header to indicate selected date
                    var date = $(this).text();
                    document.querySelector(".sidebar_date").innerText = date + " " + month + " " + year;

                    // construct date format for query
                    var date_format = year + "-";
                    if (month_num < 10){
                      date_format+="0";
                    }
                    date_format+=month_num;
                    date_format+="-";
                    if (date < 10){
                      date_format+="0";
                    }
                    date_format+=date;

                    var sidebar_html = ``;
                    // search for events in chosen date from the events array
                    for (let i=0;i<events.length;i++){
                      if (events[i].event_date_start.substring(0,10) == date_format){
                        // add event details to sidebar
                        sidebar_html += `<div class="event">
                        <button id="event_name" class="collapsible" data-index="${i}">${events[i].event_title}</button>
                        <div class="event_box">
                          <div class="event_table">
                            <table class="event_details">
                              <tr>
                                <td>DESCRIPTION:</td>
                                <td class="description">${events[i].event_description}</td>
                              </tr>
                              <tr>
                                <td>CREATOR:</td>
                                <td class="creator">${events[i].first_name + " " + events[i].last_name}</td>
                              </tr>
                              <tr>
                                <td>END DATE:</td>
                                <td class="end-date">${events[i].event_date_end.substring(0,10)}</td>
                              </tr>
                              <tr>
                                <td>START TIME:</td>
                                <td class="start-time">${events[i].event_start_time}</td>
                              </tr>
                              <tr>
                                <td>END TIME:</td>
                                <td class="end-time">${events[i].event_end_time}</td>
                              </tr>
                              <tr>
                                <td>LOCATION:</td>
                                <td class="location">${events[i].event_address}</td>
                              </tr>
                              <tr>
                                <td>ATTENDEES:</td>
                                <td class="attendees">`;
                      // add attendees
                      // <div class="email">example@gmail.com</div><div class="email">example@gmail.com</div>
                      for (let j=1;j<events[i].attendees.length;j++){
                        sidebar_html+=`<div class="email">${events[i].attendees[j]}</div>`;
                      }
                      // closing tags
                      sidebar_html+=`</td>
                              </tr>
                           </table>
                         </div>
                         <button class="edit_event_button create_event_buttons button">Edit</button>
                        </div>
                      </div>`;
                      }
                    }

                    const event_content = document.querySelector(".sidebar_contents"); // sidebar place
                    event_content.innerHTML = sidebar_html;

                    // add event listeners to sidebar elements
                    app.generate_events_sidebar(date_format);
                    document.querySelector(".events_sidebar").style.display = "block";
                });
            });

            // add underlines to dates with events
            const dates = document.getElementsByClassName("date");
            for (let i=0;i<events.length;i++){
              // compare calendar to user's events' month and year
              if (events[i].event_date_start.substring(0,4) == year && parseInt(events[i].event_date_start.substring(5,7)) == this.month_index+1){
                // get date div that matches the dates of the events
                for (let j=0;j<dates.length;j++){
                  if (dates[j].innerText == parseInt(events[i].event_date_start.substring(8,10))){
                    dates[j].style.textDecoration = "underline red 5px";
                  }
                }
              }
            }
        },

        // QUERIES TO MAKE SIDEBAR ELEMENTS DYNAMIC
        // adds event listener to see details of event and edit it
        // generate the edit event box, according to ownership of events
        generate_events_sidebar: function(selected_date){

            // add event listener to display event content when its title is pressed
            $(document).ready(function(){
                $(".collapsible").click(function(){
                    // change to active state
                    this.classList.toggle("shown_event");
                    // toggle events in that date
                    var event_content = this.nextElementSibling;
                    if (event_content.style.display === "table"){
                        event_content.style.display = "none";
                    }else{
                        event_content.style.display = "table";
                    }
                });
            });

            // add onclick event on edit event, to show edit event box
            $(document).ready(function(){
                $(".edit_event_button").click(function(){

                    const event_index = $(this).parent().siblings("#event_name").attr("data-index");

                    // get event details from the parents/sibilings of chosen event button
                    var event_name = $(this).parent().siblings("#event_name").text();
                    var description = $(this).siblings(".event_table").find(".description").text();
                    var start_date = document.querySelector(".sidebar_date").innerText;
                    var end_date = $(this).siblings(".event_table").find(".end-date").text();
                    var start_time = $(this).siblings(".event_table").find(".start-time").text();
                    var end_time = $(this).siblings(".event_table").find(".end-time").text();
                    var location = $(this).siblings(".event_table").find(".location").text();
                    var date = $(this).parents(".sidebar_contents").siblings(".sidebar_header").find(".sidebar_date").text();

                    var temp = $(this).siblings(".event_table").find(".email");
                    let attendees = "";
                    for (let i=0;i<temp.length;i++){
                      attendees += temp[i].innerText;
                      attendees = (i == temp.length-1) ? attendees + "" : attendees + ", ";
                    }

                    // TO-DO: Compare event creator with user
                    // generate edit event box according to if event owned by user or not

                    if (events[event_index].isOwner == true){
                      // if creator, they can edit it or (finalise it?)
                      document.querySelector(".edit-event").innerHTML = `<div class="edit-event-box overlap" v-if="show_edit_event">
                      <div class="edit-event-header">
                        <h2>EDIT EVENT</h2>
                        <div class="edit-event-close close_button" v-on:click="show_edit_event=0">&times;</div>
                      </div>
                      <div class="edit-event-content" data-index="${events[event_index].event_id}">
                        <table class="edit-event-table-owner centered">
                          <tr>
                            <td>EVENT NAME</td>
                            <td><input id="edit-event-title" type="text" value="${events[event_index].event_title}"></td>
                          </tr>
                          <tr>
                            <td>DESCRIPTION</td>
                            <td><input id="edit-event-desc" type="text" value="${events[event_index].event_description}"></td>
                          </tr>
                          <tr>
                            <td>START DATE</td>
                            <td><input id="edit-event-date-start" type="date" value="${events[event_index].event_date_start.substring(0,10)}"></td>
                          </tr>
                          <tr>
                            <td>END DATE</td>
                            <td><input id="edit-event-date-end" type="date" value="${events[event_index].event_date_end.substring(0,10)}"></td>
                          </tr>
                          <tr>
                            <td>START TIME</td>
                            <td><input id="edit-event-time-start" type="time" value="${start_time.substring(0,5)}"></td>
                          </tr>
                          <tr>
                            <td>END TIME</td>
                            <td><input id="edit-event-time-end" type="time" value="${end_time.substring(0,5)}"></td>
                          </tr>
                          <tr>
                            <td>LOCATION</td>
                            <td><input id="edit-event-location" type="text" value="${events[event_index].event_address}"></td>
                          </tr>
                          <tr>
                            <td>GUESTS</td>
                            <td><input type="text" value="${attendees}"></td>
                          </tr>
                        </table>
                      </div>
                      <button id="delete-event-owner" class="edit-event-save button" v-on:click="delete_event()">Delete</button>
                      <button id="save-event-owner" class="edit-event-save button" v-on:click="edit_event_owner()">Save</button>
                    </div>`;
                    }else{
                      // if attendee, they can change their availability
                      document.querySelector(".edit-event").innerHTML = `<div class="edit-event-box overlap" v-if="show_edit_event">
                      <div class="edit-event-header">
                        <h2>UPDATE ATTENDANCE</h2>
                        <div class="edit-event-close close_button" v-on:click="show_edit_event=0">&times;</div>
                      </div>
                      <div class="edit-event-content" data-index="${events[event_index].event_id}">
                        <table class="edit-event-table-owner centered">
                          <tr>
                            <td>EVENT NAME</td>
                            <td><input type="text" value="${events[event_index].event_title}" readonly></td>
                          </tr>
                          <tr>
                            <td>DESCRIPTION</td>
                            <td><input type="text" value="${events[event_index].event_description}" readonly></td>
                          </tr>
                          <tr>
                            <td>START DATE</td>
                            <td><input type="date" value="${events[event_index].event_date_start.substring(0,10)}" readonly></td>
                          </tr>
                          <tr>
                            <td>END DATE</td>
                            <td><input type="date" value="${events[event_index].event_date_end.substring(0,10)}" readonly></td>
                          </tr>
                          <tr>
                            <td>START TIME</td>
                            <td><input type="time" value="${start_time.substring(0,5)}" readonly></td>
                          </tr>
                          <tr>
                            <td>END TIME</td>
                            <td><input type="time" value="${end_time.substring(0,5)}" readonly></td>
                          </tr>
                          <tr>
                            <td>LOCATION</td>
                            <td><input type="text" value="${events[event_index].event_address}" readonly></td>
                          </tr>
                          <tr>
                            <td>GUESTS</td>
                            <td><input type="text" value="${attendees}" readonly></td>
                          </tr>
                          <tr>
                            <td>AVAILABILITY</td>
                            <td>
                              <select id="avail" name="availability">
                                <option value="Yes">Yes</option>
                                <option value="No">No</option>
                                <option value="TBC">TBC</option>
                              </select>
                            </td>
                          </tr>
                        </table>
                      </div>
                      <button id="save-event-guest" class="edit-event-save button" v-on:click="edit_event_guest()">Save</button>
                    </div>`;
                    }

                    // add onclick event of closing edit event box
                    $(document).ready(function(){
                      $(".edit-event-close").click(function(){
                          document.querySelector(".edit-event").innerHTML = ``;
                      });
                    });

                    // add onclick event of editing user's own event
                    $(document).ready(function(){
                      $("#save-event-owner").click(function(){
                          let ok = confirm("Are you sure you want to edit your event?");
                          if (ok){
                            app.edit_event_owner();
                          }
                      });
                    });

                    // add onclick event of editing user's own event
                    $(document).ready(function(){
                      $("#delete-event-owner").click(function(){
                          let ok = confirm("Are you sure? Deleting event is irreversible!");
                          if (ok){
                            app.delete_event();
                          }
                      });
                    });

                    // add onclick event of editing user's own event
                    $(document).ready(function(){
                      $("#save-event-guest").click(function(){
                          let ok = confirm("Are you sure you want to change your availability? Saying no means this event will be gone from your calendar!");
                          if (ok){
                            app.edit_event_guest();
                          }
                      });
                    });
                });
            });
        },

        // CREATE EVENT ACTION
        // where event details are sent to database
        // broken down into inserting to user calendar, and then creating event
        // invitees are sent email
        create_event: function(){

          // format the event details into a JSON and send to routes
          var name = document.getElementById("event-name").value;
          var desc = document.getElementById("event-description").value;
          var date = document.getElementById("event-date").value;
          var date_end = document.getElementById("event-date-end").value;
          var time1 = document.getElementById("event-start-time").value;
          var time2 = document.getElementById("event-end-time").value;
          var loc = document.getElementById("event-location").value;
          var attend = document.getElementById("event-attendees").value.split(","); // break down attendees

          const xhttp = new XMLHttpRequest();
          xhttp.onreadystatechange = function(){
            if (this.readyState == 4 && this.status == 200){
              var notif = "Event successfully created! Here is the link:\n" + this.responseText;
              document.getElementById("link").innerText = this.responseText;
              document.getElementById("invitation-box").style.display = "block";
              // update events
              app.get_events();
            } else if (this.readyState == 4 && this.status == 401){
              alert("You need to be logged in into an account!");
            }
          };
          xhttp.open("POST", "/create-event", true);
          xhttp.setRequestHeader("Content-type", "application/json");
          xhttp.send(JSON.stringify({event_name:name, event_desc:desc, event_date:date, event_date_end:date_end, start_time:time1, end_time:time2, location:loc, guests:attend}));
        },

        // GET EVENTS ACTION
        // when page is loaded, store all events of user in client-side
        get_events: function(date){
          const xhttp = new XMLHttpRequest();
          xhttp.onreadystatechange = function(){
            if (this.readyState == 4 && this.status == 200){
              // store events in events global array
              events = JSON.parse(this.responseText);

              // add underlines to dates with events
              const dates = document.getElementsByClassName("date");
            }
          };
          xhttp.open("GET", "/get-events", true);
          xhttp.send();
        },

        // SHOW CREATE EVENT BOX AND MODIFY FORM SO IT DOESN'T RELOAD PAGE
        show_create_event: function(){
          document.getElementById("create_event_box").style.display = "block";
        },

        close_create_event: function(){
          document.getElementById("create_event_box").style.display = "none";
        },

        // CLOSE INVITATION BOX
        close_invitation: function(){
          document.getElementById("invitation-box").style.display = "none";
        },

        // EDIT EVENT ACTION FOR OWNER
        // will update the database
        edit_event_owner: function(){
           // get new event details
           const event_id = document.getElementsByClassName('edit-event-content')[0].getAttribute('data-index');
           var name = document.getElementById("edit-event-title").value;
           var desc = document.getElementById("edit-event-desc").value;
           var date = document.getElementById("edit-event-date-start").value;
           var date_end = document.getElementById("edit-event-date-end").value;
           var time1 = document.getElementById("edit-event-time-start").value;
           var time2 = document.getElementById("edit-event-time-end").value;
           var loc = document.getElementById("edit-event-location").value;

           // call ajax request of edit event
           const xhttp = new XMLHttpRequest();
           xhttp.onreadystatechange = function(){
             if (this.readyState == 4 && this.status == 200){
                alert("event updated!");
                app.get_events();
             }
           };
           xhttp.open("POST", "/edit-event-owner", true);
           xhttp.setRequestHeader("Content-type", "application/json");
           xhttp.send(JSON.stringify({event_name:name, event_desc:desc, event_date:date, event_date_end:date_end, start_time:time1, end_time:time2, location:loc, id:event_id}));
        },

        // DELETES EVENT
        delete_event: function(){
          // call ajax request of delete event
          const event_id = document.getElementsByClassName('edit-event-content')[0].getAttribute('data-index');
          const xhttp = new XMLHttpRequest();
          xhttp.onreadystatechange = function(){
            if (this.readyState == 4 && this.status == 200){
               alert("event deleted!");
               app.get_events();
            }
          };
          xhttp.open("POST", "/delete", true);
          xhttp.setRequestHeader("Content-type", "application/json");
          xhttp.send(JSON.stringify({id:event_id}));
        },

        // UPDATE GUEST'S AVAILABILITY
        edit_event_guest: function(){
          // get availability
          var avail = document.getElementById("avail").value;
          const event_id = document.getElementsByClassName('edit-event-content')[0].getAttribute('data-index');
          const xhttp = new XMLHttpRequest();
          xhttp.onreadystatechange = function(){
            if (this.readyState == 4 && this.status == 200){
               alert("availability updated!");
               app.get_events();
            }
          };
          xhttp.open("POST", "/edit-event-guest", true);
          xhttp.setRequestHeader("Content-type", "application/json");
          xhttp.send(JSON.stringify({id:event_id, availability:avail}));
        }
    },

    computed:{
        show_events(){
            return this.show_events_sidebar;
        }
    }
});

document.getElementById("index-body").onload = app.generate_calendar();
document.getElementById("index-body").onload = app.get_events();
document.getElementById("app").hidden = false;

// make form not reload page when it's submitted
var form = document.getElementById("create-event-form");
function handleForm(event) { event.preventDefault(); }
form.addEventListener('submit', handleForm);