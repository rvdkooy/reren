var objectAssign = require('../utils/objectAssign');
var DomComponent = require('./domComponent');

var MountableRerenComponent = {
    _previousMountedDom: null,


    mount: function(identifier) {
        this.identifier = identifier;

        var parentIdentifier = identifier.substring(0, identifier.lastIndexOf("_"));
        var rootElement = this.getView();

        this._previousMountedDom = this._parseElement(rootElement,
                                                        identifier,
                                                        parentIdentifier,
                                                        null,
                                                        null);

    },


    unmount: function() {
        this.onComponentUnmount();
        this._previousMountedDom.unmount(true)
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
                childrenToRemove.forEach(x => x.unmount(true));
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


    _handleDomComponent: function(element, identifier, parentIdentifier, previousComponentInstance, parentComponentInstance) {
        var domComponentInstance;

        var mountNewDomComponent = (el, parentId, id) => {
            var domComponent = new DomComponent(el, parentId, id);
            domComponent.mount();

            if (parentComponentInstance) {
                parentComponentInstance.addChild(domComponent);
            }

            return domComponent;
        };

        if (!previousComponentInstance) {

            domComponentInstance = mountNewDomComponent(element, parentIdentifier, identifier);

        } else {

            if (previousComponentInstance.tagName !== element.type) {

                parentComponentInstance.removeChild(previousComponentInstance);

                previousComponentInstance.unmount(true);

                domComponentInstance = mountNewDomComponent(element, parentIdentifier, identifier);
            } else {

                domComponentInstance = previousComponentInstance;
                domComponentInstance.update(element);
            }
        }

        this._handleDomComponentChildren(identifier, element, domComponentInstance);

        return domComponentInstance;
    },


    _handleRerenComponent: function(element, identifier, parentIdentifier, previousComponentInstance, parentComponentInstance) {
        var rerenComponentInstance;
        if (!previousComponentInstance) {
            var ComponentConstructor = element.type;
            rerenComponentInstance = new ComponentConstructor();

            rerenComponentInstance.onComponentMount(element.attributes);
            rerenComponentInstance.mount(identifier);

            if (parentComponentInstance) {
                parentComponentInstance.addChild(rerenComponentInstance);
            }

        } else {
            rerenComponentInstance = previousComponentInstance;
             // if (other) {
            //  componentInstance.unmount();
            // } else {
            //  update()
            // }

            rerenComponentInstance.onComponentUpdate(element.attributes);
            rerenComponentInstance.updateComponent();
        }
        return rerenComponentInstance;
    },
    _parseElement: function(element, identifier, parentIdentifier, previousComponentInstance, parentComponentInstance) {
        var componentInstance = null;

        if (typeof element.type === "string") {
            componentInstance = this._handleDomComponent(element,
                                                         identifier,
                                                         parentIdentifier,
                                                         previousComponentInstance,
                                                         parentComponentInstance);

        } else if (typeof element.type === "function") {
            componentInstance = this._handleRerenComponent(element,
                                                           identifier,
                                                           parentIdentifier,
                                                           previousComponentInstance,
                                                           parentComponentInstance);
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