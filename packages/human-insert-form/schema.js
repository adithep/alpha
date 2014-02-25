(function() {
  Template.__define__("__display_humans", (function() {
    var self, template;
    self = this;
    template = this;
    return [
      UI.If(function() {
        return Spacebars.call(Spacebars.dot(self.lookup("."), "full_name"));
      }, UI.block(function() {
        self = this;
        return [
          HTML.BR(), HTML.P({
            "data-path": "full_name"
          }, "Full Name"), UI.If(function() {
            return Spacebars.call(Spacebars.dot(self.lookup("."), "full_name", "titles"));
          }, UI.block(function() {
            self = this;
            return [
              HTML.BR(), HTML.P({
                "data-path": "full_name.titles"
              }, "Titles: ", function() {
                return Spacebars.mustache(Spacebars.dot(self.lookup("."), "full_name", "titles"));
              })
            ];
          })), UI.If(function() {
            return Spacebars.call(Spacebars.dot(self.lookup("."), "full_name", "first_name"));
          }, UI.block(function() {
            self = this;
            return [
              HTML.BR(), HTML.P({
                "data-path": "full_name.first_name"
              }, "First Name: ", function() {
                return Spacebars.mustache(Spacebars.dot(self.lookup("."), "full_name", "first_name"));
              })
            ];
          })), UI.If(function() {
            return Spacebars.call(Spacebars.dot(self.lookup("."), "full_name", "middle_name"));
          }, UI.block(function() {
            self = this;
            return [
              HTML.BR(), HTML.P({
                "data-path": "full_name.middle_name"
              }, "Middle Name: ", function() {
                return Spacebars.mustache(Spacebars.dot(self.lookup("."), "full_name", "middle_name"));
              })
            ];
          })), UI.If(function() {
            return Spacebars.call(Spacebars.dot(self.lookup("."), "full_name", "last_name"));
          }, UI.block(function() {
            self = this;
            return [
              HTML.BR(), HTML.P({
                "data-path": "full_name.last_name"
              }, "Last Name: ", function() {
                return Spacebars.mustache(Spacebars.dot(self.lookup("."), "full_name", "last_name"));
              })
            ];
          }))
        ];
      })), UI.If(function() {
        return Spacebars.call(Spacebars.dot(self.lookup("."), "email"));
      }, UI.block(function() {
        self = this;
        return [
          HTML.BR(), HTML.P({
            "data-path": "email"
          }, "Email"), UI.If(function() {
            return Spacebars.call(Spacebars.dot(self.lookup("."), "email", "main"));
          }, UI.block(function() {
            self = this;
            return [
              HTML.BR(), HTML.P({
                "data-path": "email.main"
              }, "Main: "), " ", HTML.UL(" ", UI.Eacha(function() {
                return Spacebars.call(Spacebars.dot(self.lookup("."), "email", "main"));
              }, UI.block(function() {
                self = this;
                return ["\n  ", Spacebars.include(self.lookupTemplate("__display_emails")), "\n  "];
              }))), " "
            ];
          })), UI.If(function() {
            return Spacebars.call(Spacebars.dot(self.lookup("."), "email", "personal"));
          }, UI.block(function() {
            self = this;
            return [
              HTML.BR(), HTML.P({
                "data-path": "email.personal"
              }, "Personal: "), " ", HTML.UL(" ", UI.Eacha(function() {
                return Spacebars.call(Spacebars.dot(self.lookup("."), "email", "personal"));
              }, UI.block(function() {
                self = this;
                return [
                  " ", HTML.LI({
                    "class": "meme"
                  }, " ", function() {
                    return Spacebars.mustache(self.lookup("."));
                  }, " ")
                ];
              }))), " "
            ];
          })), UI.If(function() {
            return Spacebars.call(Spacebars.dot(self.lookup("."), "email", "work"));
          }, UI.block(function() {
            self = this;
            return [
              HTML.BR(), HTML.P({
                "data-path": "email.work"
              }, "Work: "), " ", HTML.UL(" ", UI.Eacha(function() {
                return Spacebars.call(Spacebars.dot(self.lookup("."), "email", "work"));
              }, UI.block(function() {
                self = this;
                return [
                  " ", HTML.LI({
                    "class": "meme"
                  }, " ", function() {
                    return Spacebars.mustache(self.lookup("."));
                  }, " ")
                ];
              }))), " "
            ];
          }))
        ];
      })), UI.If(function() {
        return Spacebars.call(Spacebars.dot(self.lookup("."), "mobile"));
      }, UI.block(function() {
        self = this;
        return [
          HTML.BR(), HTML.P({
            "data-path": "mobile"
          }, "Mobile"), UI.If(function() {
            return Spacebars.call(Spacebars.dot(self.lookup("."), "mobile", "main"));
          }, UI.block(function() {
            self = this;
            return [
              HTML.BR(), HTML.P({
                "data-path": "mobile.main"
              }, "Main: "), " ", HTML.UL(" ", UI.Eacha(function() {
                return Spacebars.call(Spacebars.dot(self.lookup("."), "mobile", "main"));
              }, UI.block(function() {
                self = this;
                return [
                  " ", HTML.LI({
                    "class": "meme"
                  }, " ", function() {
                    return Spacebars.mustache(self.lookup("."));
                  }, " ")
                ];
              }))), " "
            ];
          })), UI.If(function() {
            return Spacebars.call(Spacebars.dot(self.lookup("."), "mobile", "personal"));
          }, UI.block(function() {
            self = this;
            return [
              HTML.BR(), HTML.P({
                "data-path": "mobile.personal"
              }, "Personal: "), " ", HTML.UL(" ", UI.Eacha(function() {
                return Spacebars.call(Spacebars.dot(self.lookup("."), "mobile", "personal"));
              }, UI.block(function() {
                self = this;
                return [
                  " ", HTML.LI({
                    "class": "meme"
                  }, " ", function() {
                    return Spacebars.mustache(self.lookup("."));
                  }, " ")
                ];
              }))), " "
            ];
          })), UI.If(function() {
            return Spacebars.call(Spacebars.dot(self.lookup("."), "mobile", "work"));
          }, UI.block(function() {
            self = this;
            return [
              HTML.BR(), HTML.P({
                "data-path": "mobile.work"
              }, "Work: "), " ", HTML.UL(" ", UI.Eacha(function() {
                return Spacebars.call(Spacebars.dot(self.lookup("."), "mobile", "work"));
              }, UI.block(function() {
                self = this;
                return [
                  " ", HTML.LI({
                    "class": "meme"
                  }, " ", function() {
                    return Spacebars.mustache(self.lookup("."));
                  }, " ")
                ];
              }))), " "
            ];
          }))
        ];
      })), UI.If(function() {
        return Spacebars.call(Spacebars.dot(self.lookup("."), "service"));
      }, UI.block(function() {
        self = this;
        return [
          HTML.BR(), HTML.P({
            "data-path": "service"
          }, "Service:"), " ", UI.Eacha(function() {
            return Spacebars.call(Spacebars.dot(self.lookup("."), "service"));
          }, UI.block(function() {
            self = this;
            return [
              UI.If(function() {
                return Spacebars.call(Spacebars.dot(self.lookup("."), "date_of_entry"));
              }, UI.block(function() {
                self = this;
                return [
                  HTML.BR(), HTML.P({
                    "data-path": "date_of_entry"
                  }, "Date: ", function() {
                    return Spacebars.mustache(Spacebars.dot(self.lookup("."), "date_of_entry"));
                  })
                ];
              })), UI.If(function() {
                return Spacebars.call(Spacebars.dot(self.lookup("."), "service"));
              }, UI.block(function() {
                self = this;
                return [
                  HTML.BR(), HTML.P({
                    "data-path": "service"
                  }, "Service: ", function() {
                    return Spacebars.mustache(Spacebars.dot(self.lookup("."), "service"));
                  })
                ];
              })), UI.If(function() {
                return Spacebars.call(Spacebars.dot(self.lookup("."), "currency"));
              }, UI.block(function() {
                self = this;
                return [
                  HTML.BR(), HTML.P({
                    "data-path": "currency"
                  }, "Currecny: ", function() {
                    return Spacebars.mustache(Spacebars.dot(self.lookup("."), "currency"));
                  })
                ];
              })), UI.If(function() {
                return Spacebars.call(Spacebars.dot(self.lookup("."), "cost"));
              }, UI.block(function() {
                self = this;
                return [
                  HTML.BR(), HTML.P({
                    "data-path": "cost"
                  }, "Cost: ", function() {
                    return Spacebars.mustache(Spacebars.dot(self.lookup("."), "cost"));
                  })
                ];
              }))
            ];
          }))
        ];
      })), UI.If(function() {
        return Spacebars.call(Spacebars.dot(self.lookup("."), "date_of_birth"));
      }, UI.block(function() {
        self = this;
        return [
          HTML.BR(), HTML.P({
            "data-path": "date_of_birth"
          }, "Date of Birth: ", function() {
            return Spacebars.mustache(Spacebars.dot(self.lookup("."), "date_of_birth"));
          })
        ];
      })), UI.If(function() {
        return Spacebars.call(Spacebars.dot(self.lookup("."), "city"));
      }, UI.block(function() {
        self = this;
        return [
          HTML.BR(), HTML.P({
            "data-path": "city"
          }, "City: ", function() {
            return Spacebars.mustache(Spacebars.dot(self.lookup("."), "city"));
          })
        ];
      }))
    ];
  }));
  Template.__define__("__display_emails", (function() {
    var self, template;
    self = this;
    template = this;
    return UI.block(function() {
      self = this;
      return [
        HTML.LI({
          "class": "meme"
        }, " ", function() {
          return Spacebars.mustache(self.lookup(self.lookup(".")));
        }, " ")
      ];
    });
  }));
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
