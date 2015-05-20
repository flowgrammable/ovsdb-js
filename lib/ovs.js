var _ = require('underscore');
var sch = require('./schema');
var tbl = require('./table');

var requiredTables = [
  'Open_vSwitch', 
  'Bridge', 
  'Port', 
  'Interface',
  'Flow_Table',
  'Controller',
  'Manager'];

function OVS(schema){
  console.log(schema);
  if(!schema){
    throw new Error('Missing Schema');
  }
  _(requiredTables).forEach(function(tblName){
    if(!_(schema.tables).has(tblName)){
      throw new Error('Missing table: '+ tblName);
    }
  }, this);
  this.Open_vSwitch = new tbl.Table(schema.tables.Open_vSwitch);
  this.Bridge       = new tbl.Table(schema.tables.Bridge);
  this.Port         = new tbl.Table(schema.tables.Port);
  this.Controller   = new tbl.Table(schema.tables.Controller);
  this.Manager      = new tbl.Table(schema.tables.Manager);

}

OVS.prototype.initFromJSON = function(msg){
  _(msg).forEach(function(val, k){
    this[k].updateFromJSON(val);
  }, this);
};


module.exports = {
  OVS: OVS
};
