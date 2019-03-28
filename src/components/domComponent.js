var domOperations = require('../vdom/domOperations');
var events = require('../htmlVariables').events;

class DomComponentMountable {
  constructor() {
    this._registeredEventListeners = {};
  }
  mount() {
    domOperations.applyDomChanges(
      new domOperations.InsertElement(
        this.parentIdentifier,
        this.identifier,
        this.tagName,
        this.content
      )
    );
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
    attributes = attributes || {};

    var isEventListener = (property) => {
      for (var i = 0; i < events.length; i++) {
        if (events[i] === property.toLowerCase()) return true;
      }
      return false;
    };

    for (var newProp in attributes) {
      if (!this.attributes || (this.attributes[newProp] !== attributes[newProp]) || mounting) {

        if (isEventListener(newProp)) {
          if (!this.attributes[newProp] || mounting) {
            domChanges.push(new domOperations.AddEventListener(this.identifier, newProp, attributes[newProp]));

            this._registeredEventListeners[newProp] = attributes[newProp];
          }
        } else if (newProp === "classes") {
          domChanges.push(new domOperations.SetAttribute(this.identifier, "class", attributes[newProp]));

        } else {
          domChanges.push(new domOperations.SetAttribute(this.identifier, newProp, attributes[newProp]));
        }
      }
    }

    for (var existingProp in this.attributes) {

      if (!attributes[existingProp]) {
        var attributeName = existingProp;

        if (isEventListener(existingProp)) {
          domChanges.push(new domOperations.RemoveEventListener(this.identifier, existingProp, this._registeredEventListeners[existingProp]));
          delete this._registeredEventListeners[existingProp];
        } else {
          if (existingProp === "classes") {
            attributeName = "class";
          }

          domChanges.push(new domOperations.RemoveAttribute(this.identifier, attributeName));
        }
      }
    }

    this.attributes = attributes;
    domChanges.forEach(c => domOperations.applyDomChanges(c));
  }

  unmount(isRoot) {
    if (isRoot) {
      domOperations.applyDomChanges(new domOperations.RemoveElement(this.parentIdentifier, this.identifier));
    }
    this.children.forEach(c => c.unmount());
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

  removeChild(childComponentInstance) {
    this.children.splice(this.children.indexOf(childComponentInstance), 1);
  }
}

module.exports = DomComponent;