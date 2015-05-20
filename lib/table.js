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

function Tables(schema){
  this._tables = {};
  _(schema).forEach(function(v, k){
    this._tables[k] = new Table(v);
  }, this);
  this.rows = {};
}

Tables.prototype.update = function(tbls){
  _(tbls).forEach(function(v, k){
    this._tables[k].update(v);
  }, this);
};

Tables.prototype.toString = function(){
  var str = '\n';
   _(this._tables).forEach(function(tbl){
    str += tbl.toString() + '\n';
  }, this);
  return str;
};

function Table(schema){
  this.columns = schema.columns;
  this.rows = {};
}

Table.prototype.updateFromJSON = function(rows){
  _(rows).forEach(function(row, uuid){
    if(!this.rows[uuid]){
      this.rows[uuid] = new Row(row, uuid, this.columns);
    }
  }, this);
};

Table.prototype.toString = function(){
  var str = '';
  _(this.columns).forEach(function(v, k){
    str += k+' ';
  }, this);
  str += '\n';
  _(this.rows).forEach(function(row, k){
     str += row.toString() + '\n';
  }, this); 
  str += '\n\n\n';
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

Row.prototype.toString = function(){
  var str = '';
  _(this.cols).forEach(function(col, k){
    str += col;
  }, this);
  return str;
};

module.exports = {
  Schema: Schema,
  schemaFromJSON: schemaFromJSON,
  Tables: Tables,
  Table: Table
};
