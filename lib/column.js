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

function Type(){
  this.type = '';
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

function Column(c, type){
}

Column.prototype.toString = function(){

};

module.exports = {
  Column: Column,
  schemaFromJSON: schemaFromJSON,
  Schema: Schema 
};
