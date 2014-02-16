class Recursive

  case_switch: (schema, object) ->
    index = 0
    r_value = undefined
    obj = {}
    a = {}
    while index < schema.length
      key_name = schema[index].key_name
      value_type = schema[index].value_type
      r_value = @case_obj(schema[index], object[key_name])
      if r_value isnt undefined and r_value.length isnt 0
        a[key_name] = r_value
        obj = _.merge(obj, a)
      index++

    obj
      

  case_obj: (schema, value) ->
    r_value = undefined
    if value isnt '' and value isnt undefined
      switch schema.value_type
        when "oid"
          a = DATA.findOne(doc_name: value, doc_schema: schema.value_schema)
          if a
            r_value = a._id
          else
            console.warn "cannot find #{value}"

        when "string" then r_value = String(value)
        when "number" then r_value = Number(value)
        when "array"
          r_value = @case_arr(schema.array_values, value)
        when "object"
          r_value = @case_switch(schema.object_keys, value)
        else
          r_value = value
    r_value

  case_arr: (schema, value) ->
    r_value = []
    if value isnt undefined and value.length isnt 0
      index = 0
      r_index = 0
      switch schema.value_type
        when "oid"
          while index < value.length
            if value[index] isnt '' and value[index] isnt undefined
              a = DATA.findOne(doc_name: value[index], doc_schema: schema.value_schema)
              if a
                r_value[r_index] = a._id
                r_index++
              else
                console.warn "cannot find #{value[index]}"
            index++
        when "string"
          while index < value.length
            if value[index] isnt '' and value[index] isnt undefined
              r_value[r_index] = String(value[index])
              r_index++
            index++
        when "number"
          while index < value.length
            if value[index] isnt '' and value[index] isnt undefined
              r_value[r_index] = Number(value[index])
              r_index++
            index++
        when "array"
          @case_arr(schema.array_values, value)
        when "object"
          while index < value.length
            r_value[index] = @case_switch(schema.object_keys, value[index])
            index++
        else
          r_value = value
    r_value
        

  case_obj_s: (schema, id, pid) ->
    if schema.schema
      @s_name = schema.doc_name
    sche = schema.schema or schema
    index = 0
    while index < sche.length
      sid = ADATA.insert(a: "a")
      if sche[index].value_type is "array"
        if sche[index].array_values.value_type is "object"
          sche[index].array_values.object_keys = @case_obj_s(sche[index].array_values.object_keys, id, sid)
        else
          if sche[index].array_values.value_schema isnt "doc_schema" and sche[index].array_values.value_schema isnt undefined
            sche[index].array_values.value_schema = id[sche[index].array_values.value_schema]
      else
        if sche[index].value_schema isnt "doc_schema" and sche[index].value_schema isnt undefined
          sche[index].value_schema = id[sche[index].value_schema]

      if sche[index].value_type is "object"
        sche[index].object_keys = @case_obj_s(sche[index].object_keys, id, sid)
      obj_doc =
        p_doc_schema: @s_name
        doc_schema: "schema_piece"
        parent: pid or "root"
      asche = _.merge(obj_doc, sche[index])
      delete asche.object_keys
      if asche.array_values
        delete asche.array_values.object_keys
      ADATA.update({_id: sid}, asche)
      sche[index] = _.merge(sche[index], _sid: sid)
      index++
    if schema.schema
      schema.schema = sche
    else
      schema = sche
    schema


  case_switch_o: (object, schema) ->
    unless schema
      sche = DATA.findOne(_id: object.doc_schema)
      schema = sche.schema
    index = 0
    r_value = undefined
    obj = {}
    a = {}
    while index < schema.length
      key_name = schema[index].key_name
      value_type = schema[index].value_type
      r_value = @case_obj_o(schema[index], object[key_name])
      if r_value isnt undefined and r_value.length isnt 0
        a[key_name] = r_value
        obj = _.merge(obj, a)
      index++

    obj
      

  case_obj_o: (schema, value) ->
    r_value = undefined
    if value isnt '' and value isnt undefined
      switch schema.value_type
        when "oid"
          if schema.key_name isnt "doc_schema"
            a = DATA.findOne(_id: value)
            r_value = a.doc_name
          else
            r_value = value
        when "email" then r_value = value
        when "string" then r_value = value
        when "phone" then r_value = formatInternational(countryForE164Number(value), value)
        when "date" then r_value = value.toDateString()
        when "number" then r_value = value
        when "currency" then r_value = value/100
        when "array"
          r_value = @case_arr_o(schema.array_values, value)
        when "object"
          r_value = @case_switch_o(value, schema.object_keys)
    r_value

  case_arr_o: (schema, value) ->
    r_value = []
    if value isnt undefined and value.length isnt 0
      index = 0
      r_index = 0
      switch schema.value_type
        when "oid"
          while index < value.length
            if value[index] isnt '' and value[index] isnt undefined
              a = DATA.findOne(_id: value[index])
              if a
                r_value[r_index] = a.doc_name
                r_index++
              else
                console.warn "cannot find #{value[index]}"
            index++
        when "string"
          r_value = value
        when "email"
          r_value = value
        when "phone"
          while index < value.length
            r_value[index] = formatInternational(countryForE164Number(value[index]), value[index])
            index++
        when "number"
          r_value = value
        when "currency"
          while index < value.length
            r_value[index] = value[index]/100
            index++
        when "date"
          while index < value.length
            r_value[index] = value[index].toDateString()
            index++
        when "array"
          @case_arr_o(schema.array_values, value)
        when "object"
          while index < value.length
            r_value[index] = @case_switch_o(value[index], schema.object_keys)
            index++
    r_value

  write_case_switch: (schema, object) ->
    index = 0
    r_value = undefined
    obj = {}
    a = {}
    while index < schema.length
      key_name = schema[index].key_name
      value_type = schema[index].value_type
      r_value = @write_case_obj(schema[index], object[key_name])
      if r_value isnt undefined and r_value.length isnt 0
        a[key_name] = r_value
        obj = _.merge(obj, a)
      index++

    obj
      

  write_case_obj: (schema, value) ->
    r_value = undefined
    if value isnt '' and value isnt undefined
      switch schema.value_type
        when "oid"
          a = DATA.findOne(_id: value)
          if a
            r_value = a.doc_name
          else
            console.warn "cannot find #{value}"
        when "array"
          r_value = @write_case_arr(schema.array_values, value)
        when "object"
          r_value = @write_case_switch(schema.object_keys, value)
        else
          r_value = value
    r_value

  write_case_arr: (schema, value) ->
    r_value = []
    if value isnt undefined and value.length isnt 0
      index = 0
      r_index = 0
      switch schema.value_type
        when "oid"
          while index < value.length
            if value[index] isnt '' and value[index] isnt undefined
              a = DATA.findOne(_id: value[index])
              if a
                r_value[r_index] = a.doc_name
                r_index++
              else
                console.warn "cannot find #{value[index]}"
            index++
        when "array"
          @write_case_arr(schema.array_values, value)
        when "object"
          while index < value.length
            r_value[index] = @write_case_switch(schema.object_keys, value[index])
            index++
        else
          r_value = value
    r_value
      

  

@re = new Recursive()