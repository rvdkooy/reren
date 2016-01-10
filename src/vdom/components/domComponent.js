var variables = require('../../variables');
var documentHelpers = require('../documentHelpers');

class DomComponent {
    constructor(vElement, mountId, identifier) {
        this.tagName = vElement.type;
        this.content = vElement.content;
        this.attributes = vElement.attributes;
        this.mountId = mountId;
        this.identifier = identifier;
        this.children = [];
    }
    _handleAttributes(attributes, element) {
        for(var prop in attributes) {
            
            if(prop === "classes") {
                element.setAttribute("class", attributes[prop]);
            }
            else if(prop === "onClick") {
                element.addEventListener("click", attributes[prop]);
            }
            else {
                element.setAttribute(prop, attributes[prop]);
            }
        }
    }
    mount() {
        var mountElement = documentHelpers.findElement(this.mountId)

        var element = document.createElement(this.tagName);
        this._handleAttributes(this.attributes, element);
        element.setAttribute(variables.ID_ATTR, this.identifier);

        if (this.content) {
            element.innerHTML = this.content;
        }

        mountElement.appendChild(element)
    }

    addChild(childComponentInstance) {
        this.children.push(childComponentInstance);
    }

    update(vElement) {
        var mountElement = documentHelpers.findElement(this.identifier)

        this._handleAttributes(vElement.attributes, mountElement);

        if (vElement.content !== this.content) {
            mountElement.innerHTML = vElement.content;
        }
    }

    unmount() {
        // cleaning up + all children!
    }
}

module.exports = DomComponent;