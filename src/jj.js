(function($) {
  var JJ = {
    pristineCache: { }
  }
  
  JJ.Proxy = function(target) {
    JJ.pristineCache[target] = this;
    this.target = target;
    this.targetProperties = new Object();
    this.storePristine();
  }
  
  JJ.MethodProxy = function(proxy, name, fn) {
    this.proxy = proxy;
    this.name = name;
    this.fn = fn;
  }
  
  $.extend(JJ.MethodProxy.prototype, {
    returns: function(value) {
      this.proxy.target[this.name] = function() { return value; }
    }
  })
  
  $.extend(JJ.Proxy.prototype, {
    storePristine: function() {
      for (idx in this.target) {
        var prop = this.target[idx];
        this.targetProperties[idx] = prop;
        if ($.isFunction(prop)) {
          this.stubMethod(idx, prop);
        }
      }
    },
    
    stubMethod: function(name, fn) {
      this[name] = new JJ.MethodProxy(this, name, fn);
    },
    
    reset: function() {
      for (idx in this.targetProperties) {
        this.target[idx] = this.targetProperties[idx];
      }
    }
  });

  JJ.stub = function(target) {
    return JJ.pristineCache[target] || new JJ.Proxy(target);
  }
  
  JJ.reset = function(target) {
    if (proxy = JJ.pristineCache[target])
      proxy.reset();
      delete(JJ.pristineCache[target]);
  }
  
  window.JJ = JJ;
})(jQuery)