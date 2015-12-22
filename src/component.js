var rerenUpdater = require('./vdom/rerenUpdater');


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
                var updater = () => { rerenUpdater.update(this); }
                this.controller.prototype = new BaseController(updater);
                this.controller.constructor = this.controller;
                var ctrl = new this.controller();
                this._controllerInstance = ctrl;
            }
        } 
        init();

        this.unMount = () => {
            if (this._controllerInstance) {
                if(this._controllerInstance.unMount) {
                    this._controllerInstance.unMount();
                }
                
                this._controllerInstance = null;

            }
            if(this.view) {
                this.view = null;
            }
        }

        this.getView = () => {
            var model = null;
            console.log(this._controllerInstance);
            if(this._controllerInstance) {
                
                model = this._controllerInstance.model;
            }
            
            return this.view(model);
        };
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