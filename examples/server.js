var net = require('net');
var ovsdb = require('../lib/ovsdb');

var server = new net.createServer(function(sock){
   var ovsdbcli = new ovsdb.OVSDB(sock);
   ovsdbcli.list(function(error, result){
     console.log('got list...', result);
     ovsdbcli.get(result[0], function(err, res){
	console.log('got schema...', res);
     });
   });
}).listen(6640);
