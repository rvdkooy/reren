var rerenUpdater = require('./vdom/rerenUpdater');
var DomComponent = require('./vdom/components/domComponent');

var variables = require('./variables');

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
var Component = function(definition) {
    
    function ComponentConstructor() {

        var init = () => {
            if (!this.view) {
                throw new Error("A component should always have a view!");
            }
            
            if (this.controller) {
                this.controller.prototype = new BaseController(this.updateComponent);
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
        
        this.previousMountedDom = {};

        this.mount = (identifier) => {
            this.indentifier = identifier;
            
            var parentIdentifier = identifier.substring(0, identifier.lastIndexOf("_"))
            
            var componentInstanceTree = this._parseElement(this.getView(), 
                                                            parentIdentifier,
                                                            identifier,
                                                            this.previousMountedDom);
            this.previousMountedDom = componentInstanceTree;
        };

        this.updateComponent = () => {
            
            var newComponentInstanceTree = this._parseElement(this.getView(), 
                                                            this.indentifier, 
                                                            this.indentifier + "_1",
                                                            this.previousMountedDom);

            this.previousMountedDom = newComponentInstanceTree;
        };

        this._parseElement = (element, mountId, identifier, previousComponentInstance) => {
            // check component instance against previous mounted dom
            
            var componentInstance = null;
            
            if (typeof element.type === "string") {
                if (!previousComponentInstance || previousComponentInstance.tagName !== element.type) {
                    componentInstance = new DomComponent(element, mountId, identifier);
                    componentInstance.mount();
                } else {
                    componentInstance = previousComponentInstance;

                    if (element.content !== componentInstance.content) {
                        componentInstance.update(element);

                    }
                }
            } else if (typeof element.type === "function") {
                if (!previousComponentInstance) { // or changed !!
                    componentInstance = new element.type();
                    componentInstance.mount(identifier);
                } else {
                    console.log("fsdsfs");
                }
            }

            // handle children
            if(element.children && element.children.length) {

                // cleaing up children if needed!!!

                element.children.forEach((child, index) => {
                    var xchild = componentInstance.children[index];
                    var childComponent = this._parseElement(child, 
                                                            identifier, 
                                                            identifier + "_" + (index + 1),
                                                            xchild);
                    
                    componentInstance.addChild(childComponent);
                })
            }

            return componentInstance;
        }

        init();
    }
    ComponentConstructor.prototype = definition;
    ComponentConstructor.constructor = ComponentConstructor;
    return ComponentConstructor;
};



/**
 * Factory method for creating a Reren component
 * @param  {object}         [The component definition (controller and view)]
 * @return {Component}      [The Reren component]
 */
module.exports = (definition) => {
    return Component(definition);
};

module.exports.Component = Component;