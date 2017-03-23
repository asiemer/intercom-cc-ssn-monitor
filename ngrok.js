var ngrok = require('ngrok');
var http = require('http');

var requestListener = function (req, res) {
  res.writeHead(200);
  res.end('Hello, World!\n');
}

var server = http.createServer(requestListener);
server.listen(8080);

ngrok.connect(8080, function (err, url){
    console.log(url);
});