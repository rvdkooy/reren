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
class Component {
	
	constructor(Controller, view) {
		if (!view) {
			throw new Error("A component should always have a view!");
		}

		this._view = view;
		this._controller = Controller;
	}
	update() {
		rerenUpdater.update(this);
	}

	createInstance() {
		if (this._controller) {
			var updater = () => { rerenUpdater.update(this); }
			this._controller.prototype = new BaseController(updater);
			this._controller.constructor = this._controller;
			var ctrl = new this._controller();
			this._controllerInstance = ctrl;	
		}
		return this;
	}

    getView() {
    	var viewModel = null;
    	if(this._controllerInstance) {
    		viewModel = this._controllerInstance.getViewModel();
    	}
        
        var rootvElement = this._view(viewModel);
        
        rootvElement.componentInstance = this;
        
        return rootvElement;
    };
};

/**
 * Factory method for creating a Reren component
 * @param  {object} 		[The component definition (controller and view)]
 * @return {Component}      [The Reren component]
 */
module.exports = (definition) => {
	return new Component(definition.controller, definition.view);
};

module.exports.Component = Component;

