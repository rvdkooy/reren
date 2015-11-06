var vDom = require('./vDom');

var _rootNode;
var _mainController;

/**
 * Api method for creating a Reren controller
 * @type {The controller function}
 */
module.exports.controller = require('./controller');


/**
 * Api method for creating a Reren view
 * @type {A function that should return a Reren Element tree}
 */
module.exports.view = require('./view');


/**
 * Api method for creating Reren a Reren element
 * @tag 			{The tagname of the element. eg: div}
 * @attributes 		{The attributes to put on the element. eg: style: { color: "red" }}
 * @children 		{The children of the element. 
 * 					this can be antother element, an array of elements or a string }
 */
module.exports.element = require('./vElement');

/**
 * Api method for starting up the App
 * @controller 		{The root controller to start the app with}
 * @rootNode 		{The root DOM node the render all content on}
 */
module.exports.start = (controller, rootNode) => {
	_mainController = controller;
	_rootNode = rootNode || document.body;

	var newView = _mainController.getView();
	parseVirtualDom(_rootNode, newView);
};

/**
 * Api method for rerendering the whole App
 */
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