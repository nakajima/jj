(function($) {
  $.extend(Screw.Matchers, {
    have_received: {
      match: function(expected, actual) {
        return expected.satisfied();
      },

      failure_message: function(expected, actual, not) {
        return 'expected ' + $.print(actual) + (not ? ' to not receive ' : ' to receive ') + $.print(expected);
      }
    }
  })
})(jQuery);