(function(R){

    var myview = R.view(function(model) {
        var purpleStyle = { style: "background-color: purple" };
        var greenStyle = { style: "background-color: green" };
        var yellowStyle = { style: "background-color: yellow" };
        
        var optionalDiv = (model.counter % 2 === 0) ?
            R.div(purpleStyle, R.span({ style: "font-size: 72px;color: white" }, model.text)) :
            null;
        
        return R.div(null, [
                    R.div(greenStyle, R.span({ style: "font-size: 72px;color: red" }, model.text)),
                    R.div(yellowStyle, R.span({ style: "font-size: 72px;color: blue" }, model.text)),
                    optionalDiv
                ]
        );
    });

    var controller = R.controller(function() {
        
        var counter = 1;
        var model = { text: "1" };

        setInterval(function() {
            model.text = ++counter;
            model.counter = counter;
            R.reRender();
        }, 1000);

        this.setView(myview, model);
    });

    R.start(controller, document.getElementById('container'));

})(window.Reren);