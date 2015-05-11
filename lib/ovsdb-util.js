var _ = require('underscore');
var dbprm = require('./primitives');

exports.mapToObj = function(map){
  dbprm.assertMap(map);
  return _.chain(map).flatten(true).without('map').object().value();
};

exports.mkUUIDSet = function(uuidList, type){
  var uuidType;
  if(!type){
    uuidType = 'uuid';
  } else if(type === 'named'){
    uuidType = 'named-uuid';
  } else {
    throw new Error('Unknown uuid type: '+ type);
  }
  dbprm.assertArray('uuidList', uuidList);
  var uuidSet = ['set'];
  var uuids = [];
  _(uuidList).forEach(function(uuid){
    uuids.push([uuidType, uuid]);
  });
  uuidSet.push(uuids);
  return uuidSet;
};

