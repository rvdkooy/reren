[![Build Status](https://travis-ci.org/rvdkooy/reren.svg?branch=master)](https://travis-ci.org/rvdkooy/reren)

# reren
A simple javascript viewengine inspired by viewengines like React, Angular and KnockoutJs

Example/Idea:

``` javascript

var R = require('reren');

var MyComponent = R.component({
  controller: function() {
    this.model.timer = 0;
    
    setInterval(() => {
      model.timer += 1;
      this.update();
    }, 1000);
  },
  view: function(model) {
    return R.div({ classes: "container" }, [
      R.div({ classes: "row" }, model.timer.toString());
    ]);
  }
});

R.start(MyComponent, document.getElementById("container"));
```

### Component API
To create a new Reren Component you use the following API:
``` javascript
var R = require('reren');

var MyComponent = R.component({
  controller: function() {
    // controller logic here
  },
  view: function() {
    // view logic here
  }
});

```


#### Controller

| Method        | Description                                                                       |               
| ------------- |-----------------------------------------------------------------------------------|
| this.onMount  | Called when mounting the component for the first time                             |
| this.onUpdate | Called when the component is updated by it's parent component                     |
| this.model    | A controller always has a model object available that will be passed to it's view |
| this.update   | When called, will trigger the view to rerender again (Will also notify child components 'onUpdate')|

#### View
The view will be injected with the model from the controller (if the controller is defined) and it should always return a single VElement instance to be able to construct and compare the virtual dom;
``` javascript
  view: function(model) {
    return R.div({ id: "my_id" }, model.text);
  }
```

#### VElements
VElements are used to define your (virtual) DOM and they can be used in the following ways:

``` javascript
// default api: new VElement(tagName, attributes, children || content);
new VElement("div", { id: "my_id" }, "some text");
new VElement("div", { id: "my_id" }, new VElement("span", null, "some text"));
new VElement("div", { id: "my_id" }, [ 
                                        new VElement("span", null, "first"),
                                        new VElement("span", null, "second")
                                      ]);

// shorthand api: R.div(attributes, children || content);
R.div({ my_id }, R.span(null, "some text"));

// creating a nested Component: new VElement(Component, model);
new VElement(NestedComponent, model);

```


### Todo's
- [x] Reconize changes in attributes in vdom and apply them to the real dom
- [ ] Implement changes in lists by using a unique key (like react)
- [x] Only update components that really changed (instead of comparing the whole vdom)
- [x] Implement more events (instead of only onClick)
- [x] Communication between components (eg: props)
- [x] cleaning up components (unmounting them) and event handlers

### Idea's
- [ ] Dependency injection (registering and injecting them into a controller)
- [ ] auto update of components




