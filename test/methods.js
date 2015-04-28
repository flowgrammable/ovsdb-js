var _ = require('underscore');
var expect = require('expect.js');
var net = require('net');
var ovsdb = require('../lib/ovsdb');
var ops = require('../lib/operations');

/*
 *  Note: ovsdb instance must be configured to accept connections on port 6640
 *  sudo ovs-vsctl set-manager ptcp:6640
 */

describe('OVSDB Client', function(){
  describe('methods', function(){
    var cfg = {};
    var ovsdbcli;
    var dbName;
    it('client should connect...', function(done){
      var client = new net.Socket();
      client.connect(6640,'0.0.0.0', function(){
        ovsdbcli = new ovsdb.OVSDB(cfg, client);
        done();
      });
    });

    it('list_db pass', function(done){
      ovsdbcli.list(function(err, res){
      	expect(res.length).to.be(1);
        console.log(ovsdbcli.peer.requests);
        dbName = res[0];
        done();
      });
    });

    it('list_dbs fail', function(done){
      expect(false).to.be(true);
      done();
    });

    it('get_schema pass', function(done){
      ovsdbcli.get(dbName, function(err, res){
        expect(_.isObject(res)).to.be(true);
        console.log(ovsdbcli.peer.requests);
        done();
      });
    });

    it('get_schema fail', function(done){
      ovsdbcli.get('test', function(err, res){
        expect(res.error).to.be('unknown database');
	    done(); 
      });
    });

	it('transact - insert', function(done){
		var insOp = ops.insert({table:'Bridge',row: {name: 'test01'}});
		ovsdbcli.transact(dbName, [insOp], function(err, res){
      expect(res[0].uuid.length).to.be(2);
			done();
		});
	});

  });
});
