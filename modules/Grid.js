import { Controls } from "./Controls.js";
import { Cell } from "./Cell.js";

function Grid(rows, columns) {
    if (!(this instanceof Grid)) {
        return new Grid(rows, columns);
    }
    this.rows = rows;
    this.columns = columns;
    this.grid = new Array(rows);
    this.nextGrid = new Array(rows);

    this.playing = false;
}
Object.assign(Grid.prototype, {
    initializeGrids: function(){
        for (let i = 0; i < this.rows; i++) {
            this.grid[i] = new Array(this.columns);
            this.nextGrid[i] = new Array(this.columns);
        }
    },
    resetGrids: function(){
        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.columns; j++) {
                this.grid[i][j].state = 0;
                this.nextGrid[i][j] = 0;
            }
        }
    },
    copyAndResetGrid: function(){
        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.columns; j++) {
                this.grid[i][j].state = !!(this.nextGrid[i][j]);
                this.nextGrid[i][j] = 0;
            }
        }
    },
    // Initialize
    initialize: function(wrapper){
        this.initializeGrids();
        this.createTable(wrapper);
        this.resetGrids();
        let controlButtons = new Controls(this.computeNextGen.bind(this), this.resetCallback.bind(this));
        controlButtons.setupControlButtons();
    },
    resetCallback: function(){
        let cellsList = document.getElementsByClassName("true");
        // convert to array first, otherwise, you're working on a true node list
        // and the update doesn't work!
        let cells = [];
        for (let i = 0; i < cellsList.length; i++) {
            cells.push(cellsList[i]);
        }

        for (let i = 0; i < cells.length; i++) {
            cells[i].setAttribute("class", "false");
        }
        this.resetGrids();
    },
    createTable: function(wrapper){
        if (!wrapper) {
            // Throw error
            console.error("Problem: No div for the drid table!");
        }
        let table = document.createElement("table");

        for (let i = 0; i < this.rows; i++) {
            let tr = document.createElement("tr");
            for (let j = 0; j < this.columns; j++) { 
                this.grid[i][j] = new Cell();
                let cell = this.grid[i][j].createCell();
                tr.appendChild(cell);
            }
            table.appendChild(tr);
        }
        $(wrapper).append(table);
    },
    updateView: function(){
        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.columns; j++) {
                this.grid[i][j].updateVisual();
            }
        }
    },
    computeNextGen: function(){
        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.columns; j++) {
                this.applyRules(i, j);
            }
        }
        // copy NextGrid to grid, and reset nextGrid
        this.copyAndResetGrid();
        // copy all 1 values to "true" in the table
        this.updateView();
    },
    applyRules: function(row, col){
        let numNeighbors = this.countAtrueNeighbors(row, col);
        if (this.grid[row][col].state == 1) {
            if (numNeighbors < 2 || numNeighbors > 3) {
                this.nextGrid[row][col] = 0;
            } else if (numNeighbors == 2 || numNeighbors == 3) {
                this.nextGrid[row][col] = 1;
            }
        } else if (this.grid[row][col].state == 0) {
            if (numNeighbors == 3) {
                this.nextGrid[row][col] = 1;
            }
        }
    },
    countAtrueNeighbors: function(row, col){
        let count = 0;
        if (row - 1 >= 0) {
            if (this.grid[row - 1][col].state == 1) count++;
        }
        if (row - 1 >= 0 && col - 1 >= 0) {
            if (this.grid[row - 1][col - 1].state == 1) count++;
        }
        if (row - 1 >= 0 && col + 1 < this.columns) {
            if (this.grid[row - 1][col + 1].state == 1) count++;
        }
        if (col - 1 >= 0) {
            if (this.grid[row][col - 1].state == 1) count++;
        }
        if (col + 1 < this.columns) {
            if (this.grid[row][col + 1].state == 1) count++;
        }
        if (row + 1 < this.rows) {
            if (this.grid[row + 1][col].state == 1) count++;
        }
        if (row + 1 < this.rows && col - 1 >= 0) {
            if (this.grid[row + 1][col - 1].state == 1) count++;
        }
        if (row + 1 < this.rows && col + 1 < this.columns) {
            if (this.grid[row + 1][col + 1].state == 1) count++;
        }
        return count;
    }
})

export {Grid};