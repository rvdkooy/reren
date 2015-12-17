var VElement = require('../../src/vdom/vElement.js');
var vDomComparer = require('../../src/vdom/vDomComparer');
var assert = require('assert');
var { Component } = require('../../src/component.js');
var { InsertElement, SetInnerHtml } = require('../../src/vdom/domOperations');

describe('vDomComparer tests', function() {
  
	it('it should return an insert operation when a dom element did not exist before', function () {
	  	var vElementOne = new VElement("div", { classnames: "myclass" }, "some text");
	  	
	  	var operations = vDomComparer.getChanges(vElementOne, null, "1_1");

	  	assert.equal(operations.length, 1);
	  	assert.equal(operations[0] instanceof InsertElement, true);
	  	assert.equal(operations[0].parentId, "1");
	  	assert.equal(operations[0].identifier, "1_1");
	  	assert.equal(operations[0].tagName, "div");
	  	assert.equal(operations[0].attributes.classnames, "myclass");
	  	assert.equal(operations[0].children.length, 0);
	});

	xit('it should return a setInnerHTML operation when the innerHTML changed of a vElement', function () {
	  	var vElementOne = new VElement("div", null, "some text");
	  	var vElementTwo = new VElement("div", null, "some text changed");
	  	
	  	var operations = vDomComparer.getChanges(vElementOne, vElementTwo, "1_1");
	  	
	  	assert.equal(operations.length, 1);
	  	assert.equal(operations[0] instanceof SetInnerHtml, true);
	  	assert.equal(operations[0].identifier, "1_1");
	  	assert.equal(operations[0].innerHTML, "some text changed");
	});
});