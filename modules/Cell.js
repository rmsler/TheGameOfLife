function Cell() {
    if (!(this instanceof Cell)) {
        return new Cell();
    }
    this.state = false;
    this.domElement;
}
Object.assign(Cell.prototype, {
    createCell: function(){
        let cell = document.createElement("td");
        cell.setAttribute("class", this.state);
        cell.onclick = () => this.cellClickHandler();
        this.domElement = cell;
        return this.domElement;
    },
    cellClickHandler: function(){ 
        this.state = Number(!this.state);
        this.updateVisual();
    },
    updateVisual: function(){
        //console.log(this.domElement.classList + " " + this.state)
        let cellClass = (this.domElement.classList[0]);
        let state = !!(this.state);
        // console.log(cellClass);
        // console.log(state);
        
        if(cellClass.toString() !== state.toString()){
            this.domElement.removeAttribute("class", this.state!=0 ? "false" : "true");
            this.domElement.setAttribute("class", this.state!=0 ?"true" : "false");
        }
    }
})
export {Cell};