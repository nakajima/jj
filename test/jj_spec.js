Screw.Unit(function() {
  describe("JJ", function() {
    var item;
    
    before(function() {
      item = {
        foo: function() { return "FOO"; },
        bar: function() { return "BAR"; }
      }
    });
    
    it("doesn't affect default behaviors", function() {
      expect(item.foo()).to(equal, "FOO");
      expect(item.bar()).to(equal, "BAR");
    });
    
    describe("stub", function() {
      before(function() {
        JJ.stub(item).foo.returns("STUBBED");
      })
      
      it("doesn't alter non-stubbed methods", function() {
        expect(item.bar()).to(equal, "BAR");
      });
      
      it("changes the stubbed method's return value", function() {
        expect(item.foo()).to(equal, "STUBBED");
      });
    });
    
    describe("reset", function() {
      before(function() {
        JJ.stub(item).foo.returns("STUBBED");
      });
      
      it("resets stubs", function() {
        JJ.reset(item);
        expect(item.bar()).to(equal, "BAR")
        expect(item.foo()).to(equal, "FOO");
      });
      
      it("doesn't blow up when attempting to reset non-stubbed object", function() {
        JJ.reset({ }); // should not throw error
      });
    });
    
    after(function() {
      JJ.reset(item);
    });
  });
});