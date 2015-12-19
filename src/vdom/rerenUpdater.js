var vDomComparer = require('./vDomComparer');
var documentHelpers = require('./documentHelpers');
var variables = require('../variables');

var _rootComponent = null;
var _prevDom = null;
var componentToUpdate = [];

module.exports.init = (rootComponent, rootNode) => {
    _rootComponent = rootComponent;
    rootNode.setAttribute(variables.ID_ATTR, variables.ROOT_IDENTIFIER);
    
    var vDom = rootComponent;

    var operations = vDomComparer.getChanges(vDom, _prevDom, variables.ROOT_IDENTIFIER + "_1");
    operations.forEach(o => o.apply());

    _prevDom = vDom;
}

module.exports.update = (component) => {
    if (!_rootComponent) {
        throw new Error("trying to update a Component without knowing what the root Component is!");
    }

    componentToUpdate.push(component);
    setTimeout(scheduleUpdate);
}

var scheduleUpdate = () => {
    componentToUpdate.forEach(changedComponent => {
        componentToUpdate.splice(changedComponent);
        
        var prevDom = findvDomElementByIdentifier(_prevDom, changedComponent.identifier);
        var newDom = changedComponent.getView();

        var operations = vDomComparer.getChanges(newDom, prevDom, changedComponent.identifier);
        operations.forEach(o => o.apply());

        udatevDomElement(newDom, changedComponent.identifier);
    })
};

var findvDomElementByIdentifier = (vdom, identifier) => {
    
    var result = null;
    
    function find(e, identifier) {
        if(e.identifier === identifier) {
            result = e;
            return;
        }

        if(e.children) {
            e.children.forEach(c => {
                find(c, identifier);
            })
        }        
    }
    
    find(vdom, identifier);
    
    return result;
};

var udatevDomElement = (newDom, identifier) => {
    var element;

    function find(e, identifier) {
        if(e.identifier === identifier) {
            element = e;
            return;
        }

        if(e.children) {
            e.children.forEach(c => {
                find(c, identifier);
            })
        }
    }
    
    find(_prevDom, identifier);

    element.tagName = newDom.tagName;
    element.attributes = newDom.attributes;
    element.content = newDom.content;
    element.children = newDom.children;
    element.componentInstance = newDom.componentInstance;
};