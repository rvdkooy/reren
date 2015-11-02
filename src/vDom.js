module.exports.parse = function(vNode) {

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