var VElement = require('../src/vdom/vElement.js');
var { componentFactory } = require('../src/components/rerenComponent.js');
var assert = require('assert');

describe("RerenComponent tests", function() {

    it("it should throw when creating a component without a view", () => {

        assert.throws(() => {
            var Component = componentFactory({});
            /*eslint-disable no-unused-vars*/
            var instance = new Component();
            /*eslint-enable no-unused-vars*/
        }, (err) => {
            return /have a view!/.test(err);
        }, Error);
    });

    it("it should return the view from the component when defined", () => {
        var rootElement = new VElement("div");
        var ComponentDefinition = componentFactory({
            view: () => {
                return rootElement;
            }
        });

        var componentInstance = new ComponentDefinition();
        assert.equal(componentInstance.getView(), rootElement);
    });

    it("it should return the controller from the component when defined", () => {
        var ComponentDefinition = componentFactory({
            view: () => { return new VElement("div"); },
            controller: () => {}
        });
        var componentInstance = new ComponentDefinition();

        assert.notEqual(componentInstance._controllerInstance, undefined);
        assert.deepEqual(componentInstance._controllerInstance.model, {});
    });

    it("it should pass the model from the controller to the view when defined", () => {
        var passedModel;
        var ComponentDefinition = componentFactory({
            view: (model) => {
                passedModel = model;
                return new VElement("div");
            },
            controller: function() {
                this.model.prop = "value";
            }
        });
        var componentInstance = new ComponentDefinition();
        componentInstance.getView();
        assert.equal(passedModel.prop, "value");
    });
});