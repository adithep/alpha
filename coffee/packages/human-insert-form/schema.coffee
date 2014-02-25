(->
  Template.__define__ "__display_humans", (->
    self = this
    template = this
    [
      UI.If(->
        Spacebars.call Spacebars.dot(self.lookup("."), "full_name")
      , UI.block(->
        self = this
        [
          HTML.BR()
          HTML.P(
            "data-path": "full_name"
          , "Full Name")
          UI.If(->
            Spacebars.call Spacebars.dot(self.lookup("."), "full_name", "titles")
          , UI.block(->
            self = this
            [
              HTML.BR()
              HTML.P(
                "data-path": "full_name.titles"
              , "Titles: ", ->
                Spacebars.mustache Spacebars.dot(self.lookup("."), "full_name", "titles")
              )
            ]
          ))
          UI.If(->
            Spacebars.call Spacebars.dot(self.lookup("."), "full_name", "first_name")
          , UI.block(->
            self = this
            [
              HTML.BR()
              HTML.P(
                "data-path": "full_name.first_name"
              , "First Name: ", ->
                Spacebars.mustache Spacebars.dot(self.lookup("."), "full_name", "first_name")
              )
            ]
          ))
          UI.If(->
            Spacebars.call Spacebars.dot(self.lookup("."), "full_name", "middle_name")
          , UI.block(->
            self = this
            [
              HTML.BR()
              HTML.P(
                "data-path": "full_name.middle_name"
              , "Middle Name: ", ->
                Spacebars.mustache Spacebars.dot(self.lookup("."), "full_name", "middle_name")
              )
            ]
          ))
          UI.If(->
            Spacebars.call Spacebars.dot(self.lookup("."), "full_name", "last_name")
          , UI.block(->
            self = this
            [
              HTML.BR()
              HTML.P(
                "data-path": "full_name.last_name"
              , "Last Name: ", ->
                Spacebars.mustache Spacebars.dot(self.lookup("."), "full_name", "last_name")
              )
            ]
          ))
        ]
      ))
      UI.If(->
        Spacebars.call Spacebars.dot(self.lookup("."), "email")
      , UI.block(->
        self = this
        [
          HTML.BR()
          HTML.P(
            "data-path": "email"
          , "Email")
          UI.If(->
            Spacebars.call Spacebars.dot(self.lookup("."), "email", "main")
          , UI.block(->
            self = this
            [
              HTML.BR()
              HTML.P(
                "data-path": "email.main"
              , "Main: ")
              " "
              HTML.UL(" ", UI.Eacha(->
                Spacebars.call Spacebars.dot(self.lookup("."), "email", "main")
              , UI.block(->
                self = this
                [
                  "\n  "
                  Spacebars.include(self.lookupTemplate("__display_emails"))
                  "\n  "
                ]
              )))
              " "
            ]
          ))
          UI.If(->
            Spacebars.call Spacebars.dot(self.lookup("."), "email", "personal")
          , UI.block(->
            self = this
            [
              HTML.BR()
              HTML.P(
                "data-path": "email.personal"
              , "Personal: ")
              " "
              HTML.UL(" ", UI.Eacha(->
                Spacebars.call Spacebars.dot(self.lookup("."), "email", "personal")
              , UI.block(->
                self = this
                [
                  " "
                  HTML.LI(
                    class: "meme"
                  , " ", ->
                    Spacebars.mustache self.lookup(".")
                  , " ")
                ]
              )))
              " "
            ]
          ))
          UI.If(->
            Spacebars.call Spacebars.dot(self.lookup("."), "email", "work")
          , UI.block(->
            self = this
            [
              HTML.BR()
              HTML.P(
                "data-path": "email.work"
              , "Work: ")
              " "
              HTML.UL(" ", UI.Eacha(->
                Spacebars.call Spacebars.dot(self.lookup("."), "email", "work")
              , UI.block(->
                self = this
                [
                  " "
                  HTML.LI(
                    class: "meme"
                  , " ", ->
                    Spacebars.mustache self.lookup(".")
                  , " ")
                ]
              )))
              " "
            ]
          ))
        ]
      ))
      UI.If(->
        Spacebars.call Spacebars.dot(self.lookup("."), "mobile")
      , UI.block(->
        self = this
        [
          HTML.BR()
          HTML.P(
            "data-path": "mobile"
          , "Mobile")
          UI.If(->
            Spacebars.call Spacebars.dot(self.lookup("."), "mobile", "main")
          , UI.block(->
            self = this
            [
              HTML.BR()
              HTML.P(
                "data-path": "mobile.main"
              , "Main: ")
              " "
              HTML.UL(" ", UI.Eacha(->
                Spacebars.call Spacebars.dot(self.lookup("."), "mobile", "main")
              , UI.block(->
                self = this
                [
                  " "
                  HTML.LI(
                    class: "meme"
                  , " ", ->
                    Spacebars.mustache self.lookup(".")
                  , " ")
                ]
              )))
              " "
            ]
          ))
          UI.If(->
            Spacebars.call Spacebars.dot(self.lookup("."), "mobile", "personal")
          , UI.block(->
            self = this
            [
              HTML.BR()
              HTML.P(
                "data-path": "mobile.personal"
              , "Personal: ")
              " "
              HTML.UL(" ", UI.Eacha(->
                Spacebars.call Spacebars.dot(self.lookup("."), "mobile", "personal")
              , UI.block(->
                self = this
                [
                  " "
                  HTML.LI(
                    class: "meme"
                  , " ", ->
                    Spacebars.mustache self.lookup(".")
                  , " ")
                ]
              )))
              " "
            ]
          ))
          UI.If(->
            Spacebars.call Spacebars.dot(self.lookup("."), "mobile", "work")
          , UI.block(->
            self = this
            [
              HTML.BR()
              HTML.P(
                "data-path": "mobile.work"
              , "Work: ")
              " "
              HTML.UL(" ", UI.Eacha(->
                Spacebars.call Spacebars.dot(self.lookup("."), "mobile", "work")
              , UI.block(->
                self = this
                [
                  " "
                  HTML.LI(
                    class: "meme"
                  , " ", ->
                    Spacebars.mustache self.lookup(".")
                  , " ")
                ]
              )))
              " "
            ]
          ))
        ]
      ))
      UI.If(->
        Spacebars.call Spacebars.dot(self.lookup("."), "service")
      , UI.block(->
        self = this
        [
          HTML.BR()
          HTML.P(
            "data-path": "service"
          , "Service:")
          " "
          UI.Eacha(->
            Spacebars.call Spacebars.dot(self.lookup("."), "service")
          , UI.block(->
            self = this
            [
              UI.If(->
                Spacebars.call Spacebars.dot(self.lookup("."), "date_of_entry")
              , UI.block(->
                self = this
                [
                  HTML.BR()
                  HTML.P(
                    "data-path": "date_of_entry"
                  , "Date: ", ->
                    Spacebars.mustache Spacebars.dot(self.lookup("."), "date_of_entry")
                  )
                ]
              ))
              UI.If(->
                Spacebars.call Spacebars.dot(self.lookup("."), "service")
              , UI.block(->
                self = this
                [
                  HTML.BR()
                  HTML.P(
                    "data-path": "service"
                  , "Service: ", ->
                    Spacebars.mustache Spacebars.dot(self.lookup("."), "service")
                  )
                ]
              ))
              UI.If(->
                Spacebars.call Spacebars.dot(self.lookup("."), "currency")
              , UI.block(->
                self = this
                [
                  HTML.BR()
                  HTML.P(
                    "data-path": "currency"
                  , "Currecny: ", ->
                    Spacebars.mustache Spacebars.dot(self.lookup("."), "currency")
                  )
                ]
              ))
              UI.If(->
                Spacebars.call Spacebars.dot(self.lookup("."), "cost")
              , UI.block(->
                self = this
                [
                  HTML.BR()
                  HTML.P(
                    "data-path": "cost"
                  , "Cost: ", ->
                    Spacebars.mustache Spacebars.dot(self.lookup("."), "cost")
                  )
                ]
              ))
            ]
          ))
        ]
      ))
      UI.If(->
        Spacebars.call Spacebars.dot(self.lookup("."), "date_of_birth")
      , UI.block(->
        self = this
        [
          HTML.BR()
          HTML.P(
            "data-path": "date_of_birth"
          , "Date of Birth: ", ->
            Spacebars.mustache Spacebars.dot(self.lookup("."), "date_of_birth")
          )
        ]
      ))
      UI.If(->
        Spacebars.call Spacebars.dot(self.lookup("."), "city")
      , UI.block(->
        self = this
        [
          HTML.BR()
          HTML.P(
            "data-path": "city"
          , "City: ", ->
            Spacebars.mustache Spacebars.dot(self.lookup("."), "city")
          )
        ]
      ))
    ]
  )
  Template.__define__ "__display_emails", (->
    self = this
    template = this
    UI.block(->
      self = this
      [
        HTML.LI(
          class: "meme"
        , " ", ->
          Spacebars.mustache self.lookup(self.lookup("."))
        , " ")
      ]
    )
  )
  Template.__define__ "display_humans", (->
    self = this
    template = this
    UI.Eacha (->
      Spacebars.call self.lookup("humans")
    ), UI.block(->
      self = this
      [
        "\n  "
        Spacebars.include(self.lookupTemplate("__display_humans"))
        "\n  "
      ]
    )
  )
  return
).call this