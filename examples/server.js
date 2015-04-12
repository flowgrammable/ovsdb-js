var net = require('net');
var ovsdb = require('../lib/ovsdb');

var server = new net.createServer(function(sock){
   var ovsdbcli = new ovsdb.OVSDB(sock);
}).listen(6640);
