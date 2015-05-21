#!/usr/bin/env node

var ovsdb    = require('../lib/ovsdb.js');
var db       = require('../lib/db.js');
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
      var mir = new db.DBMirror(sch);
      var vs;
      var monTables = {
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
      ovsdbcli.monitor('Open_vSwitch', monTables, 
      function(err, res){
        mir.updateFromJSON(res);
        console.log(mir.toString());
        vs = new ovs.OVS(mir);
        console.log(vs.toString());
      },
      function(err, res){
        mir.updateFromJSON(res);
        console.log(mir.toString());
        vs.updateFromMirror(mir);
        console.log(vs.toString());
      });
    }  
  });
});

