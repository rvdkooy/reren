var variables = require('../../variables');
var documentHelpers = require('../documentHelpers');

class DomComponent {
    constructor(vElement, mountId, identifier) {
        this.tagName = vElement.type;
        this.content = vElement.content;
        this.mountId = mountId;
        this.identifier = identifier;
        this.children = [];
    }

    mount() {
        var mountElement = documentHelpers.findElement(this.mountId)

        var element = document.createElement(this.tagName);
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
        var mountElement = documentHelpers.findElement(this.mountId)

        if (vElement.content !== this.content) {
            mountElement.innerHTML = vElement.content;
        }
    }

    unmount() {
        // cleaning up + all children!
    }
}

module.exports = DomComponent;