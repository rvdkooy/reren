module.exports.getElementsByAttribute = (attribute, context) => {
  var nodeList = (context || document).getElementsByTagName('*');
  var nodeArray = [];
  var iterator = 0;
  var node = null;

  while (node = nodeList[iterator++]) {
    if (node.getAttribute(attribute)) nodeArray.push(node);
  }

  return nodeArray;
};