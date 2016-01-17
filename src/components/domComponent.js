var documentHelpers = require('../vdom/documentHelpers');
var variables = require('../variables');
var domOperations = require('../vdom/domOperations');

class DomComponentMountable {
    
    mount() {
        domOperations.applyDomChanges(new domOperations.InsertElement(this.parentIdentifier,
                                            this.identifier,
                                            this.tagName,
                                            this.attributes,
                                            this.content));
    }

    update(vElement) {
        this._handleAttributes(vElement.attributes);

        if (vElement.content !== this.content) {
            this.content = vElement.content;
            domOperations.applyDomChanges(new domOperations.SetInnerHtml(this.identifier, vElement.content));
        }
    }

    _handleAttributes(attributes) {
        var domChanges = [];
        for(var prop in attributes) {
            
            if(prop === "classes") {
                domChanges.push(new domOperations.SetAttribute(this.identifier, "class", attributes[prop]));
            }
            else if(prop === "onClick") {
                //element.addEventListener("click", attributes[prop]);
            }
            else {
                domChanges.push(new domOperations.SetAttribute(this.identifier, prop, attributes[prop]));
            }
        }
        this.attributes = attributes;
        domChanges.forEach(c => domOperations.applyDomChanges(c))
    }

    unmount() {
        domOperations.applyDomChanges(new domOperations.RemoveElement(this.parentIdentifier, this.identifier))
    }
};

class DomComponent extends DomComponentMountable {
    constructor(vElement, parentIdentifier, identifier) {
        super()
        this.tagName = vElement.type;
        this.content = vElement.content;
        this.attributes = vElement.attributes;
        this.parentIdentifier = parentIdentifier;
        this.identifier = identifier;
        this.children = [];
    }

    addChild(childComponentInstance) {
        this.children.push(childComponentInstance);
    }
}

module.exports = DomComponent;