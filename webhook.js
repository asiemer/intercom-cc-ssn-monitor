var ngrok = require('ngrok');
var express = require('express');
var app = express();
var bl = require('bl')

const crypto = require('crypto');
const hmac = crypto.createHmac('sha1', 'secret');

var KEY = "secret";
app.get('/status', function(req, res){
    var good = true;

    //var testString = '4711111111111';
    var testString = '<p>testing fake credit card number 4711111111111 cool?</p>';
    var cardTest = ccExists(testString);

    console.log('card test: ' + cardTest);
    if(cardTest)
    {
        good = true;
    }
    else
    {
        good = false;
    }

    if(good) {
        res.send('status: GOOD');
    }
    else {
        res.send('status: BAD');
    }
});

app.post('/', function (req, res) {
  var EXPECTED = req.get('x-hub-signature');
  req.pipe(bl(function (err, data) {
    if (err) {
        console.log(err.message);
      return hasError(err.message)
    }

    var obj = JSON.parse(data.toString())
    
    /*
    console.log("===============================================================");
    console.log(data.toString());
    console.log("===============================================================");
    */

    if (!EXPECTED){
      console.log("Not signed. Not calculating");
    }
    else{
      var CALCULATED = 'sha1=' + crypto.createHmac('sha1', KEY).update(data).digest('hex');
      console.log("Expected  : " + EXPECTED);
      console.log("Calculated: " + CALCULATED);
      console.log("Match?    : " + (CALCULATED == EXPECTED));
    }
    
    //console.log("Topic Recieved: " + obj["topic"]);
    console.log("Topic Recieved: " + obj.topic);

    if(obj.topic == "conversation.user.replied" || obj.topic == "conversation.user.created")
    {
        console.log("message of note captured");
        console.log(obj.data.item.id);
        console.log(obj.data.item.conversation_message.body);
        if(ccExists(obj.data.item.conversation_message.body))
        {
            console.log('-------------------------');
            console.log('CREDIT CARD IDENTIFIED');
            console.log('-------------------------');
        }

        if(obj.data.item.conversation_parts.conversation_parts[0] != undefined)
        {
            console.log(obj.data.item.conversation_parts.conversation_parts);
            console.log('----------------------------');
            var conv = obj.data.item.conversation_parts.conversation_parts[0];
            console.log(conv.id);
            console.log(conv.body);

            if(ccExists(conv.body))
            {
                console.log('-------------------------');
                console.log('CREDIT CARD IDENTIFIED');
                console.log('-------------------------');
            }
        }
    }
  }));

  res.sendStatus(200);
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});

ngrok.connect(3000, function (err, url){
    console.log(url);
});

function ccExists(msg)
{
    var result = false;
    var reg1 = new RegExp('^4[0-9]{12}(?:[0-9]{3})?$'); //visa
    var reg2 = new RegExp('^3[47][0-9]{13}$'); //amex
    var reg3 = new RegExp('^5[1-5][0-9]{14}$') //mc

    var expressions = [reg1, reg2, reg3];
    for(i=0;i<expressions.length;i++)
    {
        var element = expressions[i];
        console.log(element.toString());
        //if(element.test(msg))
        if(msg.match(element))
        {
            result = true;
            console.log('cc found');
            console.log(element.toString());
        }
    }

    return result;
}