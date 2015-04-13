
var ofp10 = require('./ofp10');
var ofp11 = require('./ofp11');
var ofp12 = require('./ofp12');
var ofp13 = require('./ofp13');
var ofp14 = require('./ofp14');
var ofp15 = require('./ofp15');

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

Header.bytes = function() { return 8; };

exports.Header = Header;

function Payload(hdr, buf) {
  switch(hdr.version) {
    case ofp10.version:
      return new ofp10.Payload(hdr.type, buf);
    case ofp11.version:
      return new ofp11.Payload(hdr.type, buf);
    case ofp12.version:
      return new ofp12.Payload(hdr.type, buf);
    case ofp13.version:
      return new ofp13.Payload(hdr.type, buf);
    case ofp14.version:
      return new ofp14.Payload(hdr.type, buf);
    case ofp15.version:
      return new ofp15.Payload(hdr.type, buf);
    default:
      return null;
  }
}

