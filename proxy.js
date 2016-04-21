var fs = require('fs');
var http = require('http');
var http2 = require('http2');
var httpProxy = require('http-proxy');

var sslkeyPath = '/etc/letsencrypt/live/goita.beta.or.jp/'
var options = {
    key: fs.readFileSync(sslkeyPath + 'privkey.pem', 'utf8'),
    cert: fs.readFileSync(sslkeyPath + 'cert.pem', 'utf8')
  } 
var proxy = httpProxy.createProxyServer({
    target: "http://goita.beta.or.jp:8880",
    ws: true      
});

var server = http.createServer(function(req, res){
    proxy.web(req, res);
});
server.on('upgrade', function (req, socket, head) {
    proxy.ws(req, socket, head);
});

var server2 = http2.createServer(options,function(req, res){
    proxy.web(req, res);
});

server2.on('upgrade', function (req, socket, head) {
    proxy.ws(req, socket, head);
});

server.listen(80); //root is required to run service on port 80.
server2.listen(443); //root is required to run service on port 443.
console.log("proxy server started");