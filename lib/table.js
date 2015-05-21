var assert = require('assert');
var col = require('./column');
var _ = require('underscore');

function schemaFromJSON(tbl){
  var result = new Schema();
  return result.fromJSON(tbl);
}

function Schema(){
  this.columns = {};
}

Schema.prototype.fromJSON = function(tbl){
  if(!tbl.columns){
    throw new Error('Missing columns');
  }
  _(tbl.columns).forEach(function(v, k){ 
    this.columns[k] = col.schemaFromJSON(v);
  }, this);
  return this;
};

Schema.prototype.toString = function(){
  return this.columns;
};

function Table(schema){
  this.columns = schema.columns;
  this.rows = {};
}

Table.prototype.updateFromJSON = function(rows){
  _(rows).forEach(function(row, uuid){
    if(_(row).has('old') && !_(row).has('new')){
      // Delete Row
      delete this.rows[uuid];
    } else if(_(row).has('new') && !_(row).has('old')){
      // New Row
      assert(!this.rows[uuid], 'Row UUID already exists');
      this.rows[uuid] = new Row(row, uuid, this.columns);
    } else {
      // Modify Row
      this.rows[uuid].updateFromJSON(row);
    }
  }, this);
};

Table.prototype.entries = function(){
  return _(this.rows).keys().length;
};

Table.prototype.toString = function(){
  var str = '| uuid | ';
  _(this.columns).forEach(function(v, k){
    str += k+' | ';
  }, this);
  str += '\n'; 
  _(this.rows).forEach(function(row, k){
     str += row.toString() + '\n';
  }, this); 
  str += '\n';
  return str;
};

function Row(row, uuid, colSchema){
  this._uuid = uuid;
  this.row = row.new;
  this.cols = {};
  _(this.row).forEach(function(val, k){
    this.cols[k] = new col.Column(val, colSchema[k]);
  }, this);
}

Row.prototype.updateFromJSON = function(row){
  _(row.old).forEach(function(oldColVal, colName){
    this.cols[colName].updateFromJSON(row.new[colName]);
  }, this);
};


Row.prototype.toString = function(){
  var str = '';
  str += this._uuid +' ';
  _(this.cols).forEach(function(col, k){
    str += col.toString();
  }, this);
  return str;
};

module.exports = {
  Schema: Schema,
  schemaFromJSON: schemaFromJSON,
  Table: Table
};
