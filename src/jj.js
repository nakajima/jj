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
      var proxy = this;
      proxy[name] = function() { fn.apply(proxy, arguments); }
      proxy[name].returns = function(value) {
        proxy.target[name] = function() { return value; }
      }
    },
    
    reset: function() {
      for (idx in this.targetProperties) {
        this.target[idx] = this.targetProperties[idx];
      }
    }
  });

  JJ.stub = function(target) {
    return new JJ.Proxy(target);
  }
  
  JJ.reset = function(target) {
    if (proxy = JJ.pristineCache[target])
      proxy.reset();
  }
  
  window.JJ = JJ;
})(jQuery)