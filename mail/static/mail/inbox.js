document.addEventListener('DOMContentLoaded', function () {

  // Use buttons to toggle between views
  document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));
  document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));
  document.querySelector('#archived').addEventListener('click', () => load_mailbox('archive'));
  document.querySelector('#compose').addEventListener('click', compose_email);

  document.querySelector(`#${id}`).addEventListener('click', open_email(id))
  // By default, load the inbox
  load_mailbox('inbox');
});

function compose_email() {
  console.log("clicked compose")
  // Show compose view and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector("#emails").style.display = 'none'
  document.querySelector('#compose-view').style.display = 'block';

  // Clear out composition fields
  document.querySelector('#compose-recipients').value = '';
  document.querySelector('#compose-subject').value = '';
  document.querySelector('#compose-body').value = '';

  document.querySelector('#compose-form').addEventListener('submit', send_mail)

}

function load_mailbox(mailbox) {
  console.log(`clicked ${mailbox}`)

  // Show the mailbox and hide other views
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector("#emails").style.display = 'block'
  document.querySelector('#compose-view').style.display = 'none';

  // Show the mailbox name
  document.querySelector('#emails-view').innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;


  // Show emails
  show_email(mailbox)
}


function send_mail() {
  fetch('/emails', {
    method: 'POST',
    body: JSON.stringify({
      recipients: `${document.querySelector('#compose-recipients').value}`,
      subject: `${document.querySelector('#compose-subject').value}`,
      body: `${document.querySelector('#compose-body').value}`
    })
  })
    .then(response => response.json())
    .then(result => {
      // Print result
      console.log(result);
      load_mailbox('sent')
    });

}


function open_email(id) {
  console.log(`id: ${id}`)
  fetch(`/emails/${id}`)
    .then(response => response.json())
    .then()
    .then(email => {
      // Print emails
      sender = email['sender']
      recipients = email['recipients']
      subject = email['subject']
      timestamp = email['timestamp']
      body = email['body']
      document.querySelector("#emails").innerHTML = ''
      document.querySelector("#emails").innerHTML = `<div>From : ${sender}</div> <div>To : ${recipients}</div> <div>${timestamp}</div> <div>Subject : ${subject}</div> <div>${body}</div>`
      fetch(`/emails/${id}`, {
        method: 'PUT',
        body: JSON.stringify({
          read: true
        })
      })

    })



}




function show_email(mailbox) {
  document.querySelector("#emails").innerHTML = ''
  fetch(`/emails/${mailbox}`)
    .then(response => response.json())
    .then()
    .then(emails => {
      // Print emails
      console.log(emails);
      id_list = []
      for (var i = 0; i < emails.length; i++) {
        id = emails[i]["id"]
        sender = emails[i]['sender']
        recipients = emails[i]['recipients']
        subject = emails[i]['subject']
        timestamp = emails[i]['timestamp']
        read = emails[i]['read']
        archived = emails[i]['archived']
        if (read) {
          document.querySelector("#emails").innerHTML += `<a href="#" style="background:rgb(214, 214, 214);" onClick="open_email(${id})">To: ${recipients} | From: ${sender} | Subject: ${subject} | ${timestamp}</a>`
          //`<button class='email' id='${id}'> </button>`
          document.querySelector("#emails").innerHTML += '<br>'
        }
        else {
          document.querySelector("#emails").innerHTML += `<a href="#" onClick="open_email(${id})">To: ${recipients} | From: ${sender} | Subject: ${subject} | ${timestamp}</a>`
          //`<button class='email' id='${id}'> </button>`
          document.querySelector("#emails").innerHTML += '<br>'
        }


      }
      // ... do something else with emails ...
    });

}







