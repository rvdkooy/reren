var BaseController = function () {


	this.setView = (view, model) => {
		this._view = view;
		this._model = model;
	};		

	this.getView = () => {
		return this._view(this._model);
	};		
};

module.exports = (Ctrl) => {
	Ctrl.prototype = new BaseController();
    Ctrl.constructor = Ctrl;
	return new Ctrl();
};