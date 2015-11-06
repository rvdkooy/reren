
var vElement = function(tag, attr, children) {

	this.tag = tag;
	this.attributes = attr;
	this.children = [];

	if (children instanceof vElement) {
		this.children.push(children);
	} else if(typeof children === "string" || 
				typeof children === "number"){
		this.content = children;
	}
}

module.exports = (tagName, attributes, children) => {

	return new vElement(tagName, attributes, children);
};