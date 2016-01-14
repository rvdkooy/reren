var objectAssign = require('../utils/objectAssign');
var variables = require('../variables');
var documentHelpers = require('../vdom/documentHelpers');
var DomComponent = require('./domComponent');

var RerenComponentMountable = {
    previousMountedDom: {},

    mount: function (identifier) {
        this.identifier = identifier;
        
        var parentIdentifier = identifier.substring(0, identifier.lastIndexOf("_"))
        
        var componentInstanceTree = this._parseElement(this.getView(), 
                                                        parentIdentifier,
                                                        identifier,
                                                        this.previousMountedDom);
        this.previousMountedDom = componentInstanceTree;
    },

    updateComponent: function() {
        var parentIdentifier = this.identifier.substring(0, this.identifier.lastIndexOf("_"))
        var newComponentInstanceTree = this._parseElement(this.getView(), 
                                                        parentIdentifier, 
                                                        this.identifier,
                                                        this.previousMountedDom);

        this.previousMountedDom = newComponentInstanceTree;
    },

    _parseElement: function (element, mountId, identifier, previousComponentInstance) {
        // check component instance against previous mounted dom
        
        var componentInstance = null;
        
        if (typeof element.type === "string") {
            
            if (!previousComponentInstance || previousComponentInstance.tagName !== element.type) {
                componentInstance = new DomComponent(element, mountId, identifier);
                // console.log("mounting new domcomponent");
                componentInstance.mount();

            } else {
                componentInstance = previousComponentInstance;
                // console.log("updating existing domcomponent");
                componentInstance.update(element);
            }
        } else if (typeof element.type === "function") {
            if (!previousComponentInstance) { // or changed !!
                componentInstance = new element.type();
                // console.log("mounting new reren component");
                componentInstance.mount(identifier);
            } else {
                console.log("not implemented yet");
            }
        }

        // removing children
        if ((element.children && element.children.length === 0) && (
            componentInstance.children && componentInstance.children.length > 0)) {
            
            for (var i = 0; i < componentInstance.children.length; i++) {
                var childrenToRemove = componentInstance.children.splice(i);
                childrenToRemove.forEach(x => x.unmount());
            };
        }

        // adding children
        if(element.children && element.children.length) {

            element.children.forEach((child, index) => {
                var componentInstanceChild = componentInstance.children[index];
                var childComponent = this._parseElement(child, 
                                                        identifier, 
                                                        identifier + "_" + (index + 1),
                                                        componentInstanceChild);

                componentInstance.addChild(childComponent);
            })
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
        this.model = {};
    }

    update;
};

/**
 * Reren component that can be rendered in the DOM and that will have it's
 * own lifecycle
 * @param {Controller}             [The Controller of the component, required]
 * @param {View}                   [The View of the component that is responsible for returning virtual elements, required]
 */
var ComponentFactory = function(definition) {
    
    function RerenComponent() {

        var init = () => {
            if (!this.view) {
                throw new Error("A component should always have a view!");
            }
            
            if (this.controller) {
                this.controller.prototype = new BaseController(this.updateComponent.bind(this));
                this.controller.constructor = this.controller;
                var ctrl = new this.controller();
                this._controllerInstance = ctrl;
            }
        } 

        this.getView = () => {
            var model = null;

            if(this._controllerInstance) {
                
                model = this._controllerInstance.model;
            }
            
            return this.view(model);
        };

        init();
    }

    RerenComponent.prototype = definition;
    RerenComponent.constructor = RerenComponent;
    objectAssign(definition, RerenComponentMountable);

    return RerenComponent;
};

/**
 * Factory method for creating a Reren component
 * @param  {object}         [The component definition (controller and view)]
 * @return {Component}      [The Reren component]
 */
module.exports = (definition) => {
    return ComponentFactory(definition);
};

module.exports.ComponentFactory = ComponentFactory;