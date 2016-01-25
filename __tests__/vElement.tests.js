var VElement = require('../src/vdom/vElement.js');
var assert = require('assert');
var { componentFactory } = require('../src/components/rerenComponent');

describe('vElement tests', function() {

    it('it should be able to create a vElement with content as inner html', function () {
        var vElement = new VElement("div", { classnames: "myclass" }, "some text");

        assert.equal(vElement.type, "div");
        assert.equal(vElement.attributes.classnames, "myclass");
        assert.equal(vElement.content, "some text");
    });

    it('it should be able to create a vElement with another vElement a child', function () {
        var childvirtualElement = new VElement("div", null, "some text");
        var vElement = new VElement("div", null, childvirtualElement);

        assert.equal(vElement.type, "div");
        assert.equal(vElement.children.length, 1);
        assert.equal(vElement.children[0].type, "div");
        assert.equal(vElement.children[0].content, "some text");
    });

    it('it should be able to create a vElement with an array of vElements as children', function () {
        var childvirtualElementOne = new VElement("div", null, "some text A");
        var childvirtualElementTwo = new VElement("div", null, "some text B");
        var vElement = new VElement("div", null, [ childvirtualElementOne, childvirtualElementTwo ]);

        assert.equal(vElement.type, "div");
        assert.equal(vElement.children.length, 2);
        assert.equal(vElement.children[0].type, "div");
        assert.equal(vElement.children[0].content, "some text A");
        assert.equal(vElement.children[1].type, "div");
        assert.equal(vElement.children[1].content, "some text B");
    });

    it('it should be able to create a vElement from a component', function () {
        var comp = componentFactory({ view: function() {
            return new VElement("span", null, "content of the component");
        }});

        var vElement = new VElement(comp);

        assert.equal(typeof vElement.type, "function");
    });
});