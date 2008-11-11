(function($) {
  JJ.MethodExpectation = function(method, args) {
    this.args = args;
    this.method = method;
  }
  
  $.extend(JJ.MethodExpectation.prototype, {
    satisfied: function() {
      if (this.method.callLimit) {
        return this.method.callCount() == this.method.callLimit;
      } else {
        return this.method.callCount() > 0
      }
    }
  });
  
  JJ.MethodProxy = function(proxy, name, fn) {
    this.calls = 0;
    this.value = null;

    this.fn = fn;
    this.name = name;
    this.proxy = proxy;

    var context = this;
    this.proxy.target[name] = function() {
      return context.called.apply(context, arguments);
    }
  }

  $.extend(JJ.MethodProxy.prototype, {
    returns: function(value) {
      if (this.proxy instanceof JJ.MockProxy) { this.proxy.expect(this); }
      this.value = value;
    },
    
    times: function(int) {
      if (this.proxy instanceof JJ.MockProxy) { this.proxy.expect(this); }
      this.callLimit = int;
      return this;
    },

    called: function() {
      this.calls++;
      return this.value || this.fn.call(this.proxy.target, arguments);
    },

    callCount: function() {
      return this.calls;
    }
  });
})(jQuery)
