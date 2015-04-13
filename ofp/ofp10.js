
var _ = require('underscore');

var Type = {
  Hello: 0, Error: 1, EchoReq: 2, EchoRes: 3, Vendor: 4,
  FeatureReq: 5, FeatureRes: 6, GetConfigReq: 7, GetConfigRes: 8, SetConfig: 9,
  PacketIn: 10, FlowRemoved: 11, PortStatus: 12, PacketOut: 13, FlowMod: 14,
  PortMod: 15, StatsReq: 16, StatsRes: 17, BarrierReq: 18, BarrierREs: 19,
  QueueGetConfigReq: 20, QueueGetConfigRes: 21
};
exports.Type = Type;

function typeToString(type) {
  var inverse = _(type).inverse();
  if(_(inverse).has(type)) {
    return inverse[type];
  } else {
    return "Unknown("+type+")";
  }
}
exports.typeToString = typeToString;

function Hello(buf, data) {
  if(buf) {
    this.data = buf;
  } else {
    this.data = data;
  }
}
exports.Hello = Hello;

Hello.prototype.bytes = function() {
  return this.data ? this.data.length : 0;
}

exports.Error = function(buf) {
};

exports.EchoReq = function(buf) {
};

exports.EchoRes = function(buf) {
};

exports.Vendor = function(buf) {
};

exports.FeatureReq = function(buf) {
};

exports.FeatureRes = function(buf) {
};

exports.GetConfigReq = function(buf) {
};

exports.GetConfigRes = function(buf) {
};

exports.SetConfig = function(buf) {
};

exports.PacketIn = function(buf) {
};

exports.FlowRemoved = function(buf) {
};

exports.PortStatus = function(buf) {
};

exports.PacketOut = function(buf) {
};

exports.FlowMod = function(buf) {
};

exports.PortMod = function(buf) {
};

exports.StatsReq = function(buf) {
};

exports.StatsRes = function(buf) {
};

exports.BarrierReq = function(buf) {
};

exports.BarrierRes = function(buf) {
};

exports.QueueGetConfigReq = function(buf) {
};

exports.QueueGetConfigRes = function(buf) {
};

function Payload(type, buf) {
  switch(type) {
    case Type.Hello:
      return new Hello(buf);
    case Type.Error:
      return new Error(buf);
    case Type.EchoReq:
      return new EchoReq(buf);
    case Type.EchoRes:
      return new EchoRes(buf);
    case Type.Vendor:
      return new Vendor(buf);
    case Type.FeatureReq:
      return new FeatureReq(buf);
    case Type.FeatureRes:
      return new FeatureRes(buf);
    case Type.GetConfigReq:
      return new GetConfigReq(buf);
    case Type.GetConfigRes:
      return new GetConfigRes(buf);
    case Type.SetConfig:
      return new SetConfig(buf);
    case Type.PacketIn:
      return new PacketIn(buf);
    case Type.FlowRemoved:
      return new FlowRemoved(buf);
    case Type.PortStatus:
      return new PortStatus(buf);
    case Type.PacketOut:
      return new PacketOut(buf);
    case Type.FlowMod:
      return new FlowMod(buf);
    case Type.PortMod:
      return new PortMod(buf);
    case Type.StatsReq:
      return new StatsReq(buf);
    case Type.StatsRes:
      return new StatsRes(buf);
    case Type.BarrierReq:
      return new BarrierReq(buf);
    case Type.BarrierRes:
      return new BarrierRes(buf);
    case Type.GetQueueConfigReq:
      return new GetQueueConfigReq(buf);
    case Type.GetQueueConfigRes:
      return new GetQueueConfigRes(buf);
    default:
      return null;
  }
}
exports.Payload = Payload;

