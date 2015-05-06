var _ = require('underscore');
var assert = require('assert');
var expect = require('expect.js');
var prm = require('../lib/primitives');
describe('primitives', function(){
  it('assertInteger', function(){
      expect(prm.assertInteger('hello',2)).to.be(undefined);
      expect(function(){
        prm.assertInteger('hello', false);
      }).to.throwError();
  });
  it('assertBoolean', function(){
      expect(prm.assertBoolean('b', true)).to.be(undefined);
      expect(function(){
        prm.assertBoolean('hello', 1);
      }).to.throwError();
  });
  it('assertNumber', function(){
    expect(prm.assertNumber('abc', 123)).to.be(undefined);
    expect(function(){
      prm.assertNumber('abc', 'def');
    }).to.throwError();
  });
  it('assertString', function(){
    expect(prm.assertString('abc', 'abc')).to.be(undefined);
    expect(function(){
      prm.assertString('abc', 123);
    }).to.throwError();
  });
  it('assertId', function(){
    expect(prm.assertId('uuid', 'abc123')).to.be(undefined);
    expect(function(){
      prm.assertId('abc', 'abc-1@23');
    }).to.throwError();
  });
  it('assertVersion', function(){
    expect(prm.assertVersion('myversion', '9.7.3')).to.be(undefined);
    expect(function(){
      prm.assertVersion('myversion', '9.7');
    }).to.throwError();
  });
  it('assertArray', function(){
    expect(prm.assertArray('anarray', [1,2,3])).to.be(undefined);
    expect(function(){
      prm.assertArray('ar', 'astring');
    }).to.throwError();
  });
  it('assertUntil', function(){
    expect(prm.assertUntil('au', '==')).to.be(undefined);
    expect(prm.assertUntil('au', '!=')).to.be(undefined);
    expect(function(){
      prm.assertUntil('au', 'abc');
    }).to.throwError();
  });
  it('assertColumns', function(){
    expect(prm.assertColumns(['a','b','c'])).to.be(undefined);
    expect(function(){
      prm.assertColumns([1,2,3]);
    }).to.throwError();
  });
  it('assertAtom', function(){
    var str = 'hello';
    var num = 1;
    var bool = true;
    var uuid = ['uuid', '550e8400-e29b-41d4-a716-446655440000'];
    var named_uuid = ['named-uuid', 'myrow'];
    var pass = [str, num, bool, uuid, named_uuid];
    var fail = [{obj: 1}, ['1'], ['uuid', 123], ['123', '550e8400-e29b-41d4-a716-446655440000']];
    _(pass).forEach(function(t){
      expect(prm.assertAtom(t)).to.be(undefined);
    });
    _(fail).forEach(function(f){
      expect(function(){
        prm.assertAtom(f);
      }).to.throwError();
    });
  });
  it('assertAtoms', function(){
    var str = 'hello';
    var num = 1;
    var bool = true;
    var uuid = ['uuid', '550e8400-e29b-41d4-a716-446655440000'];
    var named_uuid = ['named-uuid', 'myrow'];
    var pass = [str, num, bool, uuid, named_uuid];
    var fail = [str, num, bool, uuid, {fail:true} ];
    expect(prm.assertAtoms(pass)).to.be(undefined); 
    expect(function(){
      prm.assertAtoms(fail);
    }).to.throwError();

  });
  it('assertSet', function(){
    var pass1 = ['uuid', '550e8400-e29b-41d4-a716-446655440000'];
    var pass2 = ['set', [pass1, pass1, pass1]];
    var fail1 = ['set', pass1, pass1, pass1];
    var fail2 = ['set'];
    expect(prm.assertSet(pass1)).to.be(undefined);
    expect(prm.assertSet(pass2)).to.be(undefined);
    expect(function(){
      prm.assertSet(fail1);
    }).to.throwError();
    expect(function(){
      prm.assertSet(fail2);
    }).to.throwError();
  });
  it('assertPair(s)', function(){
    // 2 element json array [atom, atom]
    var str = 'hello';
    var num = 1;
    var bool = true;
    var uuid = ['uuid', '550e8400-e29b-41d4-a716-446655440000'];
    var named_uuid = ['named-uuid', 'myrow'];
    var pair1 = [uuid, num];
    var pair2 = [named_uuid, named_uuid];
    expect(prm.assertPair(pair1)).to.be(undefined);
    expect(prm.assertPair(pair2)).to.be(undefined);
    expect(function(){
      prm.assertPair(bool);
    }).to.throwError();

    expect(prm.assertPairs([pair1, pair2])).to.be(undefined);
    expect(function(){
      prm.assertPairs([pair1, bool]);
    }).to.throwError();
  });
  it('assertMap', function(){
    var str = 'hello';
    var num = 1;
    var bool = true;
    var uuid = ['uuid', '550e8400-e29b-41d4-a716-446655440000'];
    var named_uuid = ['named-uuid', 'myrow'];
    var pair1 = [uuid, num];
    var pair2 = [named_uuid, named_uuid];
    var map1 = ['map', [pair1, pair2]];
    expect(prm.assertMap(map1)).to.be(undefined);
    expect(function(){
      prm.assertMap(pair2);
    }).to.throwError();
  });
  it('assertValue', function(){
    // value is an atom, set, or map
    var str = 'hello';
    var num = 1;
    var bool = true;
    var uuid = ['uuid', '550e8400-e29b-41d4-a716-446655440000'];
    var named_uuid = ['named-uuid', 'myrow'];
    var pair1 = [uuid, num];
    var pair2 = [named_uuid, named_uuid];
    var map1 = ['map', [pair1, pair2]];
    expect(prm.assertValue(str)).to.be(undefined);
    expect(prm.assertValue(map1)).to.be(undefined); 
    expect(prm.assertValue(['set', uuid])).to.be(undefined);
    expect(function(){
      prm.assertValue(pair1);
    }).to.throwError();
  });
});
