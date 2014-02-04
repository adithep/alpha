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
    ADATA.upsert({_id: this._id}, a)
    console.log "#{doc.doc_name} inserted"
  else if doc.doc_schema is "doc_schema"
    ADATA.update({p_doc_schema: doc.doc_name}, {$set: {p_doc_schema: this._id}}, {multi: true})

Meteor.publish "list", ->
  b = ADATA.find({p_doc_schema: {$exists: true}})
  titles = DATA.findOne(doc_schema: "doc_schema", doc_name: "titles")
  currencies = DATA.findOne({doc_schema: "doc_schema", doc_name: "currencies"})
  services = DATA.findOne(doc_schema: "doc_schema", doc_name: "services")
  c = DATA.find({$or: [{doc_schema: "doc_schema"}, {doc_schema: titles._id}, {doc_schema: currencies._id}, {doc_schema: services._id}]}, {fields: {doc_schema: 1, doc_name: 1} })
  [b, c]

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

