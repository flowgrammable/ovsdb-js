#!/usr/bin/env node

var ovsdb    = require('../lib/ovsdb.js');
var db       = require('../lib/db.js');
var ovs      = require('../lib/ovs.js');
var net      = require('net');
var client   = new net.Socket();
var schema   = require('../lib/schema');

var cfg = {
  ovsdb: {
     ip: '192.168.1.120',
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

var monitorRequests = {
     'Open_vSwitch': { 
       columns: ['bridges', 'cur_cfg', 'manager_options', 'ovs_version'] 
     },
     'Bridge': { 
       columns: ['name', 'ports', 'controller', 'flow_tables', 'datapath_id', 'protocols'],
       select: { initial: true, insert: true, delete: true, modify: true}
     },
     'Controller': { 
       columns: ['target', 'connection_mode', 'is_connected', 'role'],
       select: { initial: true, insert: true, delete: true, modify: true}
     }
};
var ovsdbcli = new ovsdb.OVSDB(cfg.jsonrpc, client);

client.connect(cfg.ovsdb.port, cfg.ovsdb.ip, function(){
  ovsdbcli.get('Open_vSwitch', function(err, res){
    if(err) { console.log(err); }
    else {
      var sch = schema.fromJSON(res);
      var mir = new db.DBMirror(sch);
      ovsdbcli.monitor('Open_vSwitch', monitorRequests, 
      function(err, res){
        // Monitor Response Handler
        mir.updateFromJSON(res);
        console.log(mir.toString());
      },
      function(err, res){
        // Monitor Update Notification Handler
        mir.updateFromJSON(res);
        console.log(mir.toString());
      });
    }  
  });
});

