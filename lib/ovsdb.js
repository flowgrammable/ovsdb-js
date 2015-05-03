var _    = require('underscore');
var uuid = require('uuid');
var jrpc = require('jsonrpc-js');
var stats = require('./stats');
var prm   = require('./primitives');

var Methods = {
  ListDBs:       'list_dbs',
  GetSchema:     'get_schema',
  Transact:      'transact',
  Cancel:        'cancel',
  Monitor:       'monitor',
  Update:        'update',
  MonitorCancel: 'monitor_cancel',
  Lock:          'lock',
  Steal:         'steal',
  Unlock:        'unlock',
  Locked:        'locked',
  Stolen:        'stolen',
  Echo:          'echo'
};

function Transaction(peer, id) {
  this.peer = peer;
  this.id   = id;
} 

Transaction.prototype.cancel = function() {
  this.peer.notify('cancel', [this.id]);
};

function Monitor(peer, id, cb) {
  this.peer = peer;
  this.id   = id;
  this.cb   = cb;
} 

Monitor.prototype.cancel = function(callback) {
  this.peer.request('monitor_cancel', [this.id], callback);
};

function Lock(peer, name) {
  this.peer = peer;
  this.name = name;
}

Lock.prototype.unlock = function(callback) {
  this.peer.request('unlock', [this.name], callback);
};

function OVSDB(cfg, socket) {
  var that = this;
  this.peer = new jrpc.Peer(socket, 
    // request callback/handler
    function(msg) {
      that.recvRequest(msg);
    },
    // notification callback/handler
    function(msg) {
      that.recvNotify(msg);
    },
    // unacknowledged request expiration age
    10000,
    // low-level catastrophic failure callback/handler
    function() {
      that.destroy();
    }, cfg);
  this.activeMonitors = {};
  this.stats = new stats.Stats();
}

OVSDB.prototype.recvRequest = function(msg) {
  switch(msg.method) {
    case Methods.ListDBs:
      this.rx_list_dbs(msg);
      break;
    case Methods.GetSchema:
      this.rx_get_schema(msg);
      break;
    case Methods.Transact:
      this.rx_transact(msg);
      break;
    case Methods.Monitor:
      this.rx_monitor(msg);
      break;
    case Methods.Lock:
      this.rx_lock(msg);
      break;
    case Methods.Steal:
      this.rx_steal(msg);
      break;
    case Methods.Unlock:
      this.rx_unlock(msg);
      break;
    case Methods.Echo:
      this.rx_echo(msg);
      break;
    default:
      this.unknown_request(msg);
      break;
  }
};

OVSDB.prototype.recvNotify = function(msg) {
  switch(msg.method) {
    case Methods.Cancel:
      this.rx_cancel(msg);
      break;
    case Methods.Update:
      this.rx_update(msg);
      break;
    case Methods.MonitorCancel:
      this.rx_monitor_cancel(msg);
      break;
    case Methods.Locked:
      this.rx_locked(msg);
      break;
    case Methods.Stolen:
      this.rx_stolen(msg);
      break;
    default:
      this.unknown_notify(msg);
      break;
  }
};

OVSDB.prototype.destroy = function() {
};

OVSDB.prototype.timer = function() {
  this.peer.timer();
};

OVSDB.prototype.unknown_request = function(msg) {
  console.log('unknown request: '+msg);
};

OVSDB.prototype.unknown_notify = function(msg) {
  console.log('unknown notify: '+msg);
};

OVSDB.prototype.rx_list_dbs = function(msg) {
  // Update the stats
  this.stats.rcvPegs.requests++;
  this.stats.rcvPegs.reqs.listDB++;
};

OVSDB.prototype.rx_get_schema = function(msg) {
  // Update the stats
  this.stats.rcvPegs.requests++;
  this.stats.rcvPegs.reqs.getSchema++;
};

OVSDB.prototype.rx_transact = function(msg) {
  // Update the stats
  this.stats.rcvPegs.requests++;
  this.stats.rcvPegs.reqs.transact++;
};

