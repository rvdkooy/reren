var domOperations = require('../vdom/domOperations');
var events = require('../htmlVariables').events;

class DomComponentMountable {

    mount() {
        domOperations.applyDomChanges(new domOperations.InsertElement(this.parentIdentifier,
                                            this.identifier,
                                            this.tagName,
                                            this.content));

        this._handleAttributes(this.attributes, true);
    }

    update(vElement) {
        this._handleAttributes(vElement.attributes);

        if (vElement.content !== this.content) {
            this.content = vElement.content;
            domOperations.applyDomChanges(new domOperations.SetInnerHtml(this.identifier, vElement.content));
        }
    }

    _handleAttributes(attributes, mounting) {
        var domChanges = [];

        var isEventListener = (property) => {
            for (var i = 0; i < events.length; i++) {
                if (events[i] === property.toLowerCase()) return true;
            }
        };

        for (var prop in attributes) {
            if (!this.attributes || (this.attributes[prop] !== attributes[prop]) || mounting) {

                if (isEventListener(prop)) {
                    domChanges.push(new domOperations.AddEventListener(this.identifier, prop, attributes[prop]));

                } else if (prop === "classes") {
                    domChanges.push(new domOperations.SetAttribute(this.identifier, "class", attributes[prop]));

                } else {
                    domChanges.push(new domOperations.SetAttribute(this.identifier, prop, attributes[prop]));
                }
            }
        }

        this.attributes = attributes;
        domChanges.forEach(c => domOperations.applyDomChanges(c));
    }

    unmount() {
        domOperations.applyDomChanges(new domOperations.RemoveElement(this.parentIdentifier, this.identifier));
    }
}

class DomComponent extends DomComponentMountable {
    constructor(vElement, parentIdentifier, identifier) {
        super();
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