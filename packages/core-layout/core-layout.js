var subscription;

subscription = {};

Deps.autorun(function() {
  if (Meteor.user()) {
    subscription.sub_sche = Meteor.subscribe("schema");
    subscription.sub_list = Meteor.subscribe("list");
    subscription.sub_humans = Meteor.subscribe("humans");
    if (subscription.sub_sche.ready() && subscription.sub_list.ready()) {
      Session.set("subscription", subscription);
    }
  } else {
    if (subscription.sub_list) {
      subscription.sub_list.stop();
    }
    if (subscription.sub_sche) {
      subscription.sub_sche.stop();
    }
    if (subscription.sub_humans) {
      subscription.sub_humans.stop();
    }
    Session.set("subscription", false);
  }
});

Template.layout.helpers({
  dyield: function() {
    var a, b, c;
    a = Session.get("targ");
    if (!a) {
      b = window.location.pathname;
      c = b.split("/");
      Session.set("targ", c[1]);
    }
    if (Template[a]) {
      return Template[a];
    } else {
      return Template.sorry_man;
    }
  }
});

Template.login.helpers({
  creatingAccount: function() {
    return Session.get("creatingAccount");
  }
});

Template.login.events({
  'click #loginform': function(e, t) {
    return Session.set('creatingAccount', false);
  },
  'click #accountform': function(e, t) {
    return Session.set('creatingAccount', true);
  },
  'click #createaccount': function(e, t) {
    Session.set('creatingAccount', false);
    return Accounts.createUser({
      username: t.find('#username').value,
      password: t.find('#password').value,
      email: t.find('#email').value,
      profile: {
        name: t.find('#name').value
      }
    });
  },
  'click #logout': function(e, t) {
    return Meteor.logout();
  },
  'click #login': function(e, t) {
    return Meteor.loginWithPassword(t.find('#username').value, t.find('#password').value);
  }
});

UI.body.events({
  'click a[href^="/"]': function(e, t) {
    var a, b;
    e.preventDefault();
    a = e.currentTarget.pathname;
    b = a.split('/');
    Session.set("targ", b[1]);
    window.history.pushState("", "", a);
  },
  'mouseover .has-dropdown': function(e, t) {
    return $(e.currentTarget).find(".dropdown").show();
  },
  'mouseleave .has-dropdown': function(e, t) {
    return $(e.currentTarget).find(".dropdown").hide();
  },
  'mouseover .dropdown': function(e, t) {
    return $(e.currentTarget).show();
  },
  'mouseleave .dropdown': function(e, t) {
    return $(e.currentTarget).hide();
  },
  'click #logout': function(e, t) {
    return Meteor.logout();
  }
});

UI.body.helpers({
  today_isodate: function() {
    var a, b;
    a = new Date();
    a.setHours(0, -a.getTimezoneOffset(), 0, 0);
    b = a.toISOString().substring(0, 10);
    return b;
  },
  combine_sid: function(a, b) {
    var obj, suk;
    if (a._id) {
      suk = a._id._str;
    } else if (a.__id) {
      suk = a.__id._str;
    }
    obj = {
      'id': suk,
      'sid': b
    };
    if (a.$index || a.$index === 0) {
      obj.index = a.$index;
    }
    return obj;
  }
});
