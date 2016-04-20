var objectAssign = require('../utils/objectAssign');
var DomComponent = require('./domComponent');

var MountableRerenComponent = {
    _previousMountedDom: null,

    mount: function(identifier) {
        this.identifier = identifier;

        var parentIdentifier = identifier.substring(0, identifier.lastIndexOf("_"));
        var rootElement = this.getView();

        this._previousMountedDom = this._parseVElement(rootElement, identifier, parentIdentifier);
    },
    unmount: function() {
        this.onComponentUnmount();
        this._previousMountedDom.unmount(true);
    },
    updateComponent: function() {
        var parentIdentifier = this.identifier.substring(0, this.identifier.lastIndexOf("_"));
        var rootElement = this.getView();

        this._previousMountedDom = this._parseVElement(rootElement, this.identifier,
                                               parentIdentifier, this._previousMountedDom);
    },
    _handleDomComponentChildren: function(identifier, element, componentInstance) {
        if (element.children && componentInstance.children) {
            // removing children
            if ((element.children.length === 0 && componentInstance.children.length > 0) ||
                componentInstance.children.length > element.children.length) {
                for (var i = 0; i < componentInstance.children.length; i++) {
                    var childrenToRemove = componentInstance.children.splice(i);
                    childrenToRemove.forEach(x => x.unmount(true));
                }
            }
        }

        // traverse children
        if (element.children && element.children.length) {

            element.children.forEach((child, index) => {
                this._parseVElement(child,
                                    identifier + "_" + (index + 1),
                                    identifier,
                                    componentInstance.children[index],
                                    componentInstance);
            });
        }
    },
    _handleDomComponent: function(vElement, identifier, parentIdentifier, prevCompInstance, parentCompInstance) {
        var domComponentInstance;

        var mountNewDomComponent = (el, parentId, id) => {
            var domComponent = new DomComponent(el, parentId, id);
            domComponent.mount();
            if (parentCompInstance) {
                parentCompInstance.addChild(domComponent);
            }

            return domComponent;
        };
        if (!prevCompInstance) {
            domComponentInstance = mountNewDomComponent(vElement, parentIdentifier, identifier);
        } else {
            if (prevCompInstance.tagName !== vElement.type) {
                parentCompInstance.removeChild(prevCompInstance);
                prevCompInstance.unmount(true);
                domComponentInstance = mountNewDomComponent(vElement, parentIdentifier, identifier);
            } else {
                domComponentInstance = prevCompInstance;
                domComponentInstance.update(vElement);
            }
        }

        this._handleDomComponentChildren(identifier, vElement, domComponentInstance);

        return domComponentInstance;
    },
    _handleRerenComponent: function(vElement, identifier, parentIdentifier, prevCompInstance, parentCompInstance) {
        var reRenComponentInstance;

        var mountRerenComponent = (el, id, parent) => {
            var ComponentConstructor = el.type;
            var rerenComponent = new ComponentConstructor(el.attributes);
            rerenComponent.mount(id);

            if (parent && parent.addChild) {
                parent.addChild(rerenComponent);
            }

            return rerenComponent;
        };
        if (!prevCompInstance) {
            reRenComponentInstance = mountRerenComponent(vElement, identifier, parentCompInstance);
        } else {
            if (prevCompInstance instanceof vElement.type) {
                reRenComponentInstance = prevCompInstance;
                reRenComponentInstance.onComponentUpdate(vElement.attributes);
                reRenComponentInstance.updateComponent();
            } else {
                prevCompInstance.unmount();
                prevCompInstance = null;
                console.log(vElement.attributes);
                reRenComponentInstance = mountRerenComponent(vElement, identifier, parentCompInstance);
            }
        }
        return reRenComponentInstance;
    },
    _parseVElement: function(vElement, identifier, parentIdentifier, prevCompInstance, parentCompInstance) {
        var componentInstance = null;

        if (typeof vElement.type === "string") {
            componentInstance = this._handleDomComponent(vElement, identifier, parentIdentifier,
                                                         prevCompInstance, parentCompInstance);

        } else if (typeof vElement.type === "function") {
            componentInstance = this._handleRerenComponent(vElement, identifier, parentIdentifier,
                                                           prevCompInstance, parentCompInstance);
        }

        return componentInstance;
    }
};

class BaseController {
    constructor(update) {
        this.update = update;
        //this.onUpdate = function(){ };
        this.model = {};
    }

    update;
}

/**
 * Reren component that can be rendered in the DOM and that will have it's
 * own lifecycle
 * @param {Controller}             [The Controller of the component, required]
 * @param {View}                   [The View of the component that is responsible for returning virtual elements, required]
 */
var componentFactory = function(definition) {

    function RerenComponent(parentModel) {

        var init = () => {

            if (!this.view) {
                throw new Error("A component should always have a view!");
            }
            if (this.controller) {
                this.controller.prototype = new BaseController(this.updateComponent.bind(this));
                this.controller.constructor = this.controller;
                var ControllerConstructor = this.controller;
                this._controllerInstance = new ControllerConstructor(parentModel || {});
            }
        };

        this.getView = () => {
            var model = null;

            if (this._controllerInstance) {
                model = this._controllerInstance.model;
            }

            return this.view(model);
        };

        this.onComponentUpdate = (updatedParentModel) => {
            if (this._controllerInstance && this._controllerInstance.onUpdate) {
                this._controllerInstance.onUpdate(updatedParentModel);
            }
        };

        this.onComponentUnmount = () => {
            if (this._controllerInstance && this._controllerInstance.onUnmount) {
                this._controllerInstance.onUnmount();
            }
        };

        init();
    }

    RerenComponent.prototype = definition;
    RerenComponent.constructor = RerenComponent;
    objectAssign(definition, MountableRerenComponent);

    return RerenComponent;
};

/**
 * Factory method for creating a Reren component
 * @param  {object}         [The component definition (controller and view)]
 * @return {Component}      [The Reren component]
 */
module.exports = (definition) => {
    return componentFactory(definition);
};

module.exports.componentFactory = componentFactory;