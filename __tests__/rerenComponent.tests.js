var VElement = require('../src/vdom/vElement.js');
var { ComponentFactory } = require('../src/components/rerenComponent.js');
var assert = require('assert');

describe("RerenComponent tests", function() {

    it("it should throw when creating a component without a view", () => {
        
        assert.throws(() => {
            var componentDef = ComponentFactory({});
            var componentInstance = new componentDef();
        }, (err) => {
            return /have a view!/.test(err);
        }, Error);
    });

    it("it should return the view from the component when defined", () => {
        var rootElement = new VElement("div");
        var componentDef = ComponentFactory({
            view: () => {
                return rootElement;
            }
        });

        var componentInstance = new componentDef();
        assert.equal(componentInstance.getView(), rootElement);
    });

    it("it should return the controller from the component when defined", () => {
        var componentDef = ComponentFactory({
            view: () => { return new VElement("div"); },
            controller: () => {}
        });
        var componentInstance = new componentDef();
        
        assert.notEqual(componentInstance._controllerInstance, undefined);
        assert.deepEqual(componentInstance._controllerInstance.model, {});
    });

    it("it should pass the model from the controller to the view when defined", () => {
        var passedModel;
        var componentDef = ComponentFactory({
            view: (model) => { 
                passedModel = model;
                return new VElement("div"); 
            },
            controller: function(){
                this.model.prop = "value";
            }
        });
        var componentInstance = new componentDef();
        componentInstance.getView();
        assert.equal(passedModel.prop, "value");
    });
});