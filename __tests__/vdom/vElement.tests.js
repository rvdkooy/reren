var VElement = require('../../src/vdom/vElement.js');
var assert = require('assert');
var { Component } = require('../../src/component.js');

describe('vElement tests', function() {
  
	it('it should be able to create a vElement with content as inner html', function () {
	  	var vElement = new VElement("div", { classnames: "myclass" }, "some text");

	  	assert.equal(vElement.tagName, "div");
	  	assert.equal(vElement.attributes.classnames, "myclass");
	  	assert.equal(vElement.content, "some text");
	});

	it('it should be able to create a vElement with another vElement a child', function () {
	  	var childvirtualElement = new VElement("div", null, "some text");
	  	var vElement = new VElement("div", null, childvirtualElement);

	  	assert.equal(vElement.tagName, "div");
	  	assert.equal(vElement.children.length, 1);
	  	assert.equal(vElement.children[0].tagName, "div");
	  	assert.equal(vElement.children[0].content, "some text");
	});

	it('it should be able to create a vElement with an array of vElements as children', function () {
	  	var childvirtualElementOne = new VElement("div", null, "some text A");
	  	var childvirtualElementTwo = new VElement("div", null, "some text B");
	  	var vElement = new VElement("div", null, [ childvirtualElementOne, childvirtualElementTwo ]);

	  	assert.equal(vElement.tagName, "div");
	  	assert.equal(vElement.children.length, 2);
	  	assert.equal(vElement.children[0].tagName, "div");
	  	assert.equal(vElement.children[0].content, "some text A");
	  	assert.equal(vElement.children[1].tagName, "div");
	  	assert.equal(vElement.children[1].content, "some text B");
	});

	it('it should be able to create a vElement with a reren component as child', function () {
	  	var comp = Component({ view: function() {
	  		return new VElement("span", null, "content of the component");
	  	}});

	  	var compInstance = new VElement(comp);
	  	var vElement = new VElement("div", null, compInstance);

	  	assert.equal(vElement.tagName, "div");
	  	assert.equal(vElement.children.length, 1);
	  	
	  	assert.notEqual(vElement.children[0].componentInstance, null);
	  	assert.equal(vElement.children[0].tagName, "span");
	});

	it('it should be able to create a vElement with an array of reren components as children', function () {
	  	var comp = Component({ view: function() {
	  		return new VElement("span", null, "content of the component");
	  	}});

	  	var compInstanceOne = new VElement(comp);
	  	var compInstanceTwo = new VElement(comp);
	  	var vElement = new VElement("div", null, [compInstanceOne, compInstanceTwo]);

	  	assert.equal(vElement.tagName, "div");
	  	assert.equal(vElement.children.length, 2);
	  	assert.notEqual(vElement.children[0].componentInstance, null);
	  	assert.notEqual(vElement.children[1].componentInstance, null);
	  	assert.equal(vElement.children[0].tagName, "span");
	  	assert.equal(vElement.children[1].tagName, "span");
	  	assert.equal(vElement.children[0].componentInstance === vElement.children[1].componentInstance, false);
	});
});