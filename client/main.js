(function(Reren){

	var initial = 1;


	var myview = Reren.view(function(model) {
		return Reren.element("span", {}, initial.toString());
	});

	var controller = Reren.controller(function() {
		this.setView(myview);
	});

	Reren.start(controller, document.getElementById('container'));


	setInterval(function() {
		initial++;
		Reren.reRender();
	}, 1000);

})(window.Reren);