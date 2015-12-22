var VElement = require('../src/vdom/vElement.js');
var assert = require('assert');
var { Component } = require('../src/component.js');

describe("Component tests", function() {

    it("It should throw when creating a component without a view", () => {
        
        assert.throws(() => {
            var componentDef = Component({});
            var componentInstance = new componentDef();
        }, (err) => {
            return /have a view!/.test(err);
        }, Error);
    });

    it("It should return the view from the component when defined", () => {
        var rootElement = new VElement("div");
        var componentDef = Component({
            view: () => {
                return rootElement;
            }
        });
        var componentInstance = new componentDef();
        assert.equal(componentInstance.getView(), rootElement);
    });

    it("It should return the controller from the component when defined", () => {
        var componentDef = Component({
            view: () => { return new VElement("div"); },
            controller: () => {}
        });
        var componentInstance = new componentDef();
        
        assert.notEqual(componentInstance._controllerInstance, undefined);
        assert.deepEqual(componentInstance._controllerInstance.model, {});
    });

    it("It should pass the model from the controller to the view when defined", () => {
        var passedModel;
        var componentDef = Component({
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