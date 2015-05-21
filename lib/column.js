var _ = require('underscore');
var ovsdbPrm = require('./primitives');

function schemaFromJSON(column){
  var result = new Schema();
  return result.fromJSON(column);
}

function Schema(){
  this.type = new Type();
}

Schema.prototype.fromJSON = function(col){
  this.type.fromJSON(col.type);
  return this;
};

function UUID(v){
  this.val = v[1];
}

UUID.prototype.toString = function(){
  return this.val;
};

UUID.prototype.toJSON = function(){
  return ['uuid', this.val];
};

function Type(v, schema){
  if(ovsdbPrm.isUUID(v)){
    this.value = new UUID(v);
  } else {
    this.value = v;
  }
}

Type.prototype.fromJSON = function(type){
  if(ovsdbPrm.isAtom(type)){
  } else if(_(type).isObject()){
    if(ovsdbPrm.isAtom(type.key)){
    } else if(_(type.key).isObject()){
      if(type.key.type === 'uuid'){
      }
    }
  } else {
    //console.log('other type', key);
  }
  this.type = type;
};

Type.prototype.updateFromJSON = function(col){
  this.value = col;
};

Type.prototype.toString = function(){
  return this.value;
};

function Column(cValue, cSchema){
  this.value = new Type(cValue, cSchema.type);
}

Column.prototype.updateFromJSON = function(col){
  this.value.updateFromJSON(col);
};

Column.prototype.toString = function(){
  return this.value.toString();
};

module.exports = {
  Column: Column,
  schemaFromJSON: schemaFromJSON,
  Schema: Schema 
};
