
var vElement = function(tag, attr, inner) {

	this.tag = tag;
	this.attributes = attr;

	if (typeof inner !== "array") {
		this.content = inner;
	}

	//this.children = children || null;
}

module.exports = (tagName, attributes, children) => {

	return new vElement(tagName, attributes, children);
};