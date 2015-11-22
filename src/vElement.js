
var vElement = function(tagName, attr, children) {

    this.tagName = tagName;
    this.attributes = attr;

    if (typeof children === "object") {
        if (Array.isArray(children)){
            this.children = children;
        } else {
            this.children = [ children ];
        }
    } else {
        this.content = children;
    }
}

module.exports = (tagName, attributes, children) => {

    return new vElement(tagName, attributes, children);
};