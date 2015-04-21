#!/usr/bin/env node

var config = require('./config.js');
var ovsdb  = require('../lib/ovsdb.js');
var ovs    = require('../lib/ovs.js');
var net = require('net');
var program = require('commander');


console.log(config);
program
  .version('0.0.1')
  .option('-l --list', 'List databases')
  .option('-s --schema [db_name]', 'Get database schema')
  .option('-b --bridges', 'list bridges')
  .parse(process.argv);

if(!process.argv.slice(2).length){
  program.help();
} else {
  var client = new net.Socket();
  client.connect(config.port, config.ip, function(){
    var ovsdbcli = new ovsdb.OVSDB(client, rxHandler);
    if(program.list){
      ovsdbcli.list(output);
    } else if(program.schema){
      ovsdbcli.get(program.schema, output);
    } else if(program.bridges){
      ovsdbcli.monitor('Open_vSwitch', ovs.listBridges(), output);
   }
});

}

var rxHandler = function(err, res){
  if(err){
    console.log(err);
  } else if(res) {
    console.log(res);
  }
}

var output = function(err, res){
  if(err){
    console.log(err);
  } else if(res) {
    console.log(res);
  }
}



