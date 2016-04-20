var sinon = require('sinon');
var assert = require('assert');
var domOperations = require('../src/vdom/domOperations');
var { InsertElement, SetInnerHtml, SetAttribute, RemoveElement } = require('../src/vdom/domOperations');
var VElement = require('../src/vdom/vElement.js');
var { componentFactory } = require('../src/components/rerenComponent.js');

describe("reren Component lifecycle tests", () => {

    var operations, stub;

    var interceptOperations = () => {
        operations.intercept = true;
    };

    beforeEach(() => {
        operations = [];
        stub = sinon.stub(domOperations, "applyDomChanges", (operation) => {
            if (!operations.intercept) return;
            operations.push(operation);
        });
    });

    describe("when mounting with a single rerenComponent", () => {
        var componentInstance;
        beforeEach(() => {
            interceptOperations();
            var Component = componentFactory({
                view: () => new VElement("div", null, new VElement("span", null, "some text"))
            });

            componentInstance = new Component();
            componentInstance.mount("1_1");
        });

        it("it's internal dom component state should be correct", () => {
            assert.deepEqual(componentInstance._previousMountedDom, {
                identifier: "1_1",
                parentIdentifier: "1",
                tagName: "div",
                attributes: {},
                _registeredEventListeners: {},
                children: [{
                    identifier: "1_1_1",
                    parentIdentifier: "1_1",
                    tagName: "span",
                    attributes: {},
                    children: [],
                    content: "some text",
                    _registeredEventListeners: {}
                }],
                content: null
            });
        });

        it("it should apply the correct dom operations", () => {
            assert.equal(operations.length, 2);
            assert(operations[0] instanceof InsertElement);
            assert.equal(operations[0].tagName, "div");
            assert(operations[1] instanceof InsertElement);
            assert.equal(operations[1].tagName, "span");
        });
    });

    describe("when mounting with a nested reren Component", () => {
        var controllerMounted = sinon.spy();
        var componentInstance;
        var NestedComponent;

        beforeEach(() => {
            interceptOperations();
            controllerMounted.reset();
            NestedComponent = componentFactory({
                controller: function(parentModel) {
                    controllerMounted(parentModel);
                },
                view: () => new VElement("span", null, "some text")
            });

            var Component = componentFactory({
                view: () => new VElement("div", null, new VElement(NestedComponent, { foo: "bar" }))
            });

            componentInstance = new Component();
            componentInstance.mount("1_1");
        });

        it("it's internal dom state should be correct", () => {
            assert.equal(componentInstance._previousMountedDom.identifier, "1_1");
            assert.equal(componentInstance._previousMountedDom.parentIdentifier, "1");
            assert.equal(componentInstance._previousMountedDom.tagName, "div");
            assert.deepEqual(componentInstance._previousMountedDom.attributes, {});
            assert.equal(componentInstance._previousMountedDom.content, null);

            assert.equal(componentInstance._previousMountedDom.children.length, 1);
            assert.equal(componentInstance._previousMountedDom.children[0] instanceof NestedComponent, true);
            assert.equal(componentInstance._previousMountedDom.children[0]._previousMountedDom.identifier, "1_1_1");
            assert.equal(componentInstance._previousMountedDom.children[0]._previousMountedDom.parentIdentifier, "1_1");
        });

        it("it should pass the parent model to the nested component", () => {
            assert(controllerMounted.calledOnce);
            assert(controllerMounted.calledWith({ foo: "bar" }));
        });

        it("it should apply the correct dom operations", () => {
            assert.equal(operations.length, 2);
            assert(operations[0] instanceof InsertElement);
            assert.equal(operations[0].tagName, "div");
            assert(operations[1] instanceof InsertElement);
            assert.equal(operations[1].tagName, "span");
        });
    });

    describe("When mounted and not changing any component", () => {

        it("it should not do anything", () => {
            var Component = componentFactory({
                view: () => new VElement("div", null, new VElement("span", null, "some text"))
            });

            var componentInstance = new Component();
            componentInstance.mount("1_1");
            interceptOperations();

            componentInstance.updateComponent();
            assert.equal(operations.length, 0);
        });
    });

    describe("when mounted and changing a domcomponent", () => {
        var componentInstance;

        beforeEach(() => {
            var Component = componentFactory({
                view: () => {
                    return new VElement("div", null,
                        new VElement("span", null, "some text"));
                }
            });

            componentInstance = new Component();
            componentInstance.mount("1_1");
            interceptOperations();
        });

        it("it should update the innerHtml if the content has changed", () => {

            componentInstance.view = function updatedView() {
                return new VElement("div", null,
                    new VElement("span", null, "updated text"));
            };

            componentInstance.updateComponent();

            assert.equal(operations.length, 1);
            assert(operations[0] instanceof SetInnerHtml);
            assert.equal(componentInstance._previousMountedDom.children[0].content, "updated text");
        });

        it("it should update the attributes if the attributes have changed", () => {

            componentInstance.view = function updatedView() {
                return new VElement("div", null,
                    new VElement("span", { id: "my_id" }, "some text"));
            };

            componentInstance.updateComponent();

            assert.equal(operations.length, 1);
            assert(operations[0] instanceof SetAttribute);
            assert.equal(componentInstance._previousMountedDom.children[0].attributes.id, "my_id");
        });

        it("it should remove the domcomponent if it is not present anymore", () => {

            componentInstance.view = () => new VElement("div");
            componentInstance.updateComponent();

            assert.equal(operations.length, 1);
            assert(operations[0] instanceof RemoveElement);
            assert(operations[0].identifier, "1_1_1");
            assert(operations[0].parentIdentifier, "1_1");
            assert.equal(componentInstance._previousMountedDom.children.length, 0);
        });
    });

    describe("when mounted and changing the children", () => {
        var componentInstance;

        var mountAndInterceptOperations = (viewResult) => {
            var Component = componentFactory({
                view: () => {
                    return viewResult;
                }
            });

            componentInstance = new Component();
            componentInstance.mount("1_1");
            interceptOperations();
        };

        it("it should add children when there are children added", () => {

            mountAndInterceptOperations(new VElement("ul"));
            componentInstance.view = function updatedView() {
                return new VElement("ul", null, [
                    new VElement("li", null, "1"),
                    new VElement("li", null, "2")
                ]);
            };

            componentInstance.updateComponent();

            assert.equal(operations.length, 2);
            assert(operations[0] instanceof InsertElement);
            assert.equal(operations[0].tagName, "li");
            assert(operations[1] instanceof InsertElement);
            assert.equal(operations[1].tagName, "li");
            assert.equal(componentInstance._previousMountedDom.children[0].content, "1");
            assert.equal(componentInstance._previousMountedDom.children[1].content, "2");
        });

        it("it should remove children when there are children removed", () => {

            mountAndInterceptOperations(new VElement("ul", null, [
                new VElement("li", null, "1"),
                new VElement("li", null, "2")
            ]));
            componentInstance.view = function updatedView() {
                return new VElement("ul", null, [
                    new VElement("li", null, "2")
                ]);
            };

            componentInstance.updateComponent();
            assert.equal(operations.length, 3);
            assert(operations[0] instanceof RemoveElement);
            assert.equal(operations[0].identifier, "1_1_1");
            assert.equal(operations[0].parentIdentifier, "1_1");

            assert(operations[1] instanceof RemoveElement);
            assert.equal(operations[1].identifier, "1_1_2");
            assert.equal(operations[1].parentIdentifier, "1_1");

            assert(operations[2] instanceof InsertElement);
            assert.equal(operations[2].tagName, "li");
            assert.equal(operations[2].innerHtml, "2");

            assert.equal(componentInstance._previousMountedDom.children[0].content, "2");
        });
    });

    describe("when mounted and changing with a nested rerenComponent in it", () => {
        var controllerUpdateSpy = sinon.spy(),
            viewUpdateSpy = sinon.spy(),
            componentInstance;

        var NestedComponent = componentFactory({
            controller: function() {
                this.onUpdate = (parentModel) => controllerUpdateSpy(parentModel);
            },
            view: () => {
                viewUpdateSpy();
                return new VElement("span", null, "some text");
            }
        });

        beforeEach(() => {
            controllerUpdateSpy.reset();
            viewUpdateSpy.reset();

            var RootComponent = componentFactory({
                view: () => new VElement("div", null, new VElement(NestedComponent, { foo: "bar" }))
            });

            componentInstance = new RootComponent();
            componentInstance.mount("1_1");
            interceptOperations();

            componentInstance.updateComponent();
        });

        it("it should notify the nested component by calling the onUpdate", () => {
            assert(controllerUpdateSpy.calledOnce);
            assert(controllerUpdateSpy.calledWith({ foo: "bar" }));
        });

        it("it should update the view of the nested component", () => {
            assert(viewUpdateSpy.calledTwice);
        });
    });

    describe("when not using a mounted dom component anymore", () => {
        var componentInstance;

        beforeEach(() => {
            var RootComponent = componentFactory({
                view: () => new VElement("div", null, new VElement("h1"))
            });

            componentInstance = new RootComponent();
            componentInstance.mount("1_1");
            interceptOperations();

            componentInstance.view = () => new VElement("div", null, new VElement("h2"));
            componentInstance.updateComponent();
        });

        it("it should unmount the previous component", () => {
            assert.equal(operations.length, 2);
            assert(operations[0] instanceof RemoveElement);
            assert(operations[0].identifier, "1_1_1");
            assert(operations[0].parentIdentifier, "1_1");

            assert.equal(componentInstance._previousMountedDom.children.length, 1);
            assert.equal(componentInstance._previousMountedDom.children[0].tagName, "h2");
            assert(operations[1] instanceof InsertElement);
            assert.equal(operations[1].tagName, "h2");
        });
    });

    describe("when not using nested mounted components anymore", () => {
        var firstControllerUnmountSpy = sinon.spy(),
            secondControllerUnmountSpy = sinon.spy(),
            componentInstance;

        var NestedComponentTwo = componentFactory({
            controller: function() {
                this.onUnmount = () => secondControllerUnmountSpy();
            },
            view: () => new VElement("div", null, "second nested component")
        });

        var NestedComponentOne = componentFactory({
            controller: function() {
                this.onUnmount = () => firstControllerUnmountSpy();
            },
            view: () => new VElement("span", null, new VElement(NestedComponentTwo))
        });

        beforeEach(() => {
            firstControllerUnmountSpy.reset();
            secondControllerUnmountSpy.reset();

            var RootComponent = componentFactory({
                view: () => new VElement("div", null, new VElement(NestedComponentOne))
            });

            componentInstance = new RootComponent();
            componentInstance.mount("1_1");
            interceptOperations();

            componentInstance.view = () => new VElement("div", null, new VElement("span", null, "updated text"));
            componentInstance.updateComponent();
        });

        it("it should unmount the first nested reren component", () => {
            assert(firstControllerUnmountSpy.calledOnce);
        });

        it("it should unmount the second nested reren component", () => {
            assert(secondControllerUnmountSpy.calledOnce);
        });
    });

    describe("when replacing a nested reren component with another reren component", () => {
        var controllerUnmountSpy = sinon.spy(),
            controllerMountSpy = sinon.spy();

        var NestedComponentOne = componentFactory({
            controller: function() {
                this.onUnmount = () => controllerUnmountSpy();
            },
            view: () => new VElement("span", null, "first nested component")
        });

        var NestedComponentTwo = componentFactory({
            controller: function() {
                controllerMountSpy();
            },
            view: () => new VElement("div", null, "second nested component")
        });

        beforeEach(() => {
            controllerUnmountSpy.reset();
            controllerMountSpy.reset();

            var RootComponent = componentFactory({
                view: () => new VElement("div", null, new VElement(NestedComponentOne))
            });

            var componentInstance = new RootComponent();
            componentInstance.mount("1_1");
            interceptOperations();

            componentInstance.view = () => new VElement("div", null, new VElement(NestedComponentTwo));
            componentInstance.updateComponent();
        });

        it("it should unmount the previous nested reren component", () => {
            assert(controllerUnmountSpy.calledOnce);
        });

        it("it should mount the new nested reren component", () => {
            assert(controllerMountSpy.calledOnce);
        });
    });

    afterEach(() => {
        if (stub) {
            stub.restore();
        }
        interceptOperations();
    });
});