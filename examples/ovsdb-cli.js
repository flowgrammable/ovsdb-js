#!/usr/bin/env node

var config = require('./config.js');
var ovsdb  = require('../lib/ovsdb.js');
var ovs    = require('../lib/ovs.js');
var net = require('net');
var program = require('commander');


program
  .version('0.0.1')
  .option('-l --list', 'List databases')
  .option('-s --schema [db_name]', 'Get database schema')
  .option('-b --bridges', 'list bridges')
  .option('-v --verbose', 'output log')
  .parse(process.argv);

var cfg = {};
if(!process.argv.slice(2).length){
  program.help();
} else {
  cfg.logging = program.verbose;
  var client = new net.Socket();
  client.connect(config.port, config.ip, function(){
    var ovsdbcli = new ovsdb.OVSDB(cfg, client);
    if(program.list){
      ovsdbcli.list(output);
    } else if(program.schema){
      ovsdbcli.get(program.schema, output);
    } else if(program.bridges){
      ovsdbcli.monitor('Open_vSwitch', ovs.listBridges(), output);
   }
  });
}

var output = function(err, res){
  if(err){
    console.log(err);
  } else if(res) {
    console.log(res);
  }
  client.end();
}



