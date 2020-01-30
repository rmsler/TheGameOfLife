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
        cell.onclick = () => this.cellClickHandler();
        this.domElement = cell;
        return this.domElement;
    },
    cellClickHandler: function(){ 
        this.state = !this.state;
        this.updateVisual();
    },
    updateVisual: function(){
        if(this.state){
            this.domElement.setAttribute("class","true");
        }
        else{
            this.domElement.removeAttribute("class","true");
        }
    }
})
export {Cell};