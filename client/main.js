(function(R){
    
    var CounterComponent = R.component({
    	controller: function() {
    		var t = this;
    		var ViewModel = function() {
    			var self = this;
    			this.timer = 0;
    			this.resetTimer = function() {
    				self.timer = 0;
    				//t.update();
    			}
    		};

    		var model = new ViewModel();
    		// setInterval(() => {
    		// 	model.timer += 1;
    		// 	//t.update();
    		// }, 1000);
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
            var t = this;
        	var ViewModel = function() {
        	    var self = this;
        	    this.data = [];
        	    this.onLoadDataButtonClicked = function() {
        	        
        	        for (var i = 0; i < 250; i++) {
        	            self.data.push({ name: "Ronald van der Kooij " + (i+1) });
        	        };
        	        t.update();
        	    },
        	    this.onClearDataButtonClicked = function() {
        	        self.data = [];
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
	
	var ListItem = R.component({
		controller: function() {

			var Model = function() {
				var self = this;
				this.counter = 1;
				this.text = "item ";
				this.onClick = function() {
					self.counter++;
				}	
			}

			this.setViewModel(new Model());
		},
		view: function(model) {
			return R.li({ onClick: model.onClick }, model.text + model.counter.toString())
		}
	});


	var ListComponent = R.component({
		view: function(model) {
			
			var listItems = [
				R.element(ListItem), 
				R.element(ListItem), 
				R.element(ListItem)
			];

			return R.div({ classes: "row" }, [ 
	            R.div({ classes: "col-lg-12" }, [ 
	                R.div({ classes: "panel panel-default" }, [
	                    R.div({ classes: "panel-heading" }, "Table example"),
	                    R.div({ classes: "panel-body" , style: "height: 150px;overflow-y: auto"}, [
	                        R.ul(null, listItems)
	                    ])
	                ])
	            ])
	        ]);  
		}
	});

	var RootComponent = R.component({
    	view: function() {
    		return R.div({ classes: "container" }, [
    			R.element(TableComponent),
    			R.element(CounterComponent),
    			R.element(ListComponent)
			]);
    	}
    })
 //    
 	var ChildComponent = R.component({
 		view: function() {
 			return R.div(null, "test");
 		}
 	});

	// var RootComponent = R.component({
	// 	view: function() {
	// 		return R.div(null, R.element(ChildComponent))
	// 	}
	// });



    R.start(R.element(RootComponent), document.getElementById('container'));

})(window.Reren);