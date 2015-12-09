(function(R){
    
    var CounterComponent = R.component({
    	controller: function() {
    		var ViewModel = function() {
    			var self = this;
    			this.timer = 0;
    			this.resetTimer = function() {
    				self.timer = 0;
    				R.reRender();
    			}
    		};

    		var model = new ViewModel();
    		setInterval(() => {
    			model.timer += 1;
    			R.reRender();
    		}, 1000);
    		this.setViewModel(model);
    	},
    	view: function(model) {
    		return R.div({ classes: "row" }, [ 
		            R.div({ classes: "col-lg-12" }, [ 
		                R.div({ classes: "panel panel-default" }, [
		                    R.div({ classes: "panel-heading" }, "Counter example"),
		                    R.div({ classes: "panel-body" }, [
		                        R.h3(null, model.timer.toString())
		                    ]),
		                    R.div({ classes: "panel-footer" }, [ 
		                        R.button({ type: "button", classes: "btn btn-xs btn-primary", onClick: model.resetTimer }, "Reset timer")
		                    ])
		                ]),
		                
		            ])
		        ]);  
    	}
    });


    var TableComponent = R.component({
        controller: function() {
            
        	var ViewModel = function() {
        	    var self = this;
        	    this.data = [];
        	    this.onLoadDataButtonClicked = function() {
        	        
        	        for (var i = 0; i < 250; i++) {
        	            self.data.push({ name: "Ronald van der Kooij " + (i+1) });
        	        };

        	        R.reRender();
        	    },
        	    this.onClearDataButtonClicked = function() {
        	        self.data = [];
        	        R.reRender();
        	    }
        	};

            this.setViewModel(new ViewModel());
        },
        view: function(model) {
            var rows = model.data.map((d) => {
                return R.tr(null, R.td(null, d.name));
            });

            return R.div({ classes: "row" }, [ 
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
		                        R.button({ type: "button", classes: "btn btn-xs btn-primary", onClick: model.onLoadDataButtonClicked }, "Load Data"),
		                        R.button({ type: "button", classes: "btn btn-xs btn-default", onClick: model.onClearDataButtonClicked }, "Clear Data"),
		                        R.span({ classes: "label label-success" }, "number of rows in data: " + model.data.length)
		                    ])
		                ])
		            ])
		        ]);  
        }
    });
	
	var RootComponent = R.component({
    	view: function() {
    		return R.div({ classes: "container" }, [
    			TableComponent,
    			CounterComponent
			]);
    	}
    })

    R.start(RootComponent, document.getElementById('container'));

})(window.Reren);