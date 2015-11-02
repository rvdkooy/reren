var vDom = require('./vDom');

var _rootNode;
var _mainController;

module.exports.start = (controller, rootNode) => {
	_mainController = controller;
	_rootNode = rootNode || document.body;

	var newView = _mainController.getView();
	parseVirtualDom(_rootNode, newView);
};

module.exports.controller = require('./controller');

module.exports.view = require('./view');

module.exports.element = require('./vElement');

module.exports.reRender = () => {
	
	var newView = _mainController.getView();
	parseVirtualDom(_rootNode, newView);
};

function parseVirtualDom(rootNode, newView) {
	var changes = vDom.parse(rootNode, newView);

	changes.forEach(function(change) {
		change();
	});
}