JJ.MockProxy = function(target) {
  JJ.mockCache[target] = this;
  this.target = target;
  this.expectations = { };
  this.storePristine();
}

JJ.extend(JJ.MockProxy.prototype, {
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
    this.expect(this[name]);
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
  
  expect: function(method) {
    this.expectations[method] = this.expectations[method] || new JJ.MethodExpectation(method);
  }
});
