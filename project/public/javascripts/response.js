// FUNCTION TO LOAD EVENT DETAILS
function load_event()
{
    // get event id from url
    const urlParams = new URLSearchParams(window.location.search);
    const event = urlParams.get('q');

    // get event details
    const xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function(){
    if (this.readyState == 4 && this.status == 200){
        var event_details = JSON.parse(this.responseText);
        const invited_event_start = new Date(event_details[0].event_date_start.substring(0,10) + 'T' + event_details[0].event_start_time.substring(0,8));
        const invited_event_end = new Date(event_details[0].event_date_end.substring(0,10) + 'T' + event_details[0].event_end_time.substring(0,8));
        // check if events clashed
        if ('events' in event_details[0]){
            let i=0;
            for (i=0;i<event_details[0]["events"].length;i++){
                // if invited event inbetween an existing event dates (10 < 11 < 12)
                const event_start = new Date(event_details[0]["events"][i].event_date_start.substring(0,10) + 'T' + event_details[0]["events"][i].event_start_time.substring(0,8));
                const event_end = new Date(event_details[0]["events"][i].event_date_end.substring(0,10) + 'T' + event_details[0]["events"][i].event_end_time.substring(0,8));
                if (invited_event_start >= event_start && invited_event_start < event_end || invited_event_end > event_start && invited_event_end <= event_end){
                    var msg = "This event clashes with " + event_details[0]["events"][i].event_title;
                    alert(msg);
                    break;
                } else if (invited_event_start <= event_start && invited_event_end >= event_end || invited_event_start >= event_start && invited_event_end <= event_end){
                    var msg = "This event clashes with " + event_details[0]["events"][i].event_title;
                    alert(msg);
                    break;
                }
            }
            if (i == event_details[0]["events"].length){
                alert("No clashes!");
            }
        }

        // place event information in table
        var table = document.getElementById("response-event");
        var event_html = ``;
        table.setAttribute("event-name",event_details[0].event_title);
        event_html += `
            <div class="create_event_header">
                <h2 id="event-name">${event_details[0].event_title}</h2>
            </div>
            <table id=responded_event_table class="event_details centered">
                <tr>
                <td>DESCRIPTION:</td>
                <td class="description" style="font-size:20px">${event_details[0].event_description}</td>
                </tr>
                <tr>
                <td>CREATOR:</td>
                <td id="creator" style="font-size:20px" data-email="${event_details[0].email_id}">${event_details[0].first_name + " " + event_details[0].last_name}</td>
                </tr>
                <tr>
                <td>START DATE:</td>
                <td id="start-date" style="font-size:20px">${event_details[0].event_date_start.substring(0,10)}</td>
                </tr>
                <tr>
                <td>END DATE:</td>
                <td class="end-date" style="font-size:20px">${event_details[0].event_date_end.substring(0,10)}</td>
                </tr>
                <tr>
                <td>START TIME:</td>
                <td class="start-time" style="font-size:20px">${event_details[0].event_start_time}</td>
                </tr>
                <tr>
                <td>END TIME:</td>
                <td class="end-time" style="font-size:20px">${event_details[0].event_end_time}</td>
                </tr>
                <tr>
                <td>LOCATION:</td>
                <td class="location" style="font-size:20px">${event_details[0].event_address}</td>
                </tr>
                <tr>
                <td>ATTENDEES:</td>
                <td class="attendees">`;
        // add attendees
        for (let j=0;j<event_details[0].attendees.length;j++){
            event_html+=`<div class="email" style="font-size:18px">${event_details[0].attendees[j]}</div>`;
        }
        // closing tags
        event_html+=`</td>
                </tr>
            </table>`;
        table.innerHTML = event_html;
        // if a user is logged in, print out their name in the response form
        if ('user_first_name' in event_details[0]){
            document.getElementById('first-name').value = event_details[0].user_first_name;
            document.getElementById('last-name').value = event_details[0].user_last_name;
            document.getElementById('first-name').readOnly = true;
            document.getElementById('last-name').readOnly = true;
        }
        document.getElementById("response-body").hidden = false;
        }
    };
    xhttp.open("GET", "/event-response?param1="+encodeURIComponent(event), true);
    xhttp.send();
}


// FUNCTION TO SEND RESPONSE TO DATABASE
function submit_response()
{
    // get the response data
    const urlParams = new URLSearchParams(window.location.search);
    var event = urlParams.get('q');
    var title = document.getElementById("event-name").getAttribute("event-name");
    var first = document.getElementById("first-name").value;
    var last = document.getElementById("last-name").value;
    var avail = document.getElementById("availability").value;
    var propose = document.getElementById("propose-new-date").value;
    var new_date = document.getElementById("new-date").value;
    var new_start = document.getElementById("new-start-time").value;
    var new_end = document.getElementById("new-end-time").value;
    var old_date = document.getElementById("start-date").innerText;
    var email = document.getElementById("creator").getAttribute('data-email');

    // send AJAX request
    const xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function(){
    if (this.readyState == 4 && this.status == 200){
        alert("Your response has been submitted!");
        document.location.href="/";
        }
    };
    xhttp.open("POST", "/response", true);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send(JSON.stringify({first_name:first, last_name:last, availability:avail, propose_new:propose, date:old_date, new_proposed_date:new_date, new_start_time:new_start, new_end_time:new_end, event_id:event, creator_email:email, event_name:title}));
}

// make form not reload page when it's submitted
var form = document.getElementById("response-form");
function handleForm(event) { event.preventDefault(); }
form.addEventListener('submit', handleForm);