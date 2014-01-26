var Json_Doc, _;

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
      this.id[schema[index].document_name] = DATA.insert(schema[index]);
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
        document_schema: "document_schema"
      }).forEach(function(doc) {
        _this.id[doc.document_name] = doc._id;
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
  if (doc.document_schema !== "document_schema") {
    a = re.case_switch_o(doc);
    _.extend(a, {
      _id: this._id
    });
    ADATA.upsert({
      _id: this._id
    }, a);
    return console.log("" + doc.document_name + " inserted");
  }
});

Meteor.startup(function() {
  var document_json;
  document_json = new Json_Doc();
  if (DATA.find({
    document_schema: "document_schema"
  }).count() === 0) {
    DATA.remove({});
  }
  if (DATA.find().count() === 0) {
    document_json.insert_schema('schema_array');
  }
  if (DATA.find({
    document_schema: document_json.get_schema_id('currencies')
  }).count() === 0) {
    document_json.insert_json('currencies', 'currencies');
  }
  if (DATA.find({
    document_schema: document_json.get_schema_id('countries')
  }).count() === 0) {
    document_json.insert_json('countries', 'countries');
  }
  if (DATA.find({
    document_schema: document_json.get_schema_id('titles')
  }).count() === 0) {
    document_json.insert_json('titles', 'titles');
  }
  if (DATA.find({
    document_schema: document_json.get_schema_id('services')
  }).count() === 0) {
    return document_json.insert_json('services', 'services');
  }
});