OVSDB.prototype.rx_cancel = function(msg) {
  // Update the stats
  this.stats.rcvPegs.notifications++;
  this.stats.rcvPegs.reqs.cancel++;
};

OVSDB.prototype.rx_montior = function(msg) {
  // Update the stats
  this.stats.rcvPegs.requests++;
  this.stats.rcvPegs.reqs.monitor++;
};

OVSDB.prototype.rx_update = function(msg) {
  var that = this;
  // Update the stats
  this.stats.rcvPegs.notifications++;
  this.stats.rcvPegs.reqs.update++;
  if(_(this.activeMonitors).has(msg.params[0])){
    this.activeMonitors[msg.params[0]].cb(null, msg);
  }
};

OVSDB.prototype.rx_monitor_cancel = function(msg) {
  // Update the stats
  this.stats.rcvPegs.notifications++;
  this.stats.rcvPegs.reqs.monitor_cancel++;
};

OVSDB.prototype.rx_lock = function(msg) {
  // Update the stats
  this.stats.rcvPegs.requests++;
  this.stats.rcvPegs.reqs.lock++;
};

OVSDB.prototype.rx_steal = function(msg) {
  // Update the stats
  this.stats.rcvPegs.requests++;
  this.stats.rcvPegs.reqs.steal++;
};

OVSDB.prototype.rx_unlock = function(msg) {
  // Update the stats
  this.stats.rcvPegs.requests++;
  this.stats.rcvPegs.reqs.unlock++;
};

OVSDB.prototype.rx_locked = function(msg) {
  // Update the stats
  this.stats.rcvPegs.notifications++;
  this.stats.rcvPegs.reqs.locked++;
};

OVSDB.prototype.rx_stolen = function(msg) {
  // Update the stats
  this.stats.rcvPegs.notifications++;
  this.stats.rcvPegs.reqs.stolen++;
};

OVSDB.prototype.rx_echo = function(msg) {
  // Update the stats
  this.stats.rcvPegs.requests++;
  this.stats.rcvPegs.reqs.echo++;
  this.peer.response(msg.method, msg.id);
};

OVSDB.prototype.list = function(callback) {
  this.peer.request('list_dbs', [], callback);
};

OVSDB.prototype.get = function(db_name, callback) {
  this.peer.request('get_schema', [db_name], callback);
};

function mkParams(db_name, operations){
  prm.assertArray('operations', operations);
  prm.assertString('db_name', db_name);
  return _.flatten([db_name, operations], true);
}

OVSDB.prototype.transact = function(db_name, operations, callback) {
  var params = mkParams(db_name, operations); 
  var msg = this.peer.request('transact', params, callback);
  return new Transaction(this.peer, msg.id);
};

OVSDB.prototype.monitor = function(db_name, reqs, resCB, notCB) {
  // TODO: validate monitor request (reqs)
  // if monitor request is array
  //     each element must specify both columns and select
  //     columns must be non-overlapping sets
  //     RFC 7047, section 4.1.5, pg 16 
  var id = uuid.v4();
  var that = this;
  this.peer.request('monitor', [db_name, id , reqs], resCB); 
  var m = new Monitor(that.peer, id, notCB);
  that.activeMonitors[id] = m;
};

OVSDB.prototype.lock = function(lock_name, callback) {
  var that = this;
  this.peer.request('lock', [lock_name], function(err, result) {
    if(err) {
      callback(err);
    } else {
      callback(null, new Lock(that.peer, lock_name));
    }
  });
};

OVSDB.prototype.steal = function(lock_name, callback) {
  var that = this;
  this.peer.request('steal', [lock_name], function(err, result) {
    if(err) {
      callback(err);
    } else {
      callback(null, new Lock(that.peer, lock_name));
    }
  });
};

OVSDB.prototype.echo = function() {
  var that = this;
  this.peer.request('echo', [], function(err, res) {
    if(err) {
    } else {
    }
  });
};

exports.OVSDB = OVSDB;

