var vElement = require('./vElement');
var domUtils = require('./domUtils');
var ID_ATTR = "data-internal-id";

var parse = (rootNode, vNode) => {
	
	var level = 1;
	var counter = 0;
	var changes = [];

	function internalParse(parent, _vNode) {
		
		counter++;
		var searchId = level + "_" + counter;
		var foundElementsInDom = parent.querySelectorAll("*[" + ID_ATTR + "='"+ searchId + "']");
		var currentElement;

		if(foundElementsInDom.length) {
			currentElement = foundElementsInDom[0];
			changes = changes.concat(getChangesBetween(currentElement, _vNode));
		} else {
			var newElement = createNewElement(_vNode, searchId);
			currentElement = newElement;
			changes.push(() => {
				parent.appendChild(newElement);
			});
		}

		// if _vNode has children:
		_vNode.children.forEach((child) => {
			level = counter;
			counter = 1;
			internalParse(currentElement, child);
		});
	};

	internalParse(rootNode, vNode);
	return changes;
};

var apply = function(vElement) {
	var element = document.createElement(vNode.tag);
	
	var attributes = vNode.attributes || {};

	for(var prop in attributes) {
		element.setAttribute(prop, attributes[prop]);
	}

	if (vNode.content) {
		element.innerHTML = vNode.content;
	}

	return element;
};

function createNewElement(vNode, internalId) {
	var element = document.createElement(vNode.tag);
	element.setAttribute(ID_ATTR, internalId);
	var attributes = vNode.attributes || {};

	for(var prop in attributes) {
		element.setAttribute(prop, attributes[prop]);
	}

	if (vNode.content) {
		element.innerHTML = vNode.content;
	}

	return element;
};

function getChangesBetween(element, vNode) {
	var result = [];

	if(vNode.content && element.innerHTML !== vNode.content) {
		result.push(function() {
			element.innerHTML = vNode.content;
		});
	} 

	return result;
};

module.exports = {
	parse: parse,
	apply: apply
};