var _ = require('underscore');

function getArray(args) {
  var result = [];
  for(var i=0; i<args.length; ++i) {
    result.push(args[i]);
  }
  return result;
}

///////////////////////////////// Type Assertions //////////////////////////////

function assertInteger(name, val) {
  if(_(val).isUndefined()) {
    throw new Error(name + ' is undefined');
  }
  if(!_(val).isFinite()) {
    throw new Error(name+' not integer: '+val);
  }
}
exports.assertInteger = assertInteger;

function isInteger(val) {
  return _(val).isFinite();
}
exports.isInteger = isInteger;

function assertNumber(name, val) {
  if(_(val).isUndefined()) {
    throw new Error(name + ' is undefined');
  }
  if(!_(val).isNumber()) {
    throw new Error(name+' not number: '+val);
  }
}
exports.assertNumber = assertNumber;

function isNumber(val) {
  return _(val).isNumber();
}
exports.isNumber = isNumber;

function assertBoolean(name, val) {
  if(_(val).isUndefined()) {
    throw new Error(name+' is undefined');
  }
  if(!_(val).isBoolean()) {
    throw new Error(name+' not boolean: '+val);
  }
}
exports.assertBoolean = assertBoolean;

function isBoolean(val) {
  return _(val).isBoolean();
}
exports.isBoolean = isBoolean;

function assertString(name, str) {
  if(_(str).isUndefined()) {
    throw new Error(name+' is undefined');
  }
  if(!_(str).isString()) {
    throw new Error(name+' not a string: '+str);
  }
}
exports.assertString = assertString;

function isString(str) {
  return _(str).isString();
}
exports.isString = isString;

function assertId(name, id) {
  assertString(name, id);
  if(!/[a-zA-Z_][a-zA-Z0-9_]*/.test(id)) {
    throw new Error(name+' not identifier: '+id);
  }
}
exports.assertId = assertId;

function isId(id) {
  return isString(id) && !/[a-zA-Z_][a-zA-Z_0-9]*/.test(id);
}
exports.isId = isId;

function assertVersion(name, ver) {
  assertString(name, ver);
  if(!/[0-9]+\.[0-9]+\.[0-9]+/.test(ver)) {
    throw new Error(name+ 'not version: '+ver);
  }
}
exports.assertVersion = assertVersion;

function isVersion(ver) {
  return isString(ver) && /[0-9]+\.[0-9]+\.[0-9]+/.test(ver);
}
exports.isVersion = isVersion;

function assertObject(name, obj) {
  if(_(obj).isUndefined()) {
    throw new Error(name+' is undefined');
  }
  if(!_(obj).isObject()) {
    throw new Error(name+' not an object: '+obj);
  }
}
exports.assertObject = assertObject;

function isObject(obj) {
  return _(obj).isObject();
}
exports.isObject = isObject;

function assertArray(name, array) {
  if(_(array).isUndefined()) {
    throw new Error(name+' is undefined');
  }
  if(!_(array).isArray()) {
    throw new Error(name+' not an array: '+array);
  }
}
exports.assertArray = assertArray;

function isArray(array) {
  return _(array).isArray();
}
exports.isArray = isArray;

function assertUntil(name, until) {
  assertString(name, until);
  if(!(until === '==' || until === '!=')) {
    throw new Error(name+'not an until: '+until);
  }
}
exports.assertUntil = assertUntil;

function isUntil(until) {
  return until === '==' || until === '!=';
}
exports.isUntil = isUntil;

function assertColumns(columns) {
  assertArray('columns', columns);
  _(columns).each(function(column) {
    assertString(column, column);
  });
}
exports.assertColumns = assertColumns;

function isColumns(cols) {
  return _(cols).isArray() && 
          _(cols).every(function(col) {
            return isString(col);
          });
}
exports.isColumns = isColumns;

///////////////////////////// Types ///////////////////////////////

