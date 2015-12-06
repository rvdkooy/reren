var vElement = require('./vElement');
var domUtils = require('./domUtils');
var _prevDom = null;
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
 * @tag             {The tagname of the element. eg: div}
 * @attributes         {The attributes to put on the element. eg: style: { color: "red" }}
 * @children         {The children of the element. 
 *                     this can be antother element, an array of elements or a string }
 */
module.exports.element = vElement;

/**
 * Api method for starting up the App
 * @controller         {The root controller to start the app with}
 * @rootNode         {The root DOM node the render all content on}
 */
module.exports.start = (controller, rootNode) => {
    _mainController = controller;
    _rootNode = rootNode || document.body;

    var vDom = _mainController.getView();
    
    applyChanges(vDom);

    _prevDom = vDom;
};

/**
 * Api method for rerendering the whole App
 */
module.exports.reRender = () => {
    var newDom = _mainController.getView();
    
    applyChanges(newDom);

    _prevDom = newDom;
};

function applyChanges(vDom) {
    var operations = domUtils.getChanges(vDom, _prevDom, _rootNode);

    operations.forEach(o => {
        o.apply();
    });
}

/**
 * Shorthand helpers from creating common elements like: div, span, button etc
 */
module.exports.div = (attr, children) => { return vElement("div", attr, children) };
module.exports.span = (attr, children) => { return vElement("span", attr, children) };