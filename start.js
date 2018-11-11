const web = require('webbox');
var server = new web.Server.Box();

server.setServerRoot('www/');

server.createServer(3000);