var BaseView = function() {

};

module.exports = (View) => {

	return function(model) {
		
		return new View(model);
	};
};