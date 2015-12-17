var { Component } = require('../component');

class VElement {
    constructor(tagName, attr, children) {
        this.tagName = tagName;
        this.attributes = attr;
        this.content = null;
        this.children = null;
        this.componentInstance = null;
        //console.log(typeof tagName);
        if(typeof tagName === "function") {
            
            var componentInstance = new tagName();
            
            var vElement = componentInstance.getView();
            vElement.componentInstance = componentInstance;
            return vElement;

        } else {
            if (typeof children === "object") {
                
                if (Array.isArray(children)){
                    this.children = [];
                    children.forEach(child => {
                        this.children.push(child);
                    })
                } else {
                    this.children = [ children ];    
                }
            } else {
                this.content = children;
            }    
        }
    }
}

module.exports = (tagName, attributes, children) => {
    return new VElement(tagName, attributes, children);
};