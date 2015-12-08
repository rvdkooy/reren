(function(R){
    
    var ViewModel = function() {
        var self = this;
        this.data = [];
        this.onLoadDataButtonClicked = function() {
            
            for (var i = 0; i < 250; i++) {
                self.data.push({ name: "Ronald van der Kooij" + (i+1) });
            };

            R.reRender();
        },
        this.onClearDataButtonClicked = function() {
            self.data = [];
            R.reRender();
        }
    };

    var Component = R.component({
        controller: function() {
            this.setViewModel(new ViewModel());
        },
        view: function(model) {
            var rows = model.data.map((d) => {
                return R.tr(null, R.td(null, d.name));
            });

            return R.div({ classes: "container" }, [
                        R.div({ classes: "row" }, [ 
                            R.div({ classes: "col-lg-12" }, [ 
                                R.div({ classes: "panel panel-default" }, [
                                    R.div({ classes: "panel-heading" }, "Table example"),
                                    R.div({ classes: "panel-body" , style: "height: 250px;overflow-y: auto"}, [
                                        R.table({ classes: "table table-striped" }, [
                                            R.tbody(null, rows),
                                            R.thead(null, R.th(null, R.tr(null, "name")))
                                        ])
                                    ]),
                                    R.div({ classes: "panel-footer" }, [ 
                                        R.span({ classes: "label label-success" }, "number of rows in data: " + model.data.length),
                                        R.button({ type: "button", classes: "btn btn-xs btn-default pull-right", onClick: model.onClearDataButtonClicked }, "Clear Data"),
                                        R.button({ type: "button", classes: "btn btn-xs btn-primary pull-right", onClick: model.onLoadDataButtonClicked }, "Load Data"),
                                    ])
                                ])
                            ])
                        ])
                    ]
            );
        }
    });

    R.start(Component, document.getElementById('container'));

})(window.Reren);