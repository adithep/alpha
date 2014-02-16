var Json_Doc, fs, genius, htmlobj, path, stream, _;

Accounts.validateNewUser(function() {
  return true;
});

fs = Npm.require('fs');

path = Npm.require('path');

stream = Npm.require('stream');

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
    if (doc.doc_name) {
      return console.log("" + doc.doc_name + " inserted");
    } else {
      return console.log("document inserted");
    }
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

DATA.before.insert(function(userid, doc) {
  var a;
  if (userid) {
    a = {
      created: {
        user: userid,
        date: new Date()
      }
    };
    _.extend(doc, a);
    console.log(doc);
    return doc;
  }
});

Meteor.methods({
  insert_human: function(array) {
    var doc, human_schema, index, indy, k, mobj, obj, wow;
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
    human_schema = DATA.findOne({
      doc_schema: "doc_schema",
      doc_name: "humans"
    });
    mobj.doc_schema = human_schema._id;
    DATA.insert(mobj);
  },
  save_human_json: function() {
    var count, human_schema, writeStream;
    human_schema = DATA.findOne({
      doc_name: "humans",
      doc_schema: "doc_schema"
    });
    writeStream = fs.createWriteStream('../../../../../../json/humans.json', {
      flags: 'w'
    });
    writeStream.write("[");
    count = DATA.find({
      doc_schema: human_schema._id
    }, {
      fields: {
        _id: 0
      }
    }).count() - 1;
    console.log(count);
    DATA.find({
      doc_schema: human_schema._id
    }, {
      fields: {
        _id: 0
      }
    }).forEach(function(doc, index) {
      var lines;
      lines = re.write_case_switch(human_schema.schema, doc);
      console.log(lines);
      writeStream.write(EJSON.stringify(lines, {
        indent: true
      }));
      console.log(index);
      if (index !== count) {
        return writeStream.write(",");
      }
    });
    writeStream.write("]");
    return console.log("human.json written");
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
  var cities_arr, currencies, humans, services, titles;
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
  humans = DATA.findOne({
    doc_schema: "doc_schema",
    doc_name: "humans"
  });
  cities_arr = DATA.distinct("city", {
    doc_schema: humans._id
  });
  return ADATA.find({
    $or: [
      {
        doc_schema: titles._id
      }, {
        _id: {
          $in: cities_arr
        }
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
      "default": 1,
      country: 1
    }
  });
});

Meteor.publish("humans", function() {
  var humans;
  humans = DATA.findOne({
    doc_schema: "doc_schema",
    doc_name: "humans"
  });
  return ADATA.find({
    doc_schema: humans._id
  });
});

Meteor.publish("schema", function() {
  var b, c;
  b = ADATA.find({
    p_doc_schema: {
      $exists: true
    }
  });
  c = DATA.find({
    doc_schema: "doc_schema"
  });
  return [b, c];
});

Meteor.publish("cities_list", function(args) {
  var d;
  if (args.input) {
    d = new Meteor.Collection.ObjectID(args.field);
    return ADATA.find({
      $and: [
        {
          doc_schema: d
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

htmlobj = function(schema, html, path) {
  var ht, index, p;
  index = 0;
  ht = html;
  while (index < schema.length) {
    if (path) {
      p = path + "." + schema[index].key_name;
    } else {
      p = schema[index].key_name;
    }
    switch (schema[index].value_type) {
      case "object":
        if (schema[index].placeholder) {
          ht = ht + ("<br><p>" + schema[index].placeholder + "</p>");
        }
        ht = htmlobj(schema[index].object_keys, ht, p);
        break;
      case "array":
        if (schema[index].array_values.value_type === "object") {
          ht = ht + ("<br><p>" + schema[index].placeholder + ":</p> {{#each this." + p + "}}");
          ht = htmlobj(schema[index].array_values.object_keys, ht);
          ht = ht + "{{/each}}";
        } else {
          if (schema[index].placeholder) {
            ht = ht + ("<br><p>" + schema[index].placeholder + ": </p> <ul> {{#each this." + p + "}} <li> {{this}} </li>{{/each}}</ul> ");
          }
        }
        break;
      default:
        if (schema[index].placeholder) {
          ht = ht + ("<br><p>" + schema[index].placeholder + ": {{this.") + p + "}}</p>";
        }
    }
    index++;
  }
  return ht;
};

Meteor.startup(function() {
  var Html, doc_json, html, human_schema;
  doc_json = new Json_Doc();
  if (DATA.find({
    doc_schema: "doc_schema"
  }).count() === 0) {
    DATA.remove({});
    fs.unlink('../../../../../../packages/core-layout/schema.html');
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
    doc_json.insert_json('cities', 'cities');
  }
  if (DATA.find({
    doc_schema: doc_json.get_schema_id('humans')
  }).count() === 0) {
    doc_json.insert_json('humans', 'humans');
  }
  if (fs.existsSync('../../../../../../packages/core-layout/schema.html')) {
    html = fs.readFileSync('../../../../../../packages/core-layout/schema.html', 'utf8');
    return console.log(html);
  } else {
    human_schema = DATA.findOne({
      doc_name: "humans",
      doc_schema: "doc_schema"
    });
    html = "<template name='display_humans'> {{#each humans}}";
    Html = htmlobj(human_schema.schema, html);
    Html = Html + "{{/each}}</template>";
    return fs.writeFileSync('../../../../../../packages/core-layout/schema.html', Html);
  }
});
