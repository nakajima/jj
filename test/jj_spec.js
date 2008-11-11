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
      
      it("can stub multiple methods", function() {
        JJ.stub(item).bar.returns("OTHER STUBBED");
        expect(item.foo()).to(equal, "STUBBED");
        expect(item.bar()).to(equal, "OTHER STUBBED");
      });
    });
    
    describe("reset", function() {
      before(function() {
        JJ.stub(item).foo.returns("STUBBED");
      });
      
      it("resets an item", function() {
        JJ.reset(item);
        expect(item.bar()).to(equal, "BAR")
        expect(item.foo()).to(equal, "FOO");
      });
      
      it("resets item when multiple methods are stubbed", function() {
        JJ.stub(item).bar.returns("OTHER STUBBED");
        JJ.reset(item);
        expect(item.bar()).to(equal, "BAR")
        expect(item.foo()).to(equal, "FOO");
      });
      
      it("doesn't blow up when attempting to reset non-stubbed object", function() {
        JJ.reset({ }); // should not throw error
      });
    });
    
    describe("a stub context", function() {
      before(function() {
        JJ.stub(item, function(stub) {
          stub.foo.returns("CONTEXT-FOO")
          stub.fizz.returns("FIZZ");
          stub.buzz.returns("BUZZ");
        });
      });
      
      it("allows stub declarations on function argument", function() {
        expect(item.foo()).to(equal, "CONTEXT-FOO");
      });
      
      it("allows stubbing of methods that don't exist", function() {
        expect(item.fizz()).to(equal, "FIZZ");
        expect(item.buzz()).to(equal, "BUZZ");
      });
      
      it("resets dynamically added stub context methods", function() {
        JJ.reset(item);
        expect(item.fizz).to(be_undefined);
        expect(item.buzz).to(be_undefined);
      });
    });
    
    after(function() {
      JJ.reset(item);
    });
  });
});