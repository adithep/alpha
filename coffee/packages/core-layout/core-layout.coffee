HUMAN_FORM = new Meteor.Collection(null, idGeneration: "MONGO")
CITIES = new Meteor.Collection(null, {idGeneration:"MONGO"})
pargs = {}
pargs.session = false

Deps.autorun ->
  if Meteor.user()
    sub_list = Meteor.subscribe "list"
    if sub_list.ready()
      console.log "hello"
      HUMAN_FORM.remove({})
      human = DATA.findOne(doc_name: "humans", doc_schema: "doc_schema")
      ADATA.find({p_doc_schema: human._id, input_starting: true}).map (doc) ->
        doc._sid = doc._id
        delete doc._id
        HUMAN_FORM.insert(form_element: [doc], _sid: doc._sid, input_size: doc.input_size, input_starting: true)
  else
    if sub_list
      sub_list.stop()
  return

Template.layout.helpers
  dyield: ->
    a = Session.get("targ")
    if not a
      b = window.location.pathname
      c = b.split("/")
      Session.set("targ", c[1])
    if Template[a]
      Template[a]
    else
      Template.sorry_man

Template.login.helpers
  creatingAccount: ->
    Session.get("creatingAccount")
Template.login.events
  'click #loginform': (e, t) ->
    Session.set('creatingAccount', false)
  'click #accountform': (e, t) ->
    Session.set('creatingAccount', true)
  'click #createaccount': (e, t) ->
    Session.set('creatingAccount', false)
    Accounts.createUser
      username: t.find('#username').value
      password: t.find('#password').value
      email: t.find('#email').value
      profile:
        name: t.find('#name').value
  'click #logout': (e, t) ->
    Meteor.logout()
  'click #login': (e, t) ->
    Meteor.loginWithPassword(t.find('#username').value, t.find('#password').value)

UI.body.events
  'click a[href^="/"]': (e, t) ->
    e.preventDefault()
    a = e.currentTarget.pathname
    b = a.split('/')
    Session.set("targ", b[1])
    window.history.pushState("","", a)
    return
  'mouseover .has-dropdown': (e, t) ->
    $(e.currentTarget).find(".dropdown").show()
  'mouseleave .has-dropdown': (e, t) ->
    $(e.currentTarget).find(".dropdown").hide()
  'mouseover .dropdown': (e, t) ->
    $(e.currentTarget).show()
  'mouseleave .dropdown': (e, t) ->
    $(e.currentTarget).hide()
  'click #logout': (e, t) ->
    Meteor.logout()

UI.body.helpers
  today_isodate: ->
    a = new Date()
    a.setHours(0, -a.getTimezoneOffset(), 0, 0)
    b = a.toISOString().substring(0, 10)
    b

