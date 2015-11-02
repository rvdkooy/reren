
var vElement = function(tag, attr, inner) {

	this.tag = tag;
	this.attributes = attr;

	if (typeof inner !== "array") {
		this.content = inner;
	}

	//this.children = children || null;
}

module.exports = (tagName, attributes, children) => {

	var virtualElement = new vElement(tagName, attributes, children);

	// var element = document.createElement(tagName);
	
	// attributes = attributes || {};

	// for(var prop in attributes) {
	// 	element.setAttribute(prop, attributes[prop]);
	// }

	// if (typeof children !== "array") {
	// 	element.innerHTML = children;
	// }

	return virtualElement;
};