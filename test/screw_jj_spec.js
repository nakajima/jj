Screw.Unit(function(screw) { with(screw) {
  with(JJ) {
    describe("JJ Screw.Unit integration", function() {
      var item;
    
      before(function() {
        reset(item);
        item = {
          foo: function() { return "FOO"; },
          bar: function() { return "BAR"; }
        }
      });
    
      it("verifies mocks were called", function() {
        mock(item).method('foo');
        item.foo();
      });
    
      it("allows limit on times called", function() {
        mock(item).foo.times(2)
        item.foo();
        item.foo();
      });
    
      it("keeps a call count", function() {
        mock(item).foo.returns('foo');
        expect(mock(item).foo.callCount()).to(equal, 0);
        item.foo();
        expect(mock(item).foo.callCount()).to(equal, 1);
        item.foo();
        expect(mock(item).foo.callCount()).to(equal, 2);
        item.bar();
        expect(mock(item).foo.callCount()).to(equal, 2);
      });
    
      it("can be called off by resetting", function() {
        mock(item).foo.times(3);
        reset(item);
      })
    
      after(function() {
        verify(screw);
        reset(item);
      });
    });
  }
}});