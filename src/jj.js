(function($) {
  var JJ = {
    stubCache: { },
    mockCache: { }
  }
  
  JJ.verify = function(screw) {
    for (i in JJ.mockCache) {
      var proxy = JJ.mockCache[i]
      for (m in proxy.methods) {
        screw.expect(proxy.target).to(screw.have_received, proxy.methods[m]);
      }
    }
  }
  
  JJ.mock = function(target, fn) {
    var objectProxy = JJ.mockCache[target] || new JJ.MockProxy(target);
    if (fn) { objectProxy.mockEval(fn); }
    return objectProxy;
  }
  
  JJ.stub = function(target, fn) {
    var objectProxy = JJ.stubCache[target] || new JJ.StubProxy(target);
    if (fn) { objectProxy.stubEval(fn); }
    return objectProxy;
  }
  
  JJ.reset = function(target) {
    if (proxy = JJ.mockCache[target]) {
      proxy.reset();
      delete(JJ.mockCache[target]);
    }
      
    if (proxy = JJ.stubCache[target]) {
      proxy.reset();
      delete(JJ.stubCache[target]);      
    }
  }
  
  window.JJ = JJ;
})(jQuery)