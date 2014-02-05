tl = TLog?.getLogger()
#hacky advanced mongo definitions based on https://github.com/meteor/meteor/pull/644

path = Npm.require("path")
MongoDB = Npm.require("mongodb")
BSON = MongoDB.BSONPure
Future = Npm.require(path.join("fibers", "future"))

_dummyCollection_ = new Meteor.Collection '___dummy___'

# Wrapper of the call to the db into a Future
_futureWrapper = (collection, commandName, args)->
  col = if (typeof collection) == "string" then  _dummyCollection_ else collection
  collectionName = if (typeof collection) == "string" then  collection else collection._name

  #tl?.debug "future Wrapper called for collection " + collectionName + " command: " + commandName + " args: " + args

  coll1 = col.find()._mongo.db.collection(collectionName)

  future = new Future
  cb = future.resolver()
  coll1[commandName](args, cb)
  result = future.wait()

_collectionDistinct = (collection, commandName, args, query)->
  col = if (typeof collection) == "string" then  _dummyCollection_ else collection
  collectionName = if (typeof collection) == "string" then  collection else collection._name

  #tl?.debug "future Wrapper called for collection " + collectionName + " command: " + commandName + " args: " + args

  coll1 = col.find()._mongo.db.collection(collectionName)

  query1 = _.map query, (value, key) ->
    if Match.test(value, Meteor.Collection.ObjectID)
      str = value._str
      value = new BSON.ObjectID(str)

  future = new Future
  cb = future.resolver()
  coll1[commandName] args, query1, (err, res) ->
    future.throw(err) if err
    index = 0
    while index < res.length
      if typeof res[index] is "object"
        if typeof res[index].toString is "function"
          res[index] = new Meteor.Collection.ObjectID(res[index].toString())
      index++
    future.return res
  result = future.wait()



# Not really DRY, but have to return slightly different results from mapReduce as mongo method returns
# a mongo collection, which we don't need here at all
_callMapReduce = (collection, map, reduce, options)->
  col = if (typeof collection) == "string" then  _dummyCollection_ else collection
  collectionName = if (typeof collection) == "string" then  collection else collection._name

  tl?.debug "callMapReduce called for collection " + collectionName + " map: " + map + " reduce: " + reduce + " options: #{JSON.stringify(options)}"

  coll1 = col.find()._mongo.db.collection(collectionName)

  future = new Future
  #cb = future.resolver()
  coll1.mapReduce map, reduce, options, (err,result,stats)->
      #tl?.debug "Inside MapReduce callback now!"
      future.throw(err) if err
      res = {collectionName: result.collectionName, stats: stats}
      future.return [true,res]

  result = future.wait() #
  #console.log "Result from the callMapReduce is: "
  #console.dir result[1]
  throw result[1] if !result[0]
  result[1]



# Extending Collection on the server
_.extend Meteor.Collection::,

  distinct: (key, query) ->
    _collectionDistinct @_name, "distinct", key, query
    #_futureWrapper @_name, "distinct", key

  aggregate: (pipeline) ->
    _futureWrapper @_name, "aggregate", pipeline

  mapReduce: (map, reduce, options)->
    options = options || {};
    options.readPreference = "primary";
    _callMapReduce @_name, map, reduce, options



