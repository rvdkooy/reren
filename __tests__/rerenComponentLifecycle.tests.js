var sinon = require('sinon');
var assert = require('assert');
var domOperations = require('../src/vdom/domOperations');
var { InsertElement } = require('../src/vdom/domOperations');
var VElement = require('../src/vdom/vElement.js');
var { ComponentFactory } = require('../src/components/rerenComponent.js');

describe("reren Component lifecycle tests", () => {
    
    var cleanUpDom, operations = [], stub;

    beforeEach(() => {
        stub = sinon.stub(domOperations, "applyDomChanges", (operation) => {
            operations.push(operation);
        });
    });
    
    describe("when mounting with a single rerenComponent", () => {
        var componentInstance;
        beforeEach(() => {
            var Component = ComponentFactory({
                view: () => {
                    return new VElement("div", null, 
                        new VElement("span", null, "some text"));
                }
            });
            
            componentInstance = new Component();
            componentInstance.mount("1_1");
        });

        it("it's internal dom component state should be correct", () => {
            assert.deepEqual(componentInstance._previousMountedDom, {
                identifier: "1_1",
                parentIdentifier: "1",
                tagName: "div",
                attributes: null,
                children: [{
                    identifier: "1_1_1",
                    parentIdentifier: "1_1",
                    tagName: "span",
                    attributes: null,
                    children: [],
                    content: "some text"
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
        var componentInstance;
        var NestedComponent;
        beforeEach(() => {
            NestedComponent = ComponentFactory({
                view: () => {
                    return new VElement("span", null, "some text");
                }
            });

            var Component = ComponentFactory({
                view: () => {
                    return new VElement("div", null, 
                        new VElement(NestedComponent));
                }
            });
            
            componentInstance = new Component();
            componentInstance.mount("1_1");
        });

        it("it's internal dom state should be correct", () => {
            assert.equal(componentInstance._previousMountedDom.identifier, "1_1");
            assert.equal(componentInstance._previousMountedDom.parentIdentifier, "1");
            assert.equal(componentInstance._previousMountedDom.tagName, "div");
            assert.equal(componentInstance._previousMountedDom.attributes, null);
            assert.equal(componentInstance._previousMountedDom.content, null);
            
            assert.equal(componentInstance._previousMountedDom.children.length, 1);
            assert.equal(componentInstance._previousMountedDom.children[0] instanceof NestedComponent, true);
            assert.equal(componentInstance._previousMountedDom.children[0]._previousMountedDom.identifier, "1_1_1");
            assert.equal(componentInstance._previousMountedDom.children[0]._previousMountedDom.parentIdentifier, "1_1");
            
        });

        it("it should apply the correct dom operations", () => {
            assert.equal(operations.length, 2);
            assert(operations[0] instanceof InsertElement);
            assert.equal(operations[0].tagName, "div");
            assert(operations[1] instanceof InsertElement);
            assert.equal(operations[1].tagName, "span");
        });
    });

    afterEach(() => {
        if(stub) {
            stub.restore();
        }
        operations = [];
    });
});