var shortid = require('shortid');
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


function OVS(mir){
  this.mir            = mir;
  //this.Open_vSwitch = new tbl.Table(schema.tables.Open_vSwitch);
  this.Bridges       = new Bridges(mir.Bridge);
  //this.Port         = new tbl.Table(schema.tables.Port);
  //this.Controller   = new tbl.Table(schema.tables.Controller);
  //this.Manager      = new tbl.Table(schema.tables.Manager);

}

OVS.prototype.updateFromMirror = function(mir){
  this.Bridges.updateFromMirror(mir.Bridge);
};

OVS.prototype.toString = function(){
  return 'Bridges: ' + this.Bridges.toString();
};

function Bridges(tbl){
  this.table = tbl;
  this._bridges = {};
  _(tbl.rows).forEach(function(row, uuid){
    if(!this._bridges[uuid]){
      this._bridges[uuid] = { 
        id: shortid.generate(), 
        name: row.cols.name.value.toString() 
      };
    }
  }, this);
}

Bridges.prototype.updateFromMirror = function(mir){
  _(mir.rows).forEach(function(row, uuid){
    if(!_(this._bridges[uuid])){
      this._bridges[uuid] = { 
        id: shortid.generate(), 
        name: row.cols.name.value.toString() 
      };
    }
  }, this);
};

Bridges.prototype.toString = function(){
  return JSON.stringify(_(this._bridges).map(function(b, id){
    return b;
  }));
};

module.exports = {
  OVS: OVS
};
