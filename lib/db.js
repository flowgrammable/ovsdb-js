var _ = require('underscore');
var tbl = require('./table');

function DBMirror(schema){
  if(!schema){
    throw new Error('Missing Schema');
  }
  _(schema.tables).forEach(function(schemaVal, tblName){
    this[tblName] = new tbl.Table(schema.tables[tblName]);
  }, this);
}

DBMirror.prototype.updateFromJSON= function(msg){
  _(msg).forEach(function(val, k){
    this[k].updateFromJSON(val);
  }, this);
};

DBMirror.prototype.toString = function(){
  var str = '';
  _(this).forEach(function(tbl, Name){
    str += Name +' Entries: '+ tbl.entries() + '\n';
  }, this);
  return str;
};

module.exports = {
  DBMirror: DBMirror
};
