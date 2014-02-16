var Recursive;

Recursive = (function() {
  function Recursive() {}

  Recursive.prototype.case_switch = function(schema, object) {
    var a, index, key_name, obj, r_value, value_type;
    index = 0;
    r_value = void 0;
    obj = {};
    a = {};
    while (index < schema.length) {
      key_name = schema[index].key_name;
      value_type = schema[index].value_type;
      r_value = this.case_obj(schema[index], object[key_name]);
      if (r_value !== void 0 && r_value.length !== 0) {
        a[key_name] = r_value;
        obj = _.merge(obj, a);
      }
      index++;
    }
    return obj;
  };

  Recursive.prototype.case_obj = function(schema, value) {
    var a, r_value;
    r_value = void 0;
    if (value !== '' && value !== void 0) {
      switch (schema.value_type) {
        case "oid":
          a = DATA.findOne({
            doc_name: value,
            doc_schema: schema.value_schema
          });
          if (a) {
            r_value = a._id;
          } else {
            console.warn("cannot find " + value);
          }
          break;
        case "string":
          r_value = String(value);
          break;
        case "number":
          r_value = Number(value);
          break;
        case "array":
          r_value = this.case_arr(schema.array_values, value);
          break;
        case "object":
          r_value = this.case_switch(schema.object_keys, value);
          break;
        default:
          r_value = value;
      }
    }
    return r_value;
  };

  Recursive.prototype.case_arr = function(schema, value) {
    var a, index, r_index, r_value;
    r_value = [];
    if (value !== void 0 && value.length !== 0) {
      index = 0;
      r_index = 0;
      switch (schema.value_type) {
        case "oid":
          while (index < value.length) {
            if (value[index] !== '' && value[index] !== void 0) {
              a = DATA.findOne({
                doc_name: value[index],
                doc_schema: schema.value_schema
              });
              if (a) {
                r_value[r_index] = a._id;
                r_index++;
              } else {
                console.warn("cannot find " + value[index]);
              }
            }
            index++;
          }
          break;
        case "string":
          while (index < value.length) {
            if (value[index] !== '' && value[index] !== void 0) {
              r_value[r_index] = String(value[index]);
              r_index++;
            }
            index++;
          }
          break;
        case "number":
          while (index < value.length) {
            if (value[index] !== '' && value[index] !== void 0) {
              r_value[r_index] = Number(value[index]);
              r_index++;
            }
            index++;
          }
          break;
        case "array":
          this.case_arr(schema.array_values, value);
          break;
        case "object":
          while (index < value.length) {
            r_value[index] = this.case_switch(schema.object_keys, value[index]);
            index++;
          }
          break;
        default:
          r_value = value;
      }
    }
    return r_value;
  };

  Recursive.prototype.case_obj_s = function(schema, id, pid) {
    var asche, index, obj_doc, sche, sid;
    if (schema.schema) {
      this.s_name = schema.doc_name;
    }
    sche = schema.schema || schema;
    index = 0;
    while (index < sche.length) {
      sid = ADATA.insert({
        a: "a"
      });
      if (sche[index].value_type === "array") {
        if (sche[index].array_values.value_type === "object") {
          sche[index].array_values.object_keys = this.case_obj_s(sche[index].array_values.object_keys, id, sid);
        } else {
          if (sche[index].array_values.value_schema !== "doc_schema" && sche[index].array_values.value_schema !== void 0) {
            sche[index].array_values.value_schema = id[sche[index].array_values.value_schema];
          }
        }
      } else {
        if (sche[index].value_schema !== "doc_schema" && sche[index].value_schema !== void 0) {
          sche[index].value_schema = id[sche[index].value_schema];
        }
      }
      if (sche[index].value_type === "object") {
        sche[index].object_keys = this.case_obj_s(sche[index].object_keys, id, sid);
      }
      obj_doc = {
        p_doc_schema: this.s_name,
        doc_schema: "schema_piece",
        parent: pid || "root"
      };
      asche = _.merge(obj_doc, sche[index]);
      delete asche.object_keys;
      if (asche.array_values) {
        delete asche.array_values.object_keys;
      }
      ADATA.update({
        _id: sid
      }, asche);
      sche[index] = _.merge(sche[index], {
        _sid: sid
      });
      index++;
    }
    if (schema.schema) {
      schema.schema = sche;
    } else {
      schema = sche;
    }
    return schema;
  };

  Recursive.prototype.case_switch_o = function(object, schema) {
    var a, index, key_name, obj, r_value, sche, value_type;
    if (!schema) {
      sche = DATA.findOne({
        _id: object.doc_schema
      });
      schema = sche.schema;
    }
    index = 0;
    r_value = void 0;
    obj = {};
    a = {};
    while (index < schema.length) {
      key_name = schema[index].key_name;
      value_type = schema[index].value_type;
      r_value = this.case_obj_o(schema[index], object[key_name]);
      if (r_value !== void 0 && r_value.length !== 0) {
        a[key_name] = r_value;
        obj = _.merge(obj, a);
      }
      index++;
    }
    return obj;
  };

  Recursive.prototype.case_obj_o = function(schema, value) {
    var a, r_value;
    r_value = void 0;
    if (value !== '' && value !== void 0) {
      switch (schema.value_type) {
        case "oid":
          if (schema.key_name !== "doc_schema") {
            a = DATA.findOne({
              _id: value
            });
            r_value = a.doc_name;
          } else {
            r_value = value;
          }
          break;
        case "email":
          r_value = value;
          break;
        case "string":
          r_value = value;
          break;
        case "phone":
          r_value = formatInternational(countryForE164Number(value), value);
          break;
        case "date":
          r_value = value.toDateString();
          break;
        case "number":
          r_value = value;
          break;
        case "currency":
          r_value = value / 100;
          break;
        case "array":
          r_value = this.case_arr_o(schema.array_values, value);
          break;
        case "object":
          r_value = this.case_switch_o(value, schema.object_keys);
      }
    }
    return r_value;
  };

  Recursive.prototype.case_arr_o = function(schema, value) {
    var a, index, r_index, r_value;
    r_value = [];
    if (value !== void 0 && value.length !== 0) {
      index = 0;
      r_index = 0;
      switch (schema.value_type) {
        case "oid":
          while (index < value.length) {
            if (value[index] !== '' && value[index] !== void 0) {
              a = DATA.findOne({
                _id: value[index]
              });
              if (a) {
                r_value[r_index] = a.doc_name;
                r_index++;
              } else {
                console.warn("cannot find " + value[index]);
              }
            }
            index++;
          }
          break;
        case "string":
          r_value = value;
          break;
        case "email":
          r_value = value;
          break;
        case "phone":
          while (index < value.length) {
            r_value[index] = formatInternational(countryForE164Number(value[index]), value[index]);
            index++;
          }
          break;
        case "number":
          r_value = value;
          break;
        case "currency":
          while (index < value.length) {
            r_value[index] = value[index] / 100;
            index++;
          }
          break;
        case "date":
          while (index < value.length) {
            r_value[index] = value[index].toDateString();
            index++;
          }
          break;
        case "array":
          this.case_arr_o(schema.array_values, value);
          break;
        case "object":
          while (index < value.length) {
            r_value[index] = this.case_switch_o(value[index], schema.object_keys);
            index++;
          }
      }
    }
    return r_value;
  };

  Recursive.prototype.write_case_switch = function(schema, object) {
    var a, index, key_name, obj, r_value, value_type;
    index = 0;
    r_value = void 0;
    obj = {};
    a = {};
    while (index < schema.length) {
      key_name = schema[index].key_name;
      value_type = schema[index].value_type;
      r_value = this.write_case_obj(schema[index], object[key_name]);
      if (r_value !== void 0 && r_value.length !== 0) {
        a[key_name] = r_value;
        obj = _.merge(obj, a);
      }
      index++;
    }
    return obj;
  };

  Recursive.prototype.write_case_obj = function(schema, value) {
    var a, r_value;
    r_value = void 0;
    if (value !== '' && value !== void 0) {
      switch (schema.value_type) {
        case "oid":
          a = DATA.findOne({
            _id: value
          });
          if (a) {
            r_value = a.doc_name;
          } else {
            console.warn("cannot find " + value);
          }
          break;
        case "array":
          r_value = this.write_case_arr(schema.array_values, value);
          break;
        case "object":
          r_value = this.write_case_switch(schema.object_keys, value);
          break;
        default:
          r_value = value;
      }
    }
    return r_value;
  };

  Recursive.prototype.write_case_arr = function(schema, value) {
    var a, index, r_index, r_value;
    r_value = [];
    if (value !== void 0 && value.length !== 0) {
      index = 0;
      r_index = 0;
      switch (schema.value_type) {
        case "oid":
          while (index < value.length) {
            if (value[index] !== '' && value[index] !== void 0) {
              a = DATA.findOne({
                _id: value[index]
              });
              if (a) {
                r_value[r_index] = a.doc_name;
                r_index++;
              } else {
                console.warn("cannot find " + value[index]);
              }
            }
            index++;
          }
          break;
        case "array":
          this.write_case_arr(schema.array_values, value);
          break;
        case "object":
          while (index < value.length) {
            r_value[index] = this.write_case_switch(schema.object_keys, value[index]);
            index++;
          }
          break;
        default:
          r_value = value;
      }
    }
    return r_value;
  };

  return Recursive;

})();

re = new Recursive();
