var HUMAN_FORM, ojts;

HUMAN_FORM = new Meteor.Collection(null, {
  idGeneration: "MONGO"
});

Deps.autorun(function() {
  var human, sub_list;
  if (Meteor.user()) {
    sub_list = Meteor.subscribe("list");
    if (sub_list.ready()) {
      console.log("hello");
      HUMAN_FORM.remove({});
      human = DATA.findOne({
        doc_name: "humans",
        doc_schema: "doc_schema"
      });
      ADATA.find({
        p_doc_schema: human._id,
        input_starting: true
      }).map(function(doc) {
        doc._sid = doc._id;
        delete doc._id;
        return HUMAN_FORM.insert({
          form_element: [doc],
          _sid: doc._sid,
          input_size: doc.input_size,
          input_starting: true
        });
      });
    }
  } else {
    if (sub_list) {
      sub_list.stop();
    }
  }
});

Template.layout.helpers({
  dyield: function() {
    var a, b, c;
    a = Session.get("targ");
    if (!a) {
      b = window.location.pathname;
      c = b.split("/");
      Session.set("targ", c[1]);
    }
    if (Template[a]) {
      return Template[a];
    } else {
      return Template.sorry_man;
    }
  }
});

Template.login.helpers({
  creatingAccount: function() {
    return Session.get("creatingAccount");
  }
});

Template.login.events({
  'click #loginform': function(e, t) {
    return Session.set('creatingAccount', false);
  },
  'click #accountform': function(e, t) {
    return Session.set('creatingAccount', true);
  },
  'click #createaccount': function(e, t) {
    Session.set('creatingAccount', false);
    return Accounts.createUser({
      username: t.find('#username').value,
      password: t.find('#password').value,
      email: t.find('#email').value,
      profile: {
        name: t.find('#name').value
      }
    });
  },
  'click #logout': function(e, t) {
    return Meteor.logout();
  },
  'click #login': function(e, t) {
    return Meteor.loginWithPassword(t.find('#username').value, t.find('#password').value);
  }
});

UI.body.events({
  'click a[href^="/"]': function(e, t) {
    var a, b;
    e.preventDefault();
    a = e.currentTarget.pathname;
    b = a.split('/');
    Session.set("targ", b[1]);
    window.history.pushState("", "", a);
  },
  'mouseover .has-dropdown': function(e, t) {
    return $(e.currentTarget).find(".dropdown").show();
  },
  'mouseleave .has-dropdown': function(e, t) {
    return $(e.currentTarget).find(".dropdown").hide();
  },
  'mouseover .dropdown': function(e, t) {
    return $(e.currentTarget).show();
  },
  'mouseleave .dropdown': function(e, t) {
    return $(e.currentTarget).hide();
  },
  'click #logout': function(e, t) {
    return Meteor.logout();
  }
});

