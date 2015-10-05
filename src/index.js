var _rootNode;
var _prevView;
var _mainController;

module.exports.start = (controller, rootNode) => {
	_mainController = controller;
	_rootNode = rootNode || document.body;

	var newView = controller.getView();
	_prevView = newView;
	_rootNode.appendChild(newView);
};

module.exports.controller = require('./controller');

module.exports.view = require('./view');

module.exports.element = require('./element');

module.exports.reRender = () => {
	
	// somewhere here we need smart diffing
	_rootNode.removeChild(_rootNode.childNodes[0]);

	var newView = _mainController.getView();
	_rootNode.appendChild(newView)
};