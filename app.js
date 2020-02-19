const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html');
});

app.get('/test', (req, res) => {
  var now = new Date();
  isaholiday(now.toISOString().substr(0, 10), (holiday) => {
    res.send(holiday);
  })
})

app.get('/bot/trigger', (req, res) => {
  if (!req.headers['moodmarbles-key'] || req.headers['moodmarbles-key'] != process.env.AUTH_KEY) {
    return res.status(401).send('Authorization header not found').end();
  }

  var now = new Date();
  var message = {};

  switch(now.getDay()) {
    case 1:
      message.text = "It's a brand new week, <users/all>! How's everyone feeling on this Monday morning? Hover over this message and click “add reaction.”";
      break;
    case 2:
      message.text =  "Morning <users/all>, and happy Tuesday. How's everyone feeling today? Hover over this message and click “add reaction.”";
      break;
    case 3:
      message.text = "Happy hump day <users/all>. We're midway through the workweek already. How's everybody feeling? Hover over this message and click “add reaction.”";
      break;
    case 4:
      message.text = "Hey <users/all>, it's the <https://www.youtube.com/watch?v=uVPKmeB8p94|third day> and the weekend is in sight. How's everybody feeling this morning? Hover over this message and click “add reaction.”";
      break;
    case 5:
      message.text = "Happy Friday, <users/all>! How's everyone feeling today as we wrap up the week? Hover over this message and click “add reaction.”";
      break;
  }

  var options = {
    host: 'chat.googleapis.com',
    method: 'POST',
    headers: {
      'Content-type': 'application/json'
    }
  };

  if (message.text) {
    options.path = process.env.AUTO_TEAM_URL;
    sendRequest(options, message);

    options.path = process.env.FED_TEAM_URL;
    sendRequest(options, message);
  }

  res
    .status(200)
    .send('OK')
    .end();
});

// Function to send a HTTP request
const sendRequest = (opt, msg) => {
  var https = require('https');
  var request = https.request(opt, function(response) {
    var responseString = "";

    response.on('data', function(data) {
      responseString += data;
    });

    response.on('end', function() {
      console.log(responseString);
    });
  });

  request.write(JSON.stringify(msg));
  request.end();
}

// Function to find out if a date is a public holiday in Alberta
const isaholiday = (isodate, callback) => {
  const url = 'https://calendarific.com/api/v2/holidays/?year=2020&country=ca&location=ca-ab&type=national,local&api_key=' + process.env.CALENDARIFIC_KEY;

  fetch(url).then((res) => res.json()).then((json) => {
    for(var i = 0; i < json.response.holidays.length; i++) {
      if (json.response.holidays[i].date.iso == isodate) callback(true);
    }

    callback(false);
  });
}

// Start the server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
  console.log('Press Ctrl+C to quit.');
});
