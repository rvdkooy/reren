var variables = require('./variables');

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

    constructor(parentId, identifier, tagName, attributes, children) {
        this.parentId = parentId;
        this.identifier = identifier;
        this.tagName = tagName;
        this.attributes = attributes || {};
        this.children = [];

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
            element.setAttribute(prop, this.attributes[prop]);
        }

        if(this.content) {
            element.innerHTML = this.content;
        }

        findElement(this.parentId).appendChild(element);
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
        findElement(this.identifier).innerHTML = this.innerHtml;
    };
}

/**
 * This DOM operation will remove the element from the DOM
 * @parentId             {The identifier of the parent element of the element we want to remove}
 * @identifier           {The identifier of the element we want to remove from the DOM}
 */
class RemoveElement {
    constructor(parentId, identifier) {
        this.parentId = parentId;
        this.identifier = identifier;
    }

    apply() {
        var elementToRemove = findElement(this.identifier);
        findElement(this.parentId).removeChild(elementToRemove);
    }
}


/**
 
 */

/**
 * This method can find an element based on the inner ID attribure
 * eg: data-internal-id="1_1_2"
 * @value               {The value of the internal id}
 * @return {element}    {The element that we are looking for}
 */
var findElement = function(value) {
    var element = document.querySelector("*[" + variables.ID_ATTR + "='"+ value + "']");

    if(!element) {
        throw new Error(`Could not find the element with attribute ${variables.ID_ATTR} and value: ${value}`);
    }

    return element;
}

/**
 * Exports
 */
module.exports.InsertElement = InsertElement;
module.exports.SetInnerHtml = SetInnerHtml;
module.exports.RemoveElement = RemoveElement;