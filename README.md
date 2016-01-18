# reren
A simple javascript viewengine inspired by React, Angular and KnockoutJs

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

## concepts
- Every component has at least a view (controller is not mandatory).
- Components can be constructed with other components.
- A view can have a viewmodel which is provided by the controller
- No DOM operations needed, reren uses a virtual dom to compare changes and will apply them to the real DOM


### Todo's
- [x] Reconize changes in attributes in vdom and apply them to the real dom
- [ ] Implement changes in lists by using a unique key (like react)
- [x] Only update components that really changed (instead of comparing the whole vdom)
- [ ] Implement more events (instead of only onClick)
- [x] Communication between components (eg: props)
- [ ] cleaning up components (unmounting them) and event handlers

### Idea's
- [ ] Dependency injection (registering and injecting them into a controller)
- [ ] auto update of components




