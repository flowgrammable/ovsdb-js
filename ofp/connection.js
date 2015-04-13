
var ofp = require('./ofp');

function Connection() {
  this.buffer = null;
  this.hdr    = null;
  this.hdrlen = ofp.Header.bytes();
  this.pldlen = 0;
}

Connection.prototype.read = function(data) {
  // Set or append to the connection buffer
  if(this.buffer === null) {
    this.buffer = data;
  } else {
    this.buffer = Buffer.concat(this.buffer, data);
  }
  // If there is not enough to do anything bail
  if(this.buffer.data < this.pldlen) {
    return null;
  }
  // Setup the header and determine payload size
  this.hdr    = new ofp.Header(this.buffer);
  this.buffer = this.buffer.slice(this.hdrlen);
  this.pldlen = this.hdr.length - this.hdrlen;

  // Bail if not enough bytes for payload
  if(this.buffer.data < this.pldlen) {
    return null;
  }
};

exports.Connection = Connection;

