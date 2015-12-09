/**
 * Base class for a Reren controller
 * every controller will be extended by this BaseController
 * so that it will have functions like "setViewModel()" and "update()"
 */
class BaseController {
	constructor(reRender) {
		this._reRender = reRender;
	}

	setViewModel(model) {
        if (!model) {
        	throw new Error("view model should be defined!");
        }

        this._model = model;
    };
    
    getViewModel() {
    	return this._model;
    }

    // experimental...
    update() {
    	this._reRender();
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

		if (Controller) {
			Controller.prototype = new BaseController();
			Controller.constructor = Controller;
			var ctrl = new Controller();

			this._controller = ctrl;	
		}
		
		this._view = view;
	}

    getView() {
    	var viewModel = null;
    	if(this._controller) {
    		viewModel = this._controller.getViewModel();
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

