# Intercom firehose credit card and social security number monitor
Node app that takes webhooks from intercom to parse for social security numbers and credit cards to alert InfoSec in a designated slack channel.

# Intercom

Log into your Intercom account.  Navigate to the developers dashboard (https://app.intercom.com/developers/loezjvjr/webhooks) and locate your webhooks section.  Click the create webhook button.  Add the public url to your service and select the type of messages to listen for.

## Notification types to listen for

* new message from a user
* reply from a user
* admin initiated message to one user
* reply from a teammate

#Ngrok - secure tunnels to localhost

ngrok is requried to test your localhost node app.  This allows you to create a public tunnel to your locahost.  This means you can tweak your app and allow Intercom webhook traffic to hit your dev environment.

https://ngrok.com/

# Slack

I am using Slack as the chat ops mechanism to alert infosec when an issue is thought to be identified.  

(this part is not yet functional)

# Work remaining

* strip out all noise characters that are not sequential number groupings
* test each number grouping for presence of CC or SSN
* add more CC regex patterns
* add communication back to slack channel
* make all configurable bits pull from env params
* push into docker
* push to GCS container cluster
* refactor code (currently a crap pile for POC)
* write some tests :)