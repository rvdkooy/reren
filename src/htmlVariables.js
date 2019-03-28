/**
 * All known HTML elements that can be used in a HTML document
 * source: https://developer.mozilla.org/en-US/docs/Web/HTML/Element
 */
module.exports.elements = [
  "a", "article", "footer", "header", "h1", "h2", "h3", "h4", "h5", "h6",
  "hgroup", "nav", "section", "dd", "div", "dl", "figcaption", "figure",
  "hr", "li", "main", "ol", "p", "pre", "ul", "abbr", "b", "bdi", "bdo",
  "br", "cite", "code", "data", "dfn", "em", "i", "kbd", "mark", "q",
  "rp", "rt", "rtc", "ruby", "s", "samp", "small", "span", "strong", "sub",
  "sup", "time", "u", "var", "wbr", "area", "audio", "map", "track",
  "video", "embed", "object", "param", "source", "canvas", "noscript",
  "script", "del", "ins", "caption", "col", "colgroup", "table", "tbody",
  "td", "tfoot", "th", "thead", "tr", "button", "datalist", "fieldset", "form",
  "input", "keygen", "label", "legend", "meter", "optgroup", "option", "output",
  "progress", "select", "details", "dialog", "menu", "menuitem", "summary",
  "content", "shadow", "template"
  // "element"
];

module.exports.events = [
  // mouse events:
  "onclick", "oncontextmenu", "ondblclick", "onmousedown", "onmouseenter",
  "onmouseleave", "onmousemove", "onmouseover", "onmouseout", "onmouseup",
  // keyboard events
  "onkeydown", "onkeypress", "onkeyup",
  // form events
  "onblur", "onchange", "onfocus", "onfocusin", "onfocusout", "oninput",
  "oninvalid", "onreset", "onsearch", "onselect", "onsubmit",
  // drag events
  "ondrag", "ondragend", "ondragenter", "ondragleave", "ondragover", "ondragstart", "ondrop"
];