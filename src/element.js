module.exports = (tagName, attributes, children) => {

	var element = document.createElement(tagName);
	
	attributes = attributes || {};

	for(var prop in attributes) {
		element.setAttribute(prop, attributes[prop]);
	}

	if (typeof children !== "array") {
		element.innerHTML = children;
	}

	return element;
};