var CITIES, HUMAN_FORM, ojts, pargs;

HUMAN_FORM = new Meteor.Collection(null, {
  idGeneration: "MONGO"
});

CITIES = new Meteor.Collection(null, {
  idGeneration: "MONGO"
});

pargs = {};

pargs.session = false;

Deps.autorun(function() {
  var human;
  if (subscription.sub_list.ready() && subscription.sub_sche.ready()) {
    console.log("hello");
    HUMAN_FORM.remove({});
    human = DATA.findOne({
      doc_name: "humans",
      doc_schema: "doc_schema"
    });
    return ADATA.find({
      p_doc_schema: human._id,
      input_starting: true
    }, {
      sort: {
        input_starting_sort: 1
      }
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
});

Template.add_contact.events({
  'click .save_human_json': function(e, t) {
    return Meteor.call("save_human_json");
  },
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
    var arr, barr, id, index, index_p, input, parentdiv, value;
    arr = [];
    index_p = 0;
    parentdiv = t.findAll('.parentdiv');
    while (index_p < parentdiv.length) {
      barr = [];
      index = 0;
      input = $(parentdiv[index_p]).find(':input');
      while (index < input.length) {
        value = void 0;
        id = new Meteor.Collection.ObjectID(input[index].dataset.sid);
        if (input[index].localName === 'select') {
          if (input[index].value !== "" && input[index].value !== void 0) {
            value = new Meteor.Collection.ObjectID(input[index].value);
          }
        } else if ($(input[index]).hasClass('input_select')) {
          if (input[index].dataset.value !== "" && input[index].dataset.value !== void 0) {
            value = new Meteor.Collection.ObjectID(input[index].dataset.value);
          }
        } else {
          value = input[index].value;
        }
        if (value !== "" && value !== void 0) {
          barr[index] = {
            id: id,
            value: value
          };
          index++;
        } else {
          input.splice(index, 1);
        }
      }
      if (barr.length > 0) {
        arr[index_p] = barr;
        index_p++;
      } else {
        parentdiv.splice(index_p, 1);
      }
    }
    console.log(arr);
    return Meteor.call("insert_human", arr);
  },
  'focus .contact_form .input_select': function(e, t) {
    if (e.currentTarget.value === "") {
      return $('.input_select_box').hide();
    } else {
      return $('.input_select_box').show();
    }
  },
  'blur .contact_form .input_select': function(e, t) {
    if (e.currentTarget.value !== "") {
      if ($('.blue_color').html()) {
        e.currentTarget.value = $('.blue_color').html();
        e.currentTarget.dataset.value = $('.blue_color').data('value');
      }
      if (e.currentTarget.dataset.value === "") {
        e.currentTarget.value = "";
      }
    } else {
      e.currentTarget.value = "";
      e.currentTarget.dataset.value = "";
    }
    $('.input_select_box').hide();
  },
  'mouseover .contact_form .lala_item': function(e, t) {
    var b;
    $('.lala_item').removeClass('blue_color');
    $(e.target).addClass('blue_color');
    b = $(e.target).html();
    return $('.input_select').val(b);
  },
  'click .contact_form .input_select': function(e, t) {
    var params, subs;
    if (e.currentTarget.value !== "") {
      $('.input_select_box').show();
      params = {
        input: e.currentTarget.value,
        field: e.currentTarget.dataset.schema
      };
      subs = Meteor.subscribe("cities_list", params);
      if (pargs.session) {
        pargs.session.stop();
      }
      pargs.session = subs;
    }
  },
  'keyup .contact_form .input_select': function(e, t) {
    var b, d, params;
    if (e.which === 40) {
      if ($('.lala_item').hasClass("blue_color") === false) {
        $('.input_select_list li:first-child').addClass("blue_color");
      } else {
        $(".blue_color").removeClass("blue_color").next().addClass("blue_color");
      }
      b = $(".blue_color").html();
      if (b) {
        e.currentTarget.value = b;
      }
    } else if (e.which === 38) {
      if ($('.lala_item').hasClass("blue_color") === false) {
        $('.input_select_list li:first-child').addClass("blue_color");
      } else {
        $(".blue_color").removeClass("blue_color").prev().addClass("blue_color");
      }
      b = $(".blue_color").html();
      if (b) {
        e.currentTarget.value = b;
      }
    } else if (e.which === 13) {
      if ($('.lala_item').hasClass("blue_color")) {
        d = $(".blue_color").html();
        if (d) {
          e.currentTarget.value = d;
          e.currentTarget.dataset.value = $('.blue_color').data('value');
        }
      }
      $('.input_select_box').hide();
      if (pargs.session) {
        return pargs.session.stop();
      }
    } else if (e.which === 27) {
      e.currentTarget.value = "";
      e.currentTarget.dataset.value = "";
      $('.input_select_box').hide();
      if (pargs.session) {
        return pargs.session.stop();
      }
    } else {
      if (e.currentTarget.value === "") {
        $('.input_select_box').hide();
      } else {
        $('.input_select_box').show();
      }
      if (e.currentTarget.value !== "") {
        params = {
          input: e.currentTarget.value,
          field: e.currentTarget.dataset.schema
        };
        Meteor.subscribe("cities_list", params, function() {
          var a;
          d = new Meteor.Collection.ObjectID(e.currentTarget.dataset.schema);
          a = ADATA.find({
            $and: [
              {
                doc_schema: d
              }, {
                $or: [
                  {
                    doc_name: {
                      $regex: params.input,
                      $options: 'i'
                    }
                  }, {
                    country: {
                      $regex: params.input,
                      $options: 'i'
                    }
                  }
                ]
              }
            ]
          }, {
            limit: 5
          }).fetch();
          if (a) {
            console.log(a);
            a[0].e_class = "blue_color";
            CITIES.remove({});
            return _.map(a, function(obj) {
              return CITIES.insert(obj);
            });
          }
        });
      }
    }
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
  input_select_helper: function() {
    return CITIES.find();
  },
  select_options: function(id) {
    var piece;
    piece = ADATA.findOne({
      _id: id
    });
    return ADATA.find({
      doc_schema: piece.value_schema
    });
  },
  select_options_arr: function(id) {
    return ADATA.find({
      parent: id
    }).fetch();
  }
});

Template.display_humans.helpers({
  humans: function() {
    var human;
    human = DATA.findOne({
      doc_name: "humans",
      doc_schema: "doc_schema"
    });
    if (human) {
      return ADATA.find({
        doc_schema: human._id
      });
    }
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
