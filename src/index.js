


module.exports.start = (controller, rootNode) => {

	rootNode = rootNode || document.body;

	var view = controller();

	rootNode.appendChild(view());
};

// module.exports.controller = () => {

// };

// module.exports.view = () => {

// };

module.exports.element = (tagName, attributes, children) => {

	return document.createElement(tagname);
};

// module.exports.reRender = () => {

// };