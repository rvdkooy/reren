var vDom = require('./vDom');

var _rootNode;
var _prevView;
var _mainController;

module.exports.start = (controller, rootNode) => {
	_mainController = controller;
	_rootNode = rootNode || document.body;

	_prevView = _mainController.getView();

	var newDom = vDom.parse(_prevView);

	_rootNode.appendChild(newDom);
};

module.exports.controller = require('./controller');

module.exports.view = require('./view');

module.exports.element = require('./element');

module.exports.reRender = () => {
	
	if(_rootNode.childNodes.length) {
		_rootNode.removeChild(_rootNode.childNodes[0]);	
	}

	var virtualView = _mainController.getView();

	var newDom = vDom.parse(virtualView);

	_rootNode.appendChild(newDom)
};