var vElement = require('./vElement');
var domUtils = require('./domUtils');
var _prevDom = null;
var _rootNode;
var _rootComponent;

/**
 * Api method for creating a Reren controller
 * @type {The controller function}
 */
module.exports.component = require('./component');

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
 * @rootComponent    {The root component to start the app with}
 * @rootNode         {The root DOM node the render all content on}
 */
module.exports.start = (rootComponent, rootNode) => {
    _rootComponent = rootComponent;
    _rootNode = rootNode || document.body;

    var vDom = _rootComponent.getView();
    
    applyChanges(vDom);

    _prevDom = vDom;
};

/**
 * Api method for rerendering the whole App
 */
module.exports.reRender = () => {
    var newDom = _rootComponent.getView();
    
    applyChanges(newDom);

    _prevDom = newDom;
};

var applyChanges = (vDom) => {
    var operations = domUtils.getChanges(vDom, _prevDom, _rootNode);

    operations.forEach(o => {
        o.apply();
    });
}

/**
 * Shorthand helpers from creating common elements like: div, span, button etc
 */


["div", "span", "p", "button", "table", "thead", "tbody", "th", "tr", "td"].forEach(e => {
    module.exports[e] = (attr, children) => { return vElement(e, attr, children); };
});