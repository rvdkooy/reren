(function(Reren){

	var myview = Reren.view(function(model) {
		return Reren.element("div", null, 
			Reren.element("span", { style: "font-size: 72px;color: red" }, model.text)
		);
	});

	var controller = Reren.controller(function() {
		
		var counter = 1;
		var model = { text: "1" };

		setInterval(function() {	
			model.text = ++counter;;
			Reren.reRender();
		}, 1000);

		this.setView(myview, model);
	});

	Reren.start(controller, document.getElementById('container'));

})(window.Reren);