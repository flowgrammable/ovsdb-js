var _ = require('underscore');
var table = require('./table');

function fromJSON(schema){
  var result = new Schema();
  return result.fromJSON(schema);
}

function Schema(){
  this.tables = {};
  this.version = '';
}

Schema.prototype.fromJSON = function(schema){
  var that = this;
  if(!schema.tables || !schema.version){
    throw new Error('Invalid Schema');
  }
  _(schema.tables).forEach(function(tableValue, tableName){
    this.tables[tableName] = table.schemaFromJSON(tableValue);
  }, this);
  return this;
};

Schema.prototype.toString = function(){
  return _(this.tables).map(function(v, k){
    return v.toString();
  });
};

module.exports = {
  Schema: Schema,
  fromJSON: fromJSON
};

