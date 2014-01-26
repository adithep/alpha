var Recursive;
var _ = lodash;

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
            document_name: value,
            document_schema: schema.value_schema
          });
          r_value = a._id;
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
                document_name: value[index],
                document_schema: schema.value_schema
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
      }
    }
    return r_value;
  };

  Recursive.prototype.case_obj_s = function(schema, id) {
    var index, sche;
    sche = schema.schema || schema;
    index = 0;
    while (index < sche.length) {
      if (sche[index].value_type === "array") {
        if (sche[index].array_values.value_type === "object") {
          sche[index].array_values.object_keys = this.case_obj_s(sche[index].array_values.object_keys, id);
        } else {
          if (sche[index].array_values.value_schema !== "document_schema" && sche[index].array_values.value_schema !== void 0) {
            sche[index].array_values.value_schema = id[sche[index].array_values.value_schema];
          }
        }
      } else {
        if (sche[index].value_schema !== "document_schema" && sche[index].value_schema !== void 0) {
          sche[index].value_schema = id[sche[index].value_schema];
        }
      }
      if (sche[index].value_type === "object") {
        sche[index].object_keys = this.case_obj_s(sche[index].object_keys, id);
      }
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
        _id: object.document_schema
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
          a = DATA.findOne({
            _id: value
          });
          r_value = a.document_name;
          break;
        case "string":
          r_value = value;
          break;
        case "number":
          r_value = value;
          break;
        case "array":
          r_value = this.case_arr_o(schema.array_values, value);
          break;
        case "object":
          r_value = this.case_switch_o(schema.object_keys, value);
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
                r_value[r_index] = a.document_name;
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
        case "number":
          r_value = value;
          break;
        case "array":
          this.case_arr_o(schema.array_values, value);
          break;
        case "object":
          while (index < value.length) {
            r_value[index] = this.case_switch_o(schema.object_keys, value[index]);
            index++;
          }
      }
    }
    return r_value;
  };

  return Recursive;

})();

re = new Recursive();