var assert = require('assert');
var sinon = require('sinon');
var VElement = require('../src/vdom/vElement.js');
var domOperations = require('../src/vdom/domOperations');
var DomComponent = require('../src/components/domComponent');

describe('domComponent tests', () => {
    var defaultParentIdentifier = "1", defaultIdentifier = "1_1", operations = [], stub;

    describe('when mounting', () => {

        beforeEach(() => {
            stub = sinon.stub(domOperations, "applyDomChanges", (operation) => {
                operations.push(operation);
            });
        });

        it('it should create a new element with inner html', () => {

            var elementDefinition = new VElement("div", { classes: "myclass", onClick: function() {} }, "innerhtml" );

            var domComponent = new DomComponent(elementDefinition,
                                                defaultParentIdentifier,
                                                defaultIdentifier);

            domComponent.mount();

            assert.equal(operations.length, 3);
            assert.equal(operations[0] instanceof domOperations.InsertElement, true);
            assert.equal(operations[0].tagName, "div");
            assert.equal(operations[0].innerHtml, "innerhtml");
            assert.equal(operations[0].parentIdentifier, "1");
            assert.equal(operations[0].identifier, "1_1");

            assert.equal(operations[1] instanceof domOperations.SetAttribute, true);
            assert.equal(operations[1].attributeName, "class");
            assert.equal(operations[1].attributeValue, "myclass");

            assert.equal(operations[2] instanceof domOperations.AddEventListener, true);
            assert.equal(operations[2].identifier, "1_1");
            assert.equal(operations[2].eventName, "onClick");
            assert.notEqual(operations[2].handler, null);
        });

        it('it should update an attribute when updated', () => {

            var initialElement = new VElement("div", null, null);
            var updatedElement = new VElement("div", { classes: "myclass" }, null);

            var domComponent = new DomComponent(initialElement,
                                                defaultParentIdentifier,
                                                defaultIdentifier);

            domComponent.update(updatedElement);

            assert.equal(operations.length, 1);
            assert.equal(operations[0] instanceof domOperations.SetAttribute, true);
            assert.equal(operations[0].attributeName, "class");
            assert.equal(operations[0].attributeValue, "myclass");
            assert.equal(operations[0].identifier, "1_1");
        });

        it('it should update the inner html when updated', () => {

            var initialElement = new VElement("div", null, "foo");
            var updatedElement = new VElement("div", null, "bar");

            var domComponent = new DomComponent(initialElement,
                                                defaultParentIdentifier,
                                                defaultIdentifier);

            domComponent.update(updatedElement);

            assert.equal(operations.length, 1);
            assert.equal(operations[0] instanceof domOperations.SetInnerHtml, true);
            assert.equal(operations[0].innerHtml, "bar");
            assert.equal(operations[0].identifier, "1_1");
        });

        it('it should update an eventlistener when updated', () => {

            var initialElement = new VElement("div", null, null);
            var updatedElement = new VElement("div", { onClick: () => {} }, null);

            var domComponent = new DomComponent(initialElement,
                                                defaultParentIdentifier,
                                                defaultIdentifier);

            domComponent.update(updatedElement);

            assert.equal(operations.length, 1);
            assert.equal(operations[0] instanceof domOperations.AddEventListener, true);
            assert.equal(operations[0].identifier, "1_1");
            assert.equal(operations[0].eventName, "onClick");
            assert.notEqual(operations[0].handler, null);
        });

        it('it should remove the element when unmounted', () => {

            var initialElement = new VElement("div", null, "foo");

            var domComponent = new DomComponent(initialElement,
                                                defaultParentIdentifier,
                                                defaultIdentifier);

            domComponent.unmount();

            assert.equal(operations.length, 1);
            assert.equal(operations[0] instanceof domOperations.RemoveElement, true);
            assert.equal(operations[0].identifier, "1_1");
        });

        afterEach(() => {
            if (stub) {
                stub.restore();
            }
            operations = [];
        });
    });
});