var Json_Doc, genius, _;

_ = lodash;

Json_Doc = (function() {
  function Json_Doc(id) {
    this.id = id;
    this.id = {};
  }

  Json_Doc.prototype.insert_schema = function(json) {
    var index, schema;
    json = json + ".json";
    schema = EJSON.parse(Assets.getText(json));
    index = 0;
    while (index < schema.length) {
      if (schema[index].schema) {
        schema[index] = re.case_obj_s(schema[index], this.id);
      }
      this.id[schema[index].doc_name] = DATA.insert(schema[index]);
      index++;
    }
    console.log("" + json + " inserted");
  };

  Json_Doc.prototype.insert_json = function(json, schema) {
    var a, index, json_obj;
    json = json + ".json";
    json_obj = EJSON.parse(Assets.getText(json));
    index = 0;
    schema = DATA.findOne({
      _id: this.id[schema]
    });
    while (index < json_obj.length) {
      a = re.case_switch(schema.schema, json_obj[index]);
      DATA.insert(a);
      index++;
    }
    console.log("" + json + " inserted");
  };

  Json_Doc.prototype.get_schema_id = function(doc_name) {
    var _this = this;
    if (Object.keys(this.id).length === 0) {
      DATA.find({
        doc_schema: "doc_schema"
      }).forEach(function(doc) {
        _this.id[doc.doc_name] = doc._id;
      });
    }
    if (this.id[doc_name]) {
      return this.id[doc_name];
    } else {
      return console.warn("no schema " + doc_name + " in database");
    }
  };

  return Json_Doc;

})();

DATA.after.insert(function(userid, doc) {
  var a;
  if (doc.doc_schema !== "doc_schema") {
    a = re.case_switch_o(doc);
    _.extend(a, {
      _id: this._id
    });
    ADATA.upsert({
      _id: this._id
    }, a);
    return console.log("" + doc.doc_name + " inserted");
  } else if (doc.doc_schema === "doc_schema") {
    return ADATA.update({
      p_doc_schema: doc.doc_name
    }, {
      $set: {
        p_doc_schema: this._id
      }
    }, {
      multi: true
    });
  }
});

Meteor.methods({
  insert_human: function(array) {
    var doc, index, indy, k, mobj, obj, wow;
    index = 0;
    mobj = {};
    while (index < array.length) {
      indy = 0;
      obj = {};
      while (indy < array[index].length) {
        wow = array[index];
        doc = ADATA.findOne({
          _id: wow[indy].id
        });
        if (doc.object_keys_arr) {
          doc = ADATA.findOne({
            _id: wow[0].value
          });
          wow[0].value = wow[1].value;
          wow.pop();
        }
        k = genius(doc, wow[indy].value);
        obj = merge(obj, k);
        indy++;
      }
      mobj = mergea(mobj, obj);
      index++;
    }
    console.log(mobj);
  }
});

genius = function(doc, value) {
  var k, mobj, obj, parent;
  obj = {};
  mobj = {};
  if (doc.parent === 'root') {
    switch (doc.value_type) {
      case 'object':
        obj[doc.key_name] = value;
        break;
      case 'array':
        if (obj[doc.key_name] === void 0) {
          obj[doc.key_name] = [];
        }
        obj[doc.key_name].push(value);
        break;
      case 'string':
        obj[doc.key_name] = String(value);
        break;
      case 'number':
        obj[doc.key_name] = Number(value);
        break;
      case 'oid':
        obj[doc.key_name] = value;
        break;
      case 'currency':
        obj[doc.key_name] = Number(value) * 100;
        break;
      case 'date':
        obj[doc.key_name] = new Date(value);
    }
  } else {
    switch (doc.value_type) {
      case 'object':
        mobj[doc.key_name] = value;
        break;
      case 'array':
        if (mobj[doc.key_name] === void 0) {
          mobj[doc.key_name] = [];
        }
        mobj[doc.key_name].push(value);
        break;
      case 'string':
        mobj[doc.key_name] = String(value);
        break;
      case 'number':
        mobj[doc.key_name] = Number(value);
        break;
      case 'oid':
        mobj[doc.key_name] = value;
        break;
      case 'currency':
        mobj[doc.key_name] = Number(value) * 100;
        break;
      case 'date':
        mobj[doc.key_name] = new Date(value);
    }
    parent = ADATA.findOne({
      _id: doc.parent
    });
    k = genius(parent, mobj);
    _.merge(obj, k);
  }
  return obj;
};

Meteor.publish("list", function() {
  var b, c, currencies, services, titles;
  b = ADATA.find({
    p_doc_schema: {
      $exists: true
    }
  });
  titles = DATA.findOne({
    doc_schema: "doc_schema",
    doc_name: "titles"
  });
  currencies = DATA.findOne({
    doc_schema: "doc_schema",
    doc_name: "currencies"
  });
  services = DATA.findOne({
    doc_schema: "doc_schema",
    doc_name: "services"
  });
  c = DATA.find({
    $or: [
      {
        doc_schema: "doc_schema"
      }, {
        doc_schema: titles._id
      }, {
        doc_schema: currencies._id
      }, {
        doc_schema: services._id
      }
    ]
  }, {
    fields: {
      doc_schema: 1,
      doc_name: 1,
      "default": 1
    }
  });
  return [b, c];
});

Meteor.publish("cities_list", function(args) {
  var b, d;
  if (args.input) {
    d = new Meteor.Collection.ObjectID(args.field);
    b = DATA.findOne({
      _id: d
    });
    return ADATA.find({
      $and: [
        {
          doc_schema: b.doc_name
        }, {
          $or: [
            {
              doc_name: {
                $regex: args.input,
                $options: 'i'
              }
            }, {
              country: {
                $regex: args.input,
                $options: 'i'
              }
            }
          ]
        }
      ]
    }, {
      limit: 5,
      fields: {
        doc_name: 1,
        country: 1,
        doc_schema: 1
      }
    });
  }
});

Meteor.startup(function() {
  var doc_json;
  doc_json = new Json_Doc();
  if (DATA.find({
    doc_schema: "doc_schema"
  }).count() === 0) {
    DATA.remove({});
  }
  if (DATA.find().count() === 0) {
    doc_json.insert_schema('schema_array');
  }
  if (DATA.find({
    doc_schema: doc_json.get_schema_id('currencies')
  }).count() === 0) {
    doc_json.insert_json('currencies', 'currencies');
  }
  if (DATA.find({
    doc_schema: doc_json.get_schema_id('countries')
  }).count() === 0) {
    doc_json.insert_json('countries', 'countries');
  }
  if (DATA.find({
    doc_schema: doc_json.get_schema_id('titles')
  }).count() === 0) {
    doc_json.insert_json('titles', 'titles');
  }
  if (DATA.find({
    doc_schema: doc_json.get_schema_id('services')
  }).count() === 0) {
    doc_json.insert_json('services', 'services');
  }
  if (DATA.find({
    doc_schema: doc_json.get_schema_id('cities')
  }).count() === 0) {
    return doc_json.insert_json('cities', 'cities');
  }
});
