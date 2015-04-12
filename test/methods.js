var _ = require('underscore');
var expect = require('expect.js');
var net = require('net');
var ovsdb = require('../lib/ovsdb');

/*
 *  Note: ovsdb instance must be configured to accept connections on port 6640
 *  sudo ovs-vsctl set-manager ptcp:6640
 */

describe('OVSDB Client methods', function(){
  describe('listDB', function(){

    var ovsdbcli;
    var dbName;
    it('client should connect...', function(done){
      var client = new net.Socket();
      client.connect(6640,'0.0.0.0', function(){
        ovsdbcli = new ovsdb.OVSDB(client);
        done();
      });
    });

    it('client should get list pass', function(done){
      ovsdbcli.list(function(err, res){
      	expect(res.length).to.be(1);
        console.log(ovsdbcli.peer.requests);
        dbName = res[0];
        done();
      });
    });

    it('client should get list fail', function(done){
      expect(false).to.be(true);
      done();
    });

    it('client should get schema pass', function(done){
      ovsdbcli.get(dbName, function(err, res){
        expect(_.isObject(res)).to.be(true);
        console.log(ovsdbcli.peer.requests);
        done();
      });
    });

    it('client should get schema fail', function(done){
      ovsdbcli.get('test', function(err, res){
        expect(res.error).to.be('unknown database');
	      done(); 
      });
    });

  });
});
