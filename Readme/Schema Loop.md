
# Schema Loop

	while index < schema.length
	    key_name = schema[index].key_name
	    value_type = schema[index].value_type
	    r_value = case_obj(schema[index], object[key_name])
	    if r_value isnt undefined and r_value.length isnt 0
	      a[key_name] = r_value
	      obj = _.merge(obj, a)
	    index++

