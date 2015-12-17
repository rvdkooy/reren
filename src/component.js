var rerenUpdater = require('./vdom/rerenUpdater');


/**
 * Base class for a Reren controller
 * every controller will be extended by this BaseController
 * so that it will have functions like "setViewModel()" and "update()"
 */
class BaseController {
	constructor(update) {
		this.update = update;
	}

	setViewModel(model) {
        if (!model) {
        	throw new Error("view model should be defined!");
        }

        this._model = model;
    };
    update;

    getViewModel() {
    	return this._model;
    }
};

/**
 * Reren component that can be rendered in the DOM and that will have it's
 * own lifecycle
 * @param {Controller} 			[The Controller of the component, required]
 * @param {View}       			[The View of the component that is responsible for returning virtual elements, required]
 */
var Component = function(definition) {
	
    function ComponentConstructor() {
    	var self = this;
    	
    	function init() {
    		
    		console.log('initing');
    		if (!self.view) {
    			throw new Error("A component should always have a view!");
    		}
    		
    		if (self.controller) {
    			var updater = () => { rerenUpdater.update(self); }
    			self.controller.prototype = new BaseController(updater);
    			self.controller.constructor = self.controller;
    			var ctrl = new self.controller();
    			self._controllerInstance = ctrl;
    		}
    	} 
    	init();

    	this.update = () => {
    		rerenUpdater.update(this);
    	}

    	this.getView =() => {
    		var viewModel = null;
    		
    		if(this._controllerInstance) {
    			viewModel = this._controllerInstance.getViewModel();
    		}
    	    
    	    var rootvElement = this.view(viewModel);
    	    
    	    rootvElement.componentInstance = this;
    	    
    	    return rootvElement;
    	};
    }

    ComponentConstructor.prototype = definition;
    ComponentConstructor.constructor = ComponentConstructor;
    return ComponentConstructor;
};

/**
 * Factory method for creating a Reren component
 * @param  {object} 		[The component definition (controller and view)]
 * @return {Component}      [The Reren component]
 */
module.exports = (definition) => {
	return Component(definition);
};

module.exports.Component = Component;