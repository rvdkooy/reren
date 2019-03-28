var variables = require('../variables');
/**
 * This method can find an element based on the inner ID attribure
 * eg: data-internal-id="1_1_2"
 * @value               {The value of the internal id}
 * @return {element}    {The element that we are looking for}
 */
var findElement = function (value) {
  var element = document.querySelector("*[" + variables.ID_ATTR + "='" + value + "']");

  if (!element) {
    throw new Error(`Could not find the element with attribute ${variables.ID_ATTR} and value: ${value}`);
  }

  return element;
};

module.exports.findElement = findElement;