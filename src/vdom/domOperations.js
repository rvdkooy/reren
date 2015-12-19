var variables = require('../variables');
var documentHelpers = require('./documentHelpers')

/**
 * This DOM operation will insert a new DOM element below the provided parent
 * @parentId             {The id of the parent element where to put the element on}
 * @identifier           {The identifier of the new element which can be used to find it later}
 * @tagName              {The tagName of the element (eg: div, span, h1 etc)}
 * @attributes           {The attribures of the new element (eg: style, title etc)}
 * @children             {The children of the new element, this can be: a single vElement, 
 *                        an array of vElements, a string or a number}
 */
class InsertElement {

    constructor(parentId, identifier, tagName, attributes, children, unMount) {
        if(!parentId) {
            throw new Error("For inserting we need a parentId");  
        } 
        if(!identifier) throw new Error("For inserting we need an indentifier");
        if(!tagName) throw new Error("For inserting we need an tagName");
        
        this.parentId = parentId;
        this.identifier = identifier;
        this.tagName = tagName;
        this.attributes = attributes || {};
        this.children = [];
        this.unMount = unMount;

        if (typeof children === "object") {
            this.children.push(children);
        } else if(typeof children === "string" || 
                    typeof children === "number"){
            this.content = children;
        }

        if(typeof children === "string" || typeof children === "number"){
            this.content = children;
        }
    }
    
    apply() {
        var element = document.createElement(this.tagName);
        element.setAttribute(variables.ID_ATTR, this.identifier);
        
        for(var prop in this.attributes) {
            
            if(prop === "classes") {
                element.setAttribute("class", this.attributes[prop]);
            }
            else if(prop === "onClick") {
                element.addEventListener("click", this.attributes[prop]);

                // setTimeout(() => {
                //     element.removeEventListener("click", this.attributes[prop])
                //     console.log("removed event listener");
                // }, 2000);
            }
            else {
                element.setAttribute(prop, this.attributes[prop]);
            }

        }

        if(this.content) {
            element.innerHTML = this.content;
        }

        documentHelpers.findElement(this.parentId).appendChild(element);
    };
}

/**
 * This DOM operation will update the innerHTML of the current element
 * @identifier           {The identifier of the element where we want to set the inner Html}
 * @innerHTML            {The actual inner Html of the element we want to set}
 */
class SetInnerHtml {

    constructor(identifier, innerHtml) {
        this.identifier = identifier;
        this.innerHtml = innerHtml;
    }
    
    apply() {
        documentHelpers.findElement(this.identifier).innerHTML = this.innerHtml;
    };
}

/**
 * This DOM operation will remove the element from the DOM
 * @parentId             {The identifier of the parent element of the element we want to remove}
 * @identifier           {The identifier of the element we want to remove from the DOM}
 */
class RemoveElement {
    constructor(parentId, identifier) {
        // console.log(`removing element with id: ${identifier} from parent with id: ${parentId}`);

        this.parentId = parentId;
        this.identifier = identifier;
    }

    apply() {
        var elementToRemove = documentHelpers.findElement(this.identifier);
        documentHelpers.findElement(this.parentId).removeChild(elementToRemove);
    }
}

/**
 * Exports
 */
module.exports.InsertElement = InsertElement;
module.exports.SetInnerHtml = SetInnerHtml;
module.exports.RemoveElement = RemoveElement;