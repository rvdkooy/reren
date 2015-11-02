
var vElement = function(tag, attr, inner) {

	this.tag = tag;
	this.attributes = attr;
	this.children = [];

	if (inner instanceof vElement) {
		this.children.push(inner);
	} else if(typeof inner === "string" || 
				typeof inner === "number"){
		this.content = inner;
	}
}

module.exports = (tagName, attributes, children) => {

	return new vElement(tagName, attributes, children);
};