(function($) {
  var JJ = {
    pristineCache: { }
  }

  JJ.MethodProxy = function(proxy, name) {
    this.proxy = proxy;
    this.name = name;
  }
  
  $.extend(JJ.MethodProxy.prototype, {
    returns: function(value) {
      this.proxy.target[this.name] = function() { return value; }
    }
  });
  
  JJ.Proxy = function(target) {
    JJ.pristineCache[target] = this;
    this.target = target;
    this.fakeProperties = [];
    this.targetProperties = new Object();
    this.storePristine();
  }
  
  $.extend(JJ.Proxy.prototype, {
    storePristine: function() {
      for (idx in this.target) {
        var prop = this.target[idx];
        this.targetProperties[idx] = prop;
        if ($.isFunction(prop)) {
          this.method(idx, prop);
        }
      }
    },
    
    method: function(name, fn) {
      this[name] = new JJ.MethodProxy(this, name);
      if (!fn) { this.fakeProperties.push(name); }
      return this[name];
    },
    
    reset: function() {
      for (idx in this.fakeProperties) {
        delete(this.target[this.fakeProperties[idx]]);
      }
      
      for (idx in this.targetProperties) {
        this.target[idx] = this.targetProperties[idx];
      }
    },
    
    // This method is highly suspect. If only other browsers gave
    // more informative error messages, we could see what the missing
    // method was. As it is, we're just looking for method invocations
    // based on regular expressions.
    stubEval: function(fn) {
      try {
        fn(this)
      } catch(e) {
        var fnSrc = fn.toString();
        var varName = (fnSrc.match(/function\s*\((\w+)\)\s*\{/) || [])[1];
        var matcher = new RegExp(varName + "\\.(\\w+)");
        var lines = fnSrc.split(/\n+/);
        
        var def = function(m) {
          if (!this.target[m]) {
            this.target[m] = function() { }
            this.method(m);
          }
        }
        
        for (i in lines) {
          var matches = lines[i].match(matcher) || [];
          if (m = matches[1]) { def.call(this, m); }
        }
      }
      
      fn(this);
    }
  });

  JJ.stub = function(target, fn) {
    var objectProxy = JJ.pristineCache[target] || new JJ.Proxy(target);
    if (fn) { objectProxy.stubEval(fn); }
    return objectProxy;
  }
  
  JJ.reset = function(target) {
    if (proxy = JJ.pristineCache[target])
      proxy.reset();
      delete(JJ.pristineCache[target]);
  }
  
  window.JJ = JJ;
})(jQuery)