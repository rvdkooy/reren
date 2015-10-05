module.exports = (tagName, attributes, children) => {

	var element = document.createElement(tagName);
	
	if (typeof children === "string") {
		element.innerHTML = children;
	}

	return element;
};