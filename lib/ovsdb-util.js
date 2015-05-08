var dbprm = require('./primitives');

exports.mapToObj = function(map){
  dbprm.assertMap(map);
  return _.chain(map).flatten(true).without('map').object().value();
};

