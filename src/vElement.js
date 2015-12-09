var { Component } = require('./component');

class VElement {
    constructor(tagName, attr, children) {
        this.tagName = tagName;
        this.attributes = attr;
        this.content = null;
        this.children = null;
        this.componentInstance = null;

        if (typeof children === "object") {
            
            if (Array.isArray(children)){
                this.children = [];
                children.forEach(child => {
                    if (child instanceof Component) {
                        var vElementFromComponent = child.getView();
                        this.children.push(vElementFromComponent);
                    } else {
                        this.children.push(child);
                    }
                })
            } else {
                
                if (children instanceof Component) {
                    var vElementFromComponent = children.getView();
                    this.children = [ vElementFromComponent ];
                } else {
                    this.children = [ children ];    
                }
            }
        } else {
            this.content = children;
        }
    }
}

module.exports = (tagName, attributes, children) => {
    return new VElement(tagName, attributes, children);
};