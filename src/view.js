var BaseView = function() {

};

module.exports = (View) => {

	return function() {
		
		return new View();
	};
};