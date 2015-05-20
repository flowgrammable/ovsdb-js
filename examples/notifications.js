#!/usr/bin/env node

var ovsdb    = require('../lib/ovsdb.js');
var ovs      = require('../lib/ovs.js');
var net      = require('net');
var client   = new net.Socket();
var schema   = require('../lib/schema');
var cfg = {
  ovsdb: {
           ip: '192.168.1.112',
           port: 6640
         },
  jsonrpc: {
            logging: {
                       name: 'ovs',
                       stream: process.stdout,
                       level: 'debug'
                     }
           }
};
var ovsdbcli = new ovsdb.OVSDB(cfg.jsonrpc, client);

client.connect(cfg.ovsdb.port, cfg.ovsdb.ip, function(){
  ovsdbcli.get('Open_vSwitch', function(err, res){
    if(err) { console.log(err); }
    else {
      var sch = schema.fromJSON(res);
      var vs = new ovs.OVS(sch);
      var monTables = {
        'Open_vSwitch': { columns: ['bridges', 'cur_cfg', 'manager_options', 'ovs_version'] }
      };
      ovsdbcli.monitor('Open_vSwitch', monTables, 
      function(err, res){
        vs.initFromJSON(res);
      },
      function(err, res){

      });
    }  
  });
});

var output = function(err, res){
  if(err){
    console.log(err);
  } else if(res) {
    console.log(res);
  }
  client.end();
}
