var Json_Doc;

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
      doc_name: 1
    }
  });
  return [b, c];
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
    return doc_json.insert_json('services', 'services');
  }
});
