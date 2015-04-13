#!/usr/bin/env node

var net = require('net');

function Header(buf, version, type, length, xid) {
  if(buf) {
    this.version = buf.readUIntBE(0, 1);
    this.type    = buf.readUIntBE(1, 1);
    this.length  = buf.readUIntBE(2, 2);
    this.xid     = buf.readUIntBE(4, 4);
  } else {
    this.version = verson;
    this.type    = type;
    this.length  = length;
    this.xid     = xid;
  }
}

net.createServer(function(socket) {

  socket.on('connect', function(sk) {
    console.log('connected');
  });
  socket.on('data', function(data) {
    if(data.length >= 8) {
      var hdr = new Header(data);
      console.log(hdr);
      console.log(data.length);
    }
  });
  socket.on('close', function() {
    console.log('closed');
  });
}).listen(6633);

