
var prm = require('./primitives');

/////////////////////////////// Operations ///////////////////////////////

exports.insert = function(params) {
  // basic insert validation
  prm.assertObject('insert.params', params);
  prm.assertId('table', params.table);
  prm.assertObject('row', params.row);
  // build the base object
  var insert = {
    op:    "insert",
    table: params.table,
    row:   params.row
  };
  // determine if a named uuid is present and valid 
  if(params.uuid_name) {
    prm.assertString('uuid-name', params.uuid_name);
    insert["uuid-name"] = params.uuid_name;
  }
  // thats it ...
  return insert;
};

exports.select = function(params) {
  // basic select validation
  prm.assertObject('select.params', params);
  prm.assertId('table', params.table);
  // build the base object
  var select = {
    op: "select",
    table: params.table,
    where: [],
    columns: [] 
  };
  // validate the where clause if present ..
  if(params.where) {
    prm.assertArray('where', params.where);
    update.where = params.where;
  }
  // validate the target columns if present ..
  if(params.columns) {
    prm.assertColumns(params.columns);
    select.columns = params.columns;
  }
  // thats it ...
  return select;
};

exports.update = function(params) {
  // basic update validation
  prm.assertObject('update.params', params);
  prm.assertId('table', params.table);
  prm.assertObject('row', params.row);
  // build the base object
  var update = {
    op:    "update",
    table: params.table,
    where: [],
    row:   params.row
  };
  // validate the where clause if present ..
  if(params.where) {
    prm.assertArray('where', params.where);
    update.where = params.where;
  }
  // thats it ...
  return update;
};

exports.mutate = function(params) {
  // basic mutate validation
  prm.assertObject('mutate.params', params);
  prm.assertId('table', params.table);
  var mutate = {
    op:        "mutate",
    table:     params.table,
    where:     [],
    mutations: []
  };
  // validate the where clause if present ..
  if(params.where) {
    prm.assertArray('where', params.where);
    mutate.where = params.where;
  }
  // validate the mutations clause if present ..
  if(params.mutations) {
    prm.assertArray('mutations', params.mutations);
    mutate.mutations = params.mutations;
  }
  // thats it ...
  return mutate;
};

exports.del = function(params) {
  // basic mutate validation
  prm.assertObject('delete.params', params);
  prm.assertId('table', params.table);
  var del = {
    op:    "delete",
    table: params.table,
    where: []
  };
  // validate the where clause if present ..
  if(params.where) {
    prm.assertArray('where', params.where);
    del.where = params.where;
  }
  // thats it ...
  return del;
};

exports.wait = function(params) {
  // basic wait validation
  prm.assertObject('wait.params', params);
  prm.assertId('table', params.table);
  prm.assertUntil('until', params.until);
  var wait = {
    op:      "wait",
    table:   params.table,
    where:   [],
    columns: [],
    until:   params.until,
    rows:    []
  };
  // validate the timeout if present ..
  if(params.timeout) {
    prm.assertInteger('timeout', params.timeout);
    wait.timeout = params.timeout;
  }
  // validate the where clause if present ..
  if(params.where) {
    prm.assertArray('where', params.where);
    wait.where = params.where;
  }
  // validate the columns clause if present ..
  if(params.columns) {
    prm.assertColumns(params.columns);
    wait.columns = params.columns;
  }
  // validate the rows clause if present ..
  if(params.rows) {
    prm.assertArray('rows', params.rows);
    wait.rows = params.rows;
  }
  // thats it ...
  return wait;
};

exports.commit = function(params) {
  // basic commit validation
  prm.assertBoolean('durable', params.durable);
  // return the simple commit object
  return {
    op: "commit",
    durable: params.durable
  };
};

exports.abort = function() {
  // return the simple abort object
  return { op: "abort" };
};

exports.comment = function(params) {
  // basic comment validation
  prm.assertObject('comment.params', params);
  prm.assertString('comment', params.comment);
  // return the simple comment object
  return {
    op: "comment",
    comment: params.comment
  };
};

exports.assert = function(params) {
  // basic assert validation
  prm.assertObject('assert.params', params);
  prm.assertString('lock', params.lock);
  // return the simple assert object
  return {
    op: "assert",
    lock: params.lock
  };
};

//////////////////////// OVSDB Functions //////////////////////////

exports.less = function(col, val) {
  return [col, "<", val];
};

exports.lessEqual = function(col, val) {
  return [col, "<=", val];
};

exports.equal = function(col, val) {
  return [col, "==", val];
};

exports.notEqual = function(col, val) {
  return [col, "!=", val];
};

exports.greaterEqual = function(col, val) {
  return [col, ">=", val];
};

exports.greater = function(col, val) {
  return [col, ">", val];
};

exports.includes = function(col, val) {
  return [col, "includes", val];
};

exports.excludes = function(col, val) {
  return [col, "excludes", val];
};

//////////////////////// OVSDB Mutations //////////////////////////

exports.addTo = function(col, val) {
  return [col, "+=", val];
};

exports.subFrom = function(col, val) {
  return [col, "-=", val];
};

exports.multTo = function(col, val) {
  return [col, "*=", val];
};

exports.divFrom = function(col, val) {
  return [col, "/=", val];
};

exports.modFrom = function(col, val) {
  return [col, "%=", val];
};

exports.insertTo = function(col, val) {
  return [col, "insert", val];
};

exports.deleteFrom = function(col, val) {
  return [col, "delete", val];
};

