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
        cell.setAttribute("id", this.row + "_" + this.columns);
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
        this.domElement.removeAttribute("class", !this.state!=0 ? "false" : "true");
        this.domElement.setAttribute("class", this.state!=0 ?"true" : "false");
    }
})
export {Cell};