var assert = require('assert');
var sinon = require('sinon');
var VElement = require('../src/vdom/vElement.js');
var DomComponent = require('../src/components/domComponent');
var domOperations = require('../src/vdom/domOperations');
var { InsertElement } = require('../src/vdom/domOperations');

describe('domComponent tests', () => {
    var defaultParentId = "1";
    var defaultIdentifier = "1_1"

    describe('when mounting', () => {
        var domApplier, operations = [];
        
        beforeEach(() => {
            domApplier = (operation) => {
                operations.push(operation);
            };
        });

        it('it should create a new element with inner html', () => {
            var elementDefinition = new VElement("div", { classes: "myclass" }, "innerhtml" );
            var domComponent = new DomComponent(elementDefinition, 
                                                defaultParentId, 
                                                defaultIdentifier,
                                                domApplier);

            domComponent.mount();

            assert.equal(operations.length, 1);
            assert.equal(operations[0] instanceof InsertElement, true);
            assert.equal(operations[0].tagName, "div");
            assert.deepEqual(operations[0].attributes, { classes: "myclass" });
            assert.equal(operations[0].innerHtml, "innerhtml");
            assert.equal(operations[0].parentId, "1");
            assert.equal(operations[0].identifier, "1_1");
        });

        afterEach(() => {
            operations = [];
        });
    });
});