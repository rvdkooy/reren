(function(R){

    var myview = R.view(function(model) {

        var rows = model.data.map((d) => {
            return R.tr(null, R.td(null, d.name));
        });

        return R.div({ classes: "container" }, [
                    R.div({ classes: "jumbotron" }, [
                        R.element("h1", null, "Just stuff here!"),
                        R.p({ classes: "lead" }, "This should contain some cool text...")
                    ]),
                    R.div({ classes: "row" }, [ 
                        R.div({ classes: "col-lg-12" }, [ 
                            R.div({ classes: "panel panel-default" }, [
                                R.div({ classes: "panel-heading" }, "Table example"),
                                R.div({ classes: "panel-body" , style: "height: 500px;overflow-y: auto"}, [
                                    R.button({ type: "button", classes: "btn btn-primary", onClick: model.onLoadDataButtonClicked }, "Load Data..."),
                                    R.button({ type: "button", classes: "btn btn-default", onClick: model.onClearDataButtonClicked }, "Clear Data..."),
                                    R.table({ classes: "table table-striped" }, [
                                        R.tbody(null, rows),
                                        R.thead(null, R.th(null, R.tr(null, "name")))
                                    ]),
                                    R.span({ classes: "label label-success" }, "number of rows in data: " + model.data.length)
                                ])
                            ])
                        ])
                    ])
                ]
        );
    });

    var controller = R.controller(function() {
        
        var Model = function() {
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

        this.setView(myview, new Model());
    });

    R.start(controller, document.getElementById('container'));

})(window.Reren);