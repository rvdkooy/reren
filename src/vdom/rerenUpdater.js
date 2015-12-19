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

    operations.forEach(o => {
        o.apply();
    });

    _prevDom = vDom; // should only update part of the vdom if can (first time is the root)

    //ar vDom = applyChanges(rootComponent, rootNode);
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

        //var parentId = changedComponent.;

        var operations = vDomComparer.getChanges(newDom, prevDom, changedComponent.identifier);
        operations.forEach(o => {
            o.apply();
        });
        prevDom = newDom;
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
}