function isAtom(atom) {
  return _(atom).isString() || _(atom).isNumber() || _(atom).isBoolean() ||
    isUUID(atom) || isNamedUUID(atom);
}
exports.isAtom = isAtom;

function assertAtom(atom) {
  if(!isAtom(atom)) {
    throw new Error('Not atom: '+atom);
  }
}
exports.assertAtom = assertAtom;

function assertAtoms(atoms) {
  _(atoms).each(function(atom) {
    assertAtom(atom);
  });
}
exports.assertAtoms = assertAtoms;

var uuidMatch = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;

function isUUID(uuid){
  assertArray('uuid', uuid);
  return uuid.length == 2 && uuid[0] === 'uuid' && uuidMatch.test(uuid[1]);
}
exports.isUUID = isUUID;

function isNamedUUID(namedUUID){
  assertArray('named-uuid', namedUUID);
  return namedUUID.length == 2 && namedUUID[0] === 'named-uuid' && 
    _(namedUUID[1]).isString();
}
exports.isNamedUUID = isNamedUUID;

exports.set = function() {
  // Initialize the set and convert the arguments
  var set = [];
  var array = getArray(arguments);
  // empty set is legit
  if(array.length === 0) {
  } else if(array.length === 1) {
    if(_(array[0]).isArray()) {
      assertAtoms(array[0]);
      set = array[0];
    } else if(isAtom(array[0])) {
      set.push(array[0]);
    } else {
      throw 'Bad arguments';
    }
  } else if(array.length > 1 && 
            _(array).every(function(elem) {
              return isAtom(elem);
            })) {
    set = array;
  } else {
    throw 'Set failure';
  }
  return ['set', set];
};

function isSet(set) {
  return isAtom(set) || (
            _(set).isArray() && set.length === 2 && set[0] === 'set' &&
            _(set[1]).isArray() && _(set[1]).every(function(elem) {
              return isAtom(elem);
            })
          );
}
exports.isSet = isSet;

function assertSet(set) {
  if(!isSet(set)) {
    throw new Error('Not set: '+set);
  }
}
exports.assertSet = assertSet;

exports.pair = function(lhs, rhs) {
  assertAtom(lhs);
  assertAtom(rhs);
  return [lhs, rhs];
};

function isPair(pair) {
  return _(pair).isArray() && pair.length === 2 &&
         isAtom(pair[0]) && isAtom(pair[1]);
}
exports.isPair = isPair;

function assertPair(pair) {
  if(!isPair(pair)) {
    throw new Error('Not pair: '+pair);
  }
}
exports.assertPair = assertPair;

function assertPairs(pairs) {
  _(pairs).each(function(pair) {
    assertPair(pair);
  });
}
exports.assertPairs = assertPairs;

exports.map = function() {
  var map = [];
  var array = getArray(arguments);
  // empty set is legit
  if(array.length === 0) {
  } else if(array.length === 1) {
    if(_(array[0]).isArray()) {
      assertPairs(array[0]);
      set = array[0];
    } else if(isPair(array[0])) {
      set.push(array[0]);
    } else {
      throw 'Bad arguments';
    }
  } else if(array.length > 1 && 
            _(array).every(function(elem) {
              return isPair(elem);
            })) {
    set = array;
  } else {
    throw 'Map failure';
  }

  return ['map', map];
};

function isMap(map) {
  return _(map).isArray() && map.length === 2 && map[0] === 'map' &&
         _(map[1]).isArray() && _(map[1]).every(function(pair) {
           // FIXME should also check pair types are same
           return isPair(pair);
         });
}
exports.isMap = isMap;

function assertMap(map) {
  if(!isMap(map)) {
    throw new Error('Not map: '+map);
  }
}
exports.assertMap = assertMap;

function isValue(value) {
  return isAtom(value) || isSet(value) || isMap(value);
}
exports.isValue = isValue;

function assertValue(value) {
  if(!isValue(value)) {
    throw new Error('Not value: '+value);
  }
}
exports.assertValue = assertValue;

