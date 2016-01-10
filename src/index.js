var vElement = require('./vdom/vElement');
var rerenUpdater = require('./vdom/rerenUpdater');
var variables = require('./variables');

/**
 * Api method for creating a Reren component
 * @type {The component factory method}
 */
module.exports.component = require('./component');

/**
 * Api method for creating a Reren element
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
    rootNode.setAttribute(variables.ID_ATTR, variables.ROOT_IDENTIFIER);
    
    var rootInstance = new rootComponent.type();

    rootInstance.mount(variables.ROOT_IDENTIFIER + "_1");
};

/**
 * Shorthand helpers from creating common HTML vElements like: div's, span's, button's etc
 * example: instead of writing: R.element("div", null, OtherElement); --> R.div(null, OtherElement)
 */
require('./htmlElements').forEach(e => {
    module.exports[e] = (attr, children) => { return vElement(e, attr, children); };
});