function Cell(grid) {
    if (!(this instanceof Cell)) {
        return new Cell(grid);
    }
    this.grid = grid;
}
Object.assign(Cell.prototype, {
    createCell: function(i, j){
        let cell = document.createElement("td");
        cell.setAttribute("id", i + "_" + j);
        cell.setAttribute("class", "dead");
        cell.onclick = () => this.cellClickHandler();
        return cell;
    },
    cellClickHandler: function(e){
        e = e || window.event;
        e = e.target || e.srcElement;
        let rowcol = e.id.split("_");
        let row = rowcol[0];
        let col = rowcol[1];
        let classes = e.getAttribute("class");
        if (classes.indexOf("live") > -1) {
            e.setAttribute("class", "dead");
            this.grid[row][col] = 0;
        } else {
            e.setAttribute("class", "live");
            this.grid[row][col] = 1;
        }
    },
})
export {Cell};