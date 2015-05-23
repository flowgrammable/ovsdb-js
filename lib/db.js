var _ = require('underscore');
var tbl = require('./table');
var sch = require('./schema');

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

function DBMirror(ovsdb){
  if(!ovsdb){
    throw new Error('Missing OVSDB');
  }
  this.ovsdb  = ovsdb;
  this.tables = {};
}

DBMirror.prototype.init = function(cb){
  var that = this;
  this.ovsdb.get('Open_vSwitch', function(err, res){
    if(err) { cb(err); }
    else {
      that.schema = sch.fromJSON(res);
      _(that.schema.tables).forEach(function(schemaVal, tblName){
        that.tables[tblName] = new tbl.Table(that.schema.tables[tblName]);
      }, that);
      that.ovsdb.monitor('Open_vSwitch', monitorRequests, 
        function(err, resMsg){
          that.updateFromJSON(resMsg);
          cb(null, that.tables);
        },
        function(err, notMsg){
          that.updateFromJSON(notMsg);  
          cb(null, that.tables);
      });
    }
  });
};

DBMirror.prototype.updateFromJSON= function(msg){
  console.log('fromJSON update:', msg);
  _(msg).forEach(function(val, k){
    this.tables[k].updateFromJSON(val);
  }, this);
};

DBMirror.prototype.toString = function(){
  var str = '';
  _(this.tables).forEach(function(tbl, Name){
    str += Name +' Entries: '+ tbl.entries() + '\n';
  }, this);
  return str;
};

module.exports = {
  DBMirror: DBMirror
};
