#!/usr/bin/env node

var config = require('./config.json');
var ovsdb  = require('../lib/ovsdb.js');
var net = require('net');
var program = require('commander');


program
  .version('0.0.1')
  .option('-l --list', 'List databases')
  .option('-s --schema [db_name]', 'Get database schema')
  .parse(process.argv);

if(!process.argv.slice(2).length){
  program.help();
} else {
  var client = new net.Socket();
  client.connect(config.port, config.ip, function(){
    var ovsdbcli = new ovsdb.OVSDB(client);
    if(program.list){
      ovsdbcli.list(output);
    } else if(program.schema){
      ovsdbcli.get(program.schema, output);
    }
});

}

function output(err, res){
  if(err){
    console.log(JSON.stringify(err));
  } else if(res) {
    console.log(JSON.stringify(res));
  }
  client.end();
}