Template.add_contact.events
  'click .click-input': (e, t) ->
    t_id = e.currentTarget.dataset.id
    id = new Meteor.Collection.ObjectID(t_id)
    obj = ADATA.findOne(_id: id)
    if (ADATA.find(parent: obj._id).count() is 0) or (obj.object_keys_arr)
      obj._sid = obj._id
      delete obj._id
      if obj.array
        HUMAN_FORM.insert(form_element: [obj], _sid: obj._sid, input_size: obj.input_size)
      else
        if HUMAN_FORM.findOne(_sid: obj._sid)
          HUMAN_FORM.remove(_sid: obj._sid)
        else
          HUMAN_FORM.insert(form_element: [obj], _sid: obj._sid, input_size: obj.input_size)
    else
      obj = ojts(obj._id)
      HUMAN_FORM.insert(obj)

  'click .contact_form .close_input': (e, t) ->
    id = new Meteor.Collection.ObjectID(e.currentTarget.dataset.id)
    HUMAN_FORM.remove(_id: id)

  'keypress .contact_form': (e, t) ->
    if e.which is 13
      e.preventDefault()

  'blur .contact_form input[name=mobile]': (e, t) ->
    small = $(e.currentTarget).next()
    if e.currentTarget.dataset.value is "" or e.currentTarget.dataset.value is undefined
      e.currentTarget.value = ""
      small.html("invalid. try inserting country code")
      small.hide()
    else
      a = formatInternational(e.currentTarget.dataset.country, e.currentTarget.dataset.value)
      e.currentTarget.value = e.currentTarget.dataset.value
      small.hide()
    return

  'keyup .contact_form input[name=mobile]': (e, t) ->
    small = $(e.currentTarget).next()
    small.show()
    number = e.currentTarget.value
    e164 = formatE164("TH", number)
    if isValidNumber(e164, "TH")
      inter = formatInternational("TH", e164)
      small.html("#{inter} valid!")
      small.removeClass("warning").addClass("success")
      e.currentTarget.dataset.value = e164
      e.currentTarget.dataset.country = "TH"
      return
    else
      if number.length >= 2
        if number.substring(0, 1) is "+"
          if number.length >= 3
            sub = number.substring(1, 2)
        else
          sub = number.substring(0, 2)
        countryCode = DATA.findOne(callingCode: sub)
        if countryCode
          e164_1 = formatE164(countryCode.cca2, number)
          if isValidNumber(e164_1, countryCode.cca2)
            inter_1 = formatInternational(countryCode.cca2, e164_1)
            small.html("#{inter_1} valid!")
            small.removeClass("warning").addClass("success")
            e.currentTarget.dataset.value = e164_1
            e.currentTarget.dataset.country = countryCode.cca2
            return
          else
            small.html("invalid. try inserting country code")
            small.removeClass("success").addClass("warning")
            e.currentTarget.dataset.value = ""
            e.currentTarget.dataset.country = ""
            return
        else
          small.html("invalid. try inserting country code")
          small.removeClass("success").addClass("warning")
          e.currentTarget.dataset.value = ""
          e.currentTarget.dataset.country = ""
          return
      else
        small.html("invalid. try inserting country code")
        small.removeClass("success").addClass("warning")
        e.currentTarget.dataset.value = ""
        e.currentTarget.dataset.country = ""
        return

  'click .contact_form .form_submit': (e, t) ->
    arr = []
    index_p = 0
    parentdiv = t.findAll('.parentdiv')
    while index_p < parentdiv.length
      barr = []
      index = 0
      input = $(parentdiv[index_p]).find(':input')
      while index < input.length
        id = new Meteor.Collection.ObjectID(input[index].dataset.sid)
        if input[index].localName is 'select'
          value = new Meteor.Collection.ObjectID(input[index].value)
        else if $(input[index]).hasClass('input_select')
          value = new Meteor.Collection.ObjectID(input[index].dataset.value)
        else
          value = input[index].value
        barr[index] = {id: id, value: value}
        index++
      arr[index_p] = barr
      index_p++
    console.log arr
    Meteor.call "insert_human", arr

  'focus .contact_form .input_select': (e, t) ->
    if e.currentTarget.value is ""
      $('.input_select_box').hide()
    else
      $('.input_select_box').show()

  'blur .contact_form .input_select': (e, t) ->
    if e.currentTarget.value isnt ""
      if $('.blue_color').html()
        e.currentTarget.value = $('.blue_color').html()
        e.currentTarget.dataset.value = $('.blue_color').data('value')
      if e.currentTarget.dataset.value is ""
        e.currentTarget.value = ""
    else
      e.currentTarget.value = ""
      e.currentTarget.dataset.value = ""
    $('.input_select_box').hide()
    return

  'mouseover .contact_form .lala_item': (e, t) ->
    $('.lala_item').removeClass('blue_color')
    $(e.target).addClass('blue_color')
    b = $(e.target).html()
    $('.input_select').val(b)

  'click .contact_form .input_select': (e, t) ->
    if e.currentTarget.value isnt ""

      $('.input_select_box').show()
          
      params = {input: e.currentTarget.value, field: e.currentTarget.dataset.schema}

      subs = Meteor.subscribe "cities_list", params
        
      if pargs.session
        pargs.session.stop()

      pargs.session = subs
      return

  'keyup .contact_form .input_select': (e, t) ->
    if e.which is 40
      if $('.lala_item').hasClass("blue_color") is false
        $('.input_select_list li:first-child').addClass("blue_color")
      else
        $(".blue_color").removeClass("blue_color").next().addClass("blue_color")

      b = $(".blue_color").html()
      if b
        e.currentTarget.value = b
      return

    else if e.which is 38
      if $('.lala_item').hasClass("blue_color") is false
        $('.input_select_list li:first-child').addClass("blue_color")
      else
        $(".blue_color").removeClass("blue_color").prev().addClass("blue_color")

      b = $(".blue_color").html()
      if b
        e.currentTarget.value = b
      return
    else if e.which is 13
      if $('.lala_item').hasClass("blue_color")
        d = $(".blue_color").html()
        if d
          e.currentTarget.value = d
          e.currentTarget.dataset.value = $('.blue_color').data('value')
      $('.input_select_box').hide()
      if pargs.session
        pargs.session.stop()

    else if e.which is 27
      e.currentTarget.value = ""
      e.currentTarget.dataset.value = ""
      $('.input_select_box').hide()
      if pargs.session
        pargs.session.stop()

    else
      if e.currentTarget.value is ""
        $('.input_select_box').hide()
      else
        
        $('.input_select_box').show()

      if e.currentTarget.value isnt ""
          

        params = {input: e.currentTarget.value, field: e.currentTarget.dataset.schema}

        Meteor.subscribe "cities_list", params, ->
          d = new Meteor.Collection.ObjectID(e.currentTarget.dataset.schema)
          city_schema = DATA.findOne(_id: d)
          a = ADATA.find({$and: [{doc_schema: city_schema.doc_name}, $or: [{doc_name: { $regex: params.input, $options: 'i' }}, {country: { $regex: params.input, $options: 'i' }}]]}, { limit: 5} ).fetch()
          if a
            console.log a
            a[0].e_class = "blue_color"
            CITIES.remove({})
            _.map a, (obj) ->
              CITIES.insert(obj)
          
        return


Template.add_contact.helpers
  schema: ->
    human = DATA.findOne(doc_name: "humans", doc_schema: "doc_schema")
    if human
      ADATA.find({p_doc_schema: human._id, button_name: {$exists: true}})
  input_element: ->
    HUMAN_FORM.find()

  input_select_helper: ->
    CITIES.find()

  select_options: (id) ->
    piece = ADATA.findOne(_id: id)
    DATA.find({doc_schema: piece.value_schema})

  select_options_arr: (id) ->
    ADATA.find(parent: id).fetch()

ojts = (id) ->
  arr = []
  input_size = 0
  ADATA.find(parent: id).forEach (doc) ->
    if ADATA.find(parent: doc._id).count() is 0
      doc._sid = doc._id
      delete doc._id
      input_size = input_size + doc.input_size
      arr.push(doc)
  obj = {form_element: arr, _sid: id, input_size: input_size}
  obj



