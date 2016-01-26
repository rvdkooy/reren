var objectAssign = require('../utils/objectAssign');
var DomComponent = require('./domComponent');

var MountableRerenComponent = {
    _previousMountedDom: null,

    mount: function(identifier) {
        this.identifier = identifier;

        var parentIdentifier = identifier.substring(0, identifier.lastIndexOf("_"));
        var rootElement = this.getView();

        var newDom = this._parseElement(rootElement,
                            identifier,
                            parentIdentifier,
                            null,
                            null);

        this._previousMountedDom = newDom;
    },
    unmount: function() {
        // unmounting lo
    },
    updateComponent: function() {
        var parentIdentifier = this.identifier.substring(0, this.identifier.lastIndexOf("_"));
        var rootElement = this.getView();

        var newMountedDom = this._parseElement(rootElement,
                            this.identifier,
                            parentIdentifier,
                            this._previousMountedDom,
                            null);

        this._previousMountedDom = newMountedDom;
    },
    _handleDomComponentChildren: function(identifier, element, componentInstance) {
        // removing children
        if ((element.children && element.children.length === 0) && (
            componentInstance.children && componentInstance.children.length > 0)) {

            for (var i = 0; i < componentInstance.children.length; i++) {
                var childrenToRemove = componentInstance.children.splice(i);
                childrenToRemove.forEach(x => x.unmount());
            }
        }

        // traverse children
        if (element.children && element.children.length) {

            element.children.forEach((child, index) => {
                this._parseElement(child,
                                    identifier + "_" + (index + 1),
                                    identifier,
                                    componentInstance.children[index],
                                    componentInstance);
            });
        }
    },

    _parseElement: function(element, identifier, parentIdentifier, previousComponentInstance, parentComponentInstance) {
        var componentInstance = null;

        if (typeof element.type === "string") {
            var mountNewDomComponent = (el, parentId, id) => {
                var comp = new DomComponent(el, parentId, id);
                comp.mount();

                if (parentComponentInstance && parentComponentInstance.addChild) {
                    parentComponentInstance.addChild(comp);
                }

                return comp;
            };

            if (!previousComponentInstance) {

                componentInstance = mountNewDomComponent(element, parentIdentifier, identifier);

            } else {

                if (previousComponentInstance.tagName !== element.type) {

                    parentComponentInstance.removeChild(previousComponentInstance);
                    componentInstance = mountNewDomComponent(element, parentIdentifier, identifier);
                } else {

                    componentInstance = previousComponentInstance;
                    componentInstance.update(element);
                }
            }

            this._handleDomComponentChildren(identifier, element, componentInstance);

        } else if (typeof element.type === "function") {

            if (!previousComponentInstance) { // OR changed
                var ComponentConstructor = element.type;
                componentInstance = new ComponentConstructor();

                componentInstance.onComponentMount(element.attributes);
                componentInstance.mount(identifier);

                if (parentComponentInstance && parentComponentInstance.addChild) {
                    parentComponentInstance.addChild(componentInstance);
                }

            } else {
                componentInstance = previousComponentInstance;

                 // if (other) {
                //  componentInstance.unmount();
                // } else {
                //  update()
                // }

                componentInstance.onComponentUpdate(element.attributes);
                componentInstance.updateComponent();
            }
        }

        return componentInstance;
    }
};

/**
 * Base class for a Reren controller
 * every controller will be extended by this BaseController
 * so that it will have functions like "setViewModel()" and "update()"
 */
class BaseController {
    constructor(update) {
        this.update = update;
        //this.onUpdate = function(){ };
        this.model = {};
    }

    //onUpdate;

    update;
}

/**
 * Reren component that can be rendered in the DOM and that will have it's
 * own lifecycle
 * @param {Controller}             [The Controller of the component, required]
 * @param {View}                   [The View of the component that is responsible for returning virtual elements, required]
 */
var componentFactory = function(definition) {

    function RerenComponent() {

        var init = () => {
            if (!this.view) {
                throw new Error("A component should always have a view!");
            }
            if (this.controller) {
                this.controller.prototype = new BaseController(this.updateComponent.bind(this));
                this.controller.constructor = this.controller;
                var ControllerConstructor = this.controller;
                var ctrl = new ControllerConstructor();
                this._controllerInstance = ctrl;
            }
        };

        this.getView = () => {
            var model = null;

            if (this._controllerInstance) {
                model = this._controllerInstance.model;
            }

            return this.view(model);
        };

        this.onComponentMount = (parentModel) => {
            if (this._controllerInstance && this._controllerInstance.onMount) {
                this._controllerInstance.onMount(parentModel);
            }
        };

        this.onComponentUpdate = (parentModel) => {
            if (this._controllerInstance && this._controllerInstance.onUpdate) {
                this._controllerInstance.onUpdate(parentModel);
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