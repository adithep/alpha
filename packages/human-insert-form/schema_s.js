(function() {
  Template.__define__("display_humans", (function() {
    var self, template;
    self = this;
    template = this;
    return UI.Eacha((function() {
      return Spacebars.call(self.lookup("humans"));
    }), UI.block(function() {
      self = this;
      return ["\n  ", Spacebars.include(self.lookupTemplate("__display_humans")), "\n  "];
    }));
  }));
}).call(this);
