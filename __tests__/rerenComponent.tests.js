var VElement = require('../src/vdom/vElement.js');
var { componentFactory } = require('../src/components/rerenComponent.js');
var assert = require('assert');
var sinon = require('sinon');

describe("RerenComponent tests", function () {

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
      controller: () => { }
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
      controller: function () {
        this.model.prop = "value";
      }
    });
    var componentInstance = new ComponentDefinition();
    componentInstance.getView();
    assert.equal(passedModel.prop, "value");
  });

  it("it should get the model from the definition when defined as getReactiveModel", () => {
    var passedModel;
    var ComponentDefinition = componentFactory({
      view: (model) => {
        passedModel = model;
        return new VElement("div");
      },
      getReactiveModel: function () {
        return { prop: 'value' };
      },
      controller: function () {
      }
    });
    var componentInstance = new ComponentDefinition();
    componentInstance.getView();
    assert.equal(passedModel.prop, "value");
  });

  it("it should auto update the component when the reactive model changes", () => {
    var ComponentDefinition = componentFactory({
      view: () => {
        return new VElement("div");
      },
      getReactiveModel: function () {
        return { prop: 'value' };
      },
      controller: function () {
      }
    });
    var updateComponentSpy = sinon.stub(ComponentDefinition.prototype, 'updateComponent');
    var componentInstance = new ComponentDefinition();
    componentInstance._controllerInstance.model.prop = 'value 2';
    assert(updateComponentSpy.calledOnce);
    assert.equal(componentInstance._controllerInstance.model.prop, 'value 2');
  });
});