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
    
    it("it should hold it's own mounted dom & apply the InsertElement operation when mounted", () => {
        var Component = ComponentFactory({
            view: () => {
                return new VElement("div", null, null);
            }
        });
        var componentInstance = new Component();
        componentInstance.mount("1_1");

        assert.deepEqual(componentInstance._previousMountedDom, {
            identifier: "1_1",
            parentIdentifier: "1",
            tagName: "div",
            attributes: null,
            children: [],
            content: null
        });
        assert.equal(operations.length, 1);
        assert(operations[0] instanceof InsertElement);
    });

    afterEach(() => {
        if(stub) {
            stub.restore();
        }
        operations = [];
    });
});