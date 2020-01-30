function Shapes(dataArray, clearButtonHandler) {
    if (!(this instanceof Shapes)) {
        return new Shapes(dataArray);
    }
    this.shapes = dataArray;
    this.clearButtonHandler = ()=> clearButtonHandler();
    this.predefinedArray;
}
Object.assign(Shapes.prototype, {
    init: function(wrapper, row, col){
        $.each(this.shapes["config"], function (index, value){
            let option = document.createElement("option");
            let textchild = document.createTextNode(Object.keys(value)[0]);
            option.appendChild(textchild);
            $(wrapper).append(option);
        });   
    },
    addModel: function(rows,cols){
        this.clearButtonHandler();
        // let row = rowcol[0];
        // let col = rowcol[1];
        // let classes = e.getAttribute("class");
        // if (classes.indexOf("live") > -1) {
        //     e.setAttribute("class", "dead");
        //     this.grid[row][col] = 0;
        // } else {
        //     e.setAttribute("class", "live");
        //     this.grid[row][col] = 1;
        // }
    }
})

export {Shapes};