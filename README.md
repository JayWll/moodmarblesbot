Mood Marbles Bot
================

Mood Marbles is a popular mechanism for measuring the mood of agile squads. We use this app as an automated mechanism to post a daily message in our squad
chat room and ask the team to respond with an emoji.


How Does This Work?
-------------------

We use Google Chat. The Google Chat API includes an [incoming webhooks](https://developers.google.com/hangouts/chat/how-tos/webhooks) feature that provides
a simple mechanism for posting a message in a room. When you create an incoming webhook Google provides a unique URL for it, and this simple builds a message
(based on the day of the week), formats the data appropriately into a JSON object, and sends it to the webhook in an HTTP request.

For our purposes, we publish the same message in two different Google Chat rooms. The webook URLs of these are stored in `secrets.env`:
```
AUTO_TEAM_URL="/v1/spaces/..."
FED_TEAM_URL="/v1/spaces/..."
```

The app identifies public holidays using an API from [calendarific.com](https://calendarific.com) to fetch national and provincial holidays and check the
current date against this.


How is This Triggered?
----------------------

The app is triggered by [cron-job.org](https://cron-job.org). The job runs at 8:30am every morning. To prevent the messages from being triggered any other way,
the HTTP request includes a custom header, `moodmarbles-key`, that the app checks. The expected value is also stored in `secrets.env`:
```
AUTH_KEY="..."
```
