JJ.StubProxy = function(target) {
  JJ.stubCache[target] = this;
  this.target = target;
  this.storePristine();
}

JJ.extend(JJ.StubProxy.prototype, {
  storePristine: function() {
    this.fakeProperties = [];
    this.targetProperties = new Object();
    for (idx in this.target) {
      var prop = this.target[idx];
      this.targetProperties[idx] = prop;
      if (JJ.isFunction(prop)) {
        this.method(idx, prop);
      }
    }
  },
  
  method: function(name, fn) {
    this[name] = new JJ.MethodProxy(this, name, (fn || this.target[name]));
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
