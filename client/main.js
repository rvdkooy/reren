(function (R) {
  function determineBackgroundColor(t) {
    var backgroundColor = "red";
    if (t % 2 === 0) {
      backgroundColor = "green";
    }
    return backgroundColor;
  }

  var CounterComponent = R.component({
    controller: function (timer) {
      var self = this;
      this.model = {
        timer: timer,
        backgroundColor: determineBackgroundColor(timer)
      };

      this.onUpdate = function (newTimer) {
        self.model = {
          timer: newTimer,
          backgroundColor: determineBackgroundColor(newTimer)
        };
      };
    },
    view: function (model) {
      return R.h3({ style: "color: " + model.backgroundColor + "" },  model.timer.toString());
    }
  });

  var CounterComponentWrapper = R.component({
    controller: function () {
      var self = this;

      this.model.stopTimer = function () {
        self.model.timer = 0;
        clearInterval(self.interval);
      };
      this.model.startTimer = function () {
        self.interval = setInterval(() => {
          self.model.timer += 1;
        }, 1000);
      };
    },
    getReactiveModel: function () {
      return { timer: 0 };
    },
    view: function (model) {
      return R.div({ classes: "row" }, [
        R.div({ classes: "col-lg-12" }, [
          R.div({ classes: "panel panel-default" }, [
            R.div({ classes: "panel-heading" }, "Counter example"),
            R.div({ classes: "panel-body" }, [
              R.element(CounterComponent, model.timer)
            ]),
            R.div({ classes: "panel-footer" }, [
              R.button({ type: "button", classes: "btn btn-xs btn-primary", onClick: model.startTimer }, "Start timer"),
              R.button({ type: "button", classes: "btn btn-xs", onClick: model.stopTimer }, "Stop timer")
            ])
          ])
        ])
      ]);
    }
  });

  var TableComponent = R.component({
    controller: function () {
      var self = this;
      this.model.data = [];
      this.model.onLoadDataButtonClicked = function () {

        for (var i = 0; i < 250; i++) {
          self.model.data.push({ name: "Ronald van der Kooij " + (i + 1) });
        }
        self.update();
      };
      this.model.onClearDataButtonClicked = function () {
        self.model.data = [];
        self.update();
      };
    },
    view: function (model) {
      var rows = model.data.map((d) => {
        return R.tr(null, R.td(null, d.name));
      });

      return R.div({ classes: "row" }, [
        R.div({ classes: "col-lg-12" }, [
          R.div({ classes: "panel panel-default" }, [
            R.div({ classes: "panel-heading" }, "Table example"),
            R.div({ classes: "panel-body", style: "height: 250px;overflow-y: auto" }, [
              R.table({ classes: "table table-striped" }, [
                R.thead(null, R.th(null, R.tr(null, "name"))),
                R.tbody(null, rows)
              ])
            ]),
            R.div({ classes: "panel-footer" }, [
              R.button({ type: "button", classes: "btn btn-xs btn-primary", onClick: model.onLoadDataButtonClicked }, "Load Data"),
              R.button({ type: "button", classes: "btn btn-xs btn-default", onClick: model.onClearDataButtonClicked }, "Clear Data"),
              R.span({ classes: "label label-success pull-right" }, "number of rows in data: " + model.data.length)
            ])
          ])
        ])
      ]);
    }
  });

  var ListItem = R.component({
    controller: function () {
      var self = this;
      this.model.counter = 1;
      this.model.text = "Every line is a separate component, click me to increase the number ";
      this.model.onClick = function () {
        self.model.counter++;
        self.update();
      };
    },
    view: function (model) {
      return R.li({ onClick: model.onClick }, model.text + model.counter.toString());
    }
  });


  var ListComponent = R.component({
    view: function () {
      var listItems = [
        R.element(ListItem),
        R.element(ListItem),
        R.element(ListItem)
      ];

      return R.div({ classes: "row" }, [
        R.div({ classes: "col-lg-12" }, [
          R.div({ classes: "panel panel-default" }, [
            R.div({ classes: "panel-heading" }, "List of components example"),
            R.div({ classes: "panel-body", style: "height: 150px;overflow-y: auto" }, [
              R.ul(null, listItems)
            ])
          ])
        ])
      ]);
    }
  });

  var RootComponent = R.component({
    view: function () {
      return R.div({ classes: "container" }, [
        R.element(TableComponent),
        R.element(CounterComponentWrapper),
        R.element(ListComponent)
      ]);
    }
  });

  R.start(R.element(RootComponent), document.getElementById('container'));

})(window.Reren);