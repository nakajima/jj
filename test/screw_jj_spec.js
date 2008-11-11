Screw.Unit(function(screw) { with(screw) {
  describe("JJ Screw.Unit integration", function() {
    var item;
    
    before(function() {
      JJ.reset(item);
      item = {
        foo: function() { return "FOO"; },
        bar: function() { return "BAR"; }
      }
    });
    
    it("verifies mocks were called", function() {
      JJ.mock(item).method('foo');
      item.foo();
    });
    
    it("allows limit on times called", function() {
      JJ.mock(item).foo.times(2)
      item.foo();
      item.foo();
    });
    
    it("keeps a call count", function() {
      JJ.mock(item).foo.returns('foo');
      expect(JJ.mock(item).foo.callCount()).to(equal, 0);
      item.foo();
      expect(JJ.mock(item).foo.callCount()).to(equal, 1);
      item.foo();
      expect(JJ.mock(item).foo.callCount()).to(equal, 2);
      item.bar();
      expect(JJ.mock(item).foo.callCount()).to(equal, 2);
    });
    
    it("can be called off by resetting", function() {
      JJ.mock(item).foo.times(3);
      JJ.reset(item);
    })
    
    after(function() {
      JJ.verify(screw);
      JJ.reset(item);
    });
  });
}});