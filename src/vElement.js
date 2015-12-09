var { Component } = require('./component');

class VElement {
    constructor(tagName, attr, children) {
        this.tagName = tagName;
        this.attributes = attr;

        if (typeof children === "object") {
            if (Array.isArray(children)){
                this.children = [];
                children.forEach(child => {
                    if (child instanceof Component) {
                        this.children.push(child.getView());
                    } else {
                        this.children.push(child);
                    }
                })
            } else {
                
                if (children instanceof Component) {
                    this.children = [ children.getView() ];
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