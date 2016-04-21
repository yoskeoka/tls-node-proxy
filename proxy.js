var fs = require('fs');
var http = require('http');
var https = require('https');
var httpProxy = require('http-proxy');

var uid = 502; //node-http-proxyを動作させるUserId
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

var sslproxy = httpProxy.createServer({
    target: "http://goita.beta.or.jp:8880",
    ws: true,
    secure: true,
    ssl: options  
});

server.listen(80, function(){
    process.setuid(uid);
}); //root is required to run service on port 80.
sslproxy.listen(443, function(){
    process.setuid(uid);
}); //root is required to run service on port 443.
console.log("proxy server started");