# reren
A simple javascript viewengine inspired by React, Angular and KnockoutJs

Example/Idea:

``` javascript

var R = require('reren');

var MyComponent = R.component({
  controller: () => {
    var model = { timer: 0 };
    
    setInterval(() => {
      model.timer += 1;
      R.reRender();
    }, 1000);
    
    this.setViewModel(model);
  },
  view: (model) => {
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
- [ ] Reconize changes in attributes in vdom and apply them to the real dom
- [ ] Only update components that really changed (instead of comparing the whole vdom)
- [ ] Implement more events (instead of only onClick)
- [ ] Communication between components (eg: props)

### Idea's
- [ ] Dependency injection (registering and injecting them into a controller)
- [ ] auto update of components




