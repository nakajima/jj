(function($) {
  var JJ = {
    pristineCache: { }
  }
  
  JJ.Proxy = function(target) {
    JJ.pristineCache[target] = this;
    this.target = target;
    this.fakeProperties = [];
    this.targetProperties = new Object();
    this.storePristine();
  }
  
  JJ.MethodProxy = function(proxy, name) {
    this.proxy = proxy;
    this.name = name;
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
      if (!fn) { this.fakeProperties.push(name); }
      this[name] = new JJ.MethodProxy(this, name);
    },
    
    reset: function() {
      for (idx in this.fakeProperties) {
        delete(this.target[this.fakeProperties[idx]]);
      }
      
      for (idx in this.targetProperties) {
        this.target[idx] = this.targetProperties[idx];
      }
    },
    
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
            this.stubMethod(m);
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