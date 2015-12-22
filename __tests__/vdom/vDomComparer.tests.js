var VElement = require('../../src/vdom/vElement.js');
var vDomComparer = require('../../src/vdom/vDomComparer');
var assert = require('assert');
var { Component } = require('../../src/component.js');
var { InsertElement, SetInnerHtml, SetAttribute } = require('../../src/vdom/domOperations');

describe('vDomComparer tests', function() {

    describe('Preparing for comparison tests', function() {
        it('it should decorate all virtual elements with identifiers', function() {
            
            var elementToPrepare = new VElement("div", null, [
                                        new VElement("div"),
                                        new VElement("div")
                                    ]);

            vDomComparer.prepareForComparison(elementToPrepare, "1_1");

            assert.equal(elementToPrepare.identifier, "1_1");
            assert.equal(elementToPrepare.children[0].identifier, "1_1_1");
            assert.equal(elementToPrepare.children[1].identifier, "1_1_2");
        });

        it('it should decorate a componentInstance with an identifier', function() {
            
            var component = Component({
                view: function() { return new VElement("span"); }
            });

            var elementToPrepare = new VElement("div", null, new VElement(component));

            vDomComparer.prepareForComparison(elementToPrepare, "1_1");

            assert.equal(elementToPrepare.identifier, "1_1");
            assert.equal(elementToPrepare.children[0].componentInstance.identifier, "1_1_1");
            assert.equal(elementToPrepare.children[0].identifier, "1_1_1");
        });
    });

    describe('comparison tests', function() {
        it('it should return an insert operation when a dom element did not exist before', function () {
              var currentElement = new VElement("div", { classnames: "myclass" }, "some text");

              var operations = vDomComparer.getChanges(currentElement, null, "1_1");

              assert.equal(operations.length, 1);
              assert.equal(operations[0] instanceof InsertElement, true);
              assert.equal(operations[0].parentId, "1");
              assert.equal(operations[0].identifier, "1_1");
              assert.equal(operations[0].tagName, "div");
              assert.equal(operations[0].attributes.classnames, "myclass");
              assert.equal(operations[0].children.length, 0);
        });

        it('it should return a setInnerHTML operation when the innerHTML changed of a vElement', function () {
              var currentElement = new VElement("div", null, "some text changed");
              var prevElement = new VElement("div", null, "some text");
              
              var operations = vDomComparer.getChanges(currentElement, prevElement, "1_1");
              
              assert.equal(operations.length, 1);
              assert.equal(operations[0] instanceof SetInnerHtml, true);
              assert.equal(operations[0].identifier, "1_1");
              assert.equal(operations[0].innerHtml, "some text changed");
        });

        it('it should return a set attribute operation when the previous vElement did not have any attributes', function () {
              var currentElement = new VElement("div", { classes: "mynewclass" });
              var prevElement = new VElement("div", null);
              
              var operations = vDomComparer.getChanges(currentElement, prevElement, "1_1");
              
              assert.equal(operations.length, 1);
              assert.equal(operations[0] instanceof SetAttribute, true);
              assert.equal(operations[0].identifier, "1_1");
              assert.equal(operations[0].attributeName, "class");
              assert.equal(operations[0].attributeValue, "mynewclass");
        });

        it('it should return a set attribute operation when the previous vElement attributes changed', function () {
              var currentElement = new VElement("div", { style: "newstyles" });
              var prevElement = new VElement("div", { style: "mystyles" });
              
              var operations = vDomComparer.getChanges(currentElement, prevElement, "1_1");
              
              assert.equal(operations.length, 1);
              assert.equal(operations[0] instanceof SetAttribute, true);
              assert.equal(operations[0].identifier, "1_1");
              assert.equal(operations[0].attributeName, "style");
              assert.equal(operations[0].attributeValue, "newstyles");
        });
    });
});