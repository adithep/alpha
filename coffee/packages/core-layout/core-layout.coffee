subscription = {}
Deps.autorun ->
  if Meteor.user()
    subscription.sub_sche = Meteor.subscribe "schema"
    subscription.sub_list = Meteor.subscribe "list"
    subscription.sub_humans = Meteor.subscribe "humans"
    if subscription.sub_sche.ready() and subscription.sub_list.ready()
      Session.set("subscription", subscription)
  else
    if subscription.sub_list
      subscription.sub_list.stop()
    if subscription.sub_sche
      subscription.sub_sche.stop()
    if subscription.sub_humans
      subscription.sub_humans.stop()
    Session.set("subscription", false)
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
  combine_sid: (a, b) ->
    if a._id
      suk = a._id._str
    else if a.__id
      suk = a.__id._str

    obj = {'id': suk, 'sid': b}
    if a.$index or a.$index is 0
      obj.index = a.$index
    obj


