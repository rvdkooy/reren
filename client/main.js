(function(Reren){

    var myview = Reren.view(function(model) {
        

        var toggleDiv = null;
        if(model.counter % 2 === 0) {
            toggleDiv = Reren.element("div", { style: "background-color: purple" }, 
                Reren.element("span", { style: "font-size: 72px;color: white" }, model.text));
        }

        return Reren.element("div", null, [
                    Reren.element("div", { style: "background-color: green" }, 
                        Reren.element("span", { style: "font-size: 72px;color: red" }, model.text)),
                    Reren.element("div", { style: "background-color: yellow" }, 
                        Reren.element("span", { style: "font-size: 72px;color: blue" }, model.text)),
                    toggleDiv
                ]
        );
    });

    var controller = Reren.controller(function() {
        
        var counter = 1;
        var model = { text: "1" };

        setInterval(function() {
            model.text = ++counter;
            model.counter = counter;
            Reren.reRender();
        }, 1000);

        this.setView(myview, model);
    });

    Reren.start(controller, document.getElementById('container'));

})(window.Reren);