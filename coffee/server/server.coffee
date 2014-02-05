_ = lodash
class Json_Doc
  constructor: (@id) ->
    @id = {}
  
  insert_schema: (json) ->
    json = json + ".json"
    schema = EJSON.parse(Assets.getText(json))
    index = 0
    while index < schema.length
      if schema[index].schema
        schema[index] = re.case_obj_s(schema[index], @id)
      @id[schema[index].doc_name] = DATA.insert(schema[index])
      index++
    console.log "#{json} inserted"
    return

  insert_json: (json, schema) ->
    json = json + ".json"
    json_obj = EJSON.parse(Assets.getText(json))
    index = 0
    schema = DATA.findOne(_id: @id[schema])
    while index < json_obj.length
      a = re.case_switch(schema.schema, json_obj[index])
      DATA.insert(a)
      index++
      
    console.log "#{json} inserted"
    return

  get_schema_id: (doc_name) ->
    if Object.keys(@id).length is 0
      DATA.find(doc_schema: "doc_schema").forEach (doc) =>
        @id[doc.doc_name] = doc._id
        return
    if @id[doc_name]
      @id[doc_name]
    else
      console.warn("no schema #{doc_name} in database")
  
DATA.after.insert (userid, doc) ->
  if doc.doc_schema isnt "doc_schema"
    a = re.case_switch_o(doc)
    _.extend(a, {_id: this._id})
    console.log a
    ADATA.upsert({_id: this._id}, a)
    if doc.doc_name
      console.log "#{doc.doc_name} inserted"
    else
      console.log "document inserted"
  else if doc.doc_schema is "doc_schema"
    ADATA.update({p_doc_schema: doc.doc_name}, {$set: {p_doc_schema: this._id}}, {multi: true})

DATA.before.insert (userid, doc) ->
  if userid
    a = {created: {user: userid, date: new Date()}}
    _.extend(doc, a)
    console.log doc
    doc


Meteor.methods

  insert_human: (array) ->
    index  = 0
    mobj = {}
    while index < array.length
      indy = 0
      obj = {}
      while indy < array[index].length
        wow = array[index]
        doc = ADATA.findOne(_id: wow[indy].id)
        if doc.object_keys_arr
          doc = ADATA.findOne(_id: wow[0].value)
          wow[0].value = wow[1].value
          wow.pop()
        k = genius(doc, wow[indy].value)
        obj = merge(obj, k)
        indy++
      mobj = mergea(mobj, obj)
      index++
    human_schema = DATA.findOne(doc_schema: "doc_schema", doc_name: "humans")
    mobj.doc_schema = human_schema._id
    DATA.insert(mobj)
    console.log mobj

    return

genius = (doc, value) ->
  obj = {}
  mobj = {}
  if doc.parent is 'root'
    switch doc.value_type
      when 'object'
        obj[doc.key_name] = value
      when 'array'
        if obj[doc.key_name] is undefined
          obj[doc.key_name] = []
        obj[doc.key_name].push(value)
      when 'string'
        obj[doc.key_name] = String(value)
      when 'number'
        obj[doc.key_name] = Number(value)
      when 'oid'
        obj[doc.key_name] = value
      when 'currency'
        obj[doc.key_name] = Number(value) * 100
      when 'date'
        obj[doc.key_name] = new Date(value)
  else
    switch doc.value_type
      when 'object'
        mobj[doc.key_name] = value
      when 'array'
        if mobj[doc.key_name] is undefined
          mobj[doc.key_name] = []
        mobj[doc.key_name].push(value)
      when 'string'
        mobj[doc.key_name] = String(value)
      when 'number'
        mobj[doc.key_name] = Number(value)
      when 'oid'
        mobj[doc.key_name] = value
      when 'currency'
        mobj[doc.key_name] = Number(value) * 100
      when 'date'
        mobj[doc.key_name] = new Date(value)
    parent = ADATA.findOne(_id: doc.parent)
    k = genius(parent, mobj)
    _.merge(obj, k)
  obj


Meteor.publish "list", ->
  
  titles = DATA.findOne(doc_schema: "doc_schema", doc_name: "titles")
  currencies = DATA.findOne({doc_schema: "doc_schema", doc_name: "currencies"})
  services = DATA.findOne(doc_schema: "doc_schema", doc_name: "services")
  humans = DATA.findOne(doc_schema: "doc_schema", doc_name: "humans")
  cities_arr = DATA.distinct("city", {doc_schema: humans._id})
  ADATA.find({$or: [{doc_schema: titles._id}, {_id: {$in: cities_arr}}, {doc_schema: currencies._id}, {doc_schema: services._id}]}, {fields: {doc_schema: 1, doc_name: 1, default: 1, country: 1} })

Meteor.publish "schema", ->
  b = ADATA.find({p_doc_schema: {$exists: true}})
  c = DATA.find({doc_schema: "doc_schema"})
  [b, c]

Meteor.publish "cities_list", (args) ->
  if args.input
    d = new Meteor.Collection.ObjectID(args.field)
    ADATA.find({$and: [{doc_schema: d}, $or: [{doc_name: { $regex: args.input, $options: 'i' }}, {country: { $regex: args.input, $options: 'i' }}]]}, { limit: 5, fields: {doc_name: 1, country: 1, doc_schema: 1} } )


Meteor.startup ->

  doc_json = new Json_Doc()

  if DATA.find(doc_schema: "doc_schema").count() is 0
    DATA.remove({})

  if DATA.find().count() is 0
    doc_json.insert_schema('schema_array')

  if DATA.find(doc_schema: doc_json.get_schema_id('currencies')).count() is 0
    doc_json.insert_json('currencies', 'currencies')

  if DATA.find(doc_schema: doc_json.get_schema_id('countries')).count() is 0
    doc_json.insert_json('countries', 'countries')

  if DATA.find(doc_schema: doc_json.get_schema_id('titles')).count() is 0
    doc_json.insert_json('titles', 'titles')

  if DATA.find(doc_schema: doc_json.get_schema_id('services')).count() is 0
    doc_json.insert_json('services', 'services')

  if DATA.find(doc_schema: doc_json.get_schema_id('cities')).count() is 0
    doc_json.insert_json('cities', 'cities')

