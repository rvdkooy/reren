class VElement {
    constructor(type, attr, children) {
        this.type = type;
        this.attributes = attr;
        this.content = null;
        this.children = null;
        this.componentInstance = null;
        

        if (children && typeof children === "object") {
            if (Array.isArray(children)){
                this.children = [];
                children.forEach(child => {
                    this.children.push(child);
                })
            } else {
                this.children = [ children ];    
            }
        } else if (children) {
            this.content = children;
        } else {
            this.children = [];
        }
    }
}

module.exports = (type, attributes, children) => {
    return new VElement(type, attributes, children);
};