Template.add_contact.events({
  'click .click-input': function(e, t) {
    var id, obj, t_id;
    t_id = e.currentTarget.dataset.id;
    id = new Meteor.Collection.ObjectID(t_id);
    obj = ADATA.findOne({
      _id: id
    });
    if ((ADATA.find({
      parent: obj._id
    }).count() === 0) || obj.object_keys_arr) {
      obj._sid = obj._id;
      delete obj._id;
      if (obj.array) {
        return HUMAN_FORM.insert({
          form_element: [obj],
          _sid: obj._sid,
          input_size: obj.input_size
        });
      } else {
        if (HUMAN_FORM.findOne({
          _sid: obj._sid
        })) {
          return HUMAN_FORM.remove({
            _sid: obj._sid
          });
        } else {
          return HUMAN_FORM.insert({
            form_element: [obj],
            _sid: obj._sid,
            input_size: obj.input_size
          });
        }
      }
    } else {
      obj = ojts(obj._id);
      return HUMAN_FORM.insert(obj);
    }
  },
  'click .contact_form .close_input': function(e, t) {
    var id;
    id = new Meteor.Collection.ObjectID(e.currentTarget.dataset.id);
    return HUMAN_FORM.remove({
      _id: id
    });
  },
  'keypress .contact_form': function(e, t) {
    if (e.which === 13) {
      return e.preventDefault();
    }
  },
  'blur .contact_form input[name=mobile]': function(e, t) {
    var a, small;
    small = $(e.currentTarget).next();
    if (e.currentTarget.dataset.value === "" || e.currentTarget.dataset.value === void 0) {
      e.currentTarget.value = "";
      small.html("invalid. try inserting country code");
      small.hide();
    } else {
      a = formatInternational(e.currentTarget.dataset.country, e.currentTarget.dataset.value);
      e.currentTarget.value = e.currentTarget.dataset.value;
      small.hide();
    }
  },
  'keyup .contact_form input[name=mobile]': function(e, t) {
    var countryCode, e164, e164_1, inter, inter_1, number, small, sub;
    small = $(e.currentTarget).next();
    small.show();
    number = e.currentTarget.value;
    e164 = formatE164("TH", number);
    if (isValidNumber(e164, "TH")) {
      inter = formatInternational("TH", e164);
      small.html("" + inter + " valid!");
      small.removeClass("warning").addClass("success");
      e.currentTarget.dataset.value = e164;
      e.currentTarget.dataset.country = "TH";
    } else {
      if (number.length >= 2) {
        if (number.substring(0, 1) === "+") {
          if (number.length >= 3) {
            sub = number.substring(1, 2);
          }
        } else {
          sub = number.substring(0, 2);
        }
        countryCode = DATA.findOne({
          callingCode: sub
        });
        if (countryCode) {
          e164_1 = formatE164(countryCode.cca2, number);
          if (isValidNumber(e164_1, countryCode.cca2)) {
            inter_1 = formatInternational(countryCode.cca2, e164_1);
            small.html("" + inter_1 + " valid!");
            small.removeClass("warning").addClass("success");
            e.currentTarget.dataset.value = e164_1;
            e.currentTarget.dataset.country = countryCode.cca2;
          } else {
            small.html("invalid. try inserting country code");
            small.removeClass("success").addClass("warning");
            e.currentTarget.dataset.value = "";
            e.currentTarget.dataset.country = "";
          }
        } else {
          small.html("invalid. try inserting country code");
          small.removeClass("success").addClass("warning");
          e.currentTarget.dataset.value = "";
          e.currentTarget.dataset.country = "";
        }
      } else {
        small.html("invalid. try inserting country code");
        small.removeClass("success").addClass("warning");
        e.currentTarget.dataset.value = "";
        e.currentTarget.dataset.country = "";
      }
    }
  },
  'click .contact_form .form_submit': function(e, t) {
    var arr, barr, id, index, index_p, input, oid, parentdiv, value;
    arr = [];
    index_p = 0;
    parentdiv = t.findAll('.parentdiv');
    while (index_p < parentdiv.length) {
      barr = [];
      index = 0;
      input = $(parentdiv[index_p]).find(':input');
      while (index < input.length) {
        id = new Meteor.Collection.ObjectID(input[index].dataset.sid);
        if (input[index].localName === 'select') {
          value = new Meteor.Collection.ObjectID(input[index].value);
        } else {
          value = input[index].value;
        }
        barr[index] = {
          id: id,
          value: value
        };
        index++;
      }
      oid = new Meteor.Collection.ObjectID(parentdiv[index_p].dataset.sid);
      arr[index_p] = {
        arr: barr,
        id: oid
      };
      index_p++;
    }
    return console.log(arr);
  }
});

Template.add_contact.helpers({
  schema: function() {
    var human;
    human = DATA.findOne({
      doc_name: "humans",
      doc_schema: "doc_schema"
    });
    if (human) {
      return ADATA.find({
        p_doc_schema: human._id,
        button_name: {
          $exists: true
        }
      });
    }
  },
  input_element: function() {
    return HUMAN_FORM.find();
  },
  select_options: function(id) {
    var piece;
    piece = ADATA.findOne({
      _id: id
    });
    return DATA.find({
      doc_schema: piece.value_schema
    });
  },
  select_options_arr: function(id) {
    return ADATA.find({
      parent: id
    }).fetch();
  }
});

ojts = function(id) {
  var arr, input_size, obj;
  arr = [];
  input_size = 0;
  ADATA.find({
    parent: id
  }).forEach(function(doc) {
    if (ADATA.find({
      parent: doc._id
    }).count() === 0) {
      doc._sid = doc._id;
      delete doc._id;
      input_size = input_size + doc.input_size;
      return arr.push(doc);
    }
  });
  obj = {
    form_element: arr,
    _sid: id,
    input_size: input_size
  };
  return obj;
};
