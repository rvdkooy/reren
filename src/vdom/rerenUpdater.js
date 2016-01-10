var vDomComparer = require('./vDomComparer');
var documentHelpers = require('./documentHelpers');
var variables = require('../variables');
var _currentVirtualDom;
var componentToUpdate = [];

module.exports.init = (rootComponent, rootNode) => {
    rootNode.setAttribute(variables.ID_ATTR, variables.ROOT_IDENTIFIER);
    
    //var operations = vDomComparer.getChanges(vDom, _currentVirtualDom, variables.ROOT_IDENTIFIER + "_1");
    //operations.forEach(o => o.apply());
    
    var rootInstance = new rootComponent.type();

    rootInstance.mount(variables.ROOT_IDENTIFIER);
}

module.exports.update = (component) => {
    componentToUpdate.push(component);
    setTimeout(scheduleUpdate);
}

var scheduleUpdate = () => {
    componentToUpdate.forEach(changedComponent => {
        componentToUpdate.splice(changedComponent);
        
        var prevDom = findvDomElementByIdentifier(_currentVirtualDom, changedComponent.identifier);
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
    function findAndUpdate(e, identifier) {
        if(e.identifier === identifier) {
            
            e.tagName = newDom.tagName;
            e.attributes = newDom.attributes;
            e.content = newDom.content;
            e.children = newDom.children;
        } else if(e.children) {
            for (var i = 0; i < e.children.length; i++) {
                findAndUpdate(e.children[i], identifier);
            };
        }
    }

    findAndUpdate(_currentVirtualDom, identifier);
};