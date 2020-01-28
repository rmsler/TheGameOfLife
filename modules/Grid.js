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
                this.grid[i][j] = 0;
                this.nextGrid[i][j] = 0;
            }
        }
    },
    copyAndResetGrid: function(){
        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.columns; j++) {
                this.grid[i][j] = this.nextGrid[i][j];
                this.nextGrid[i][j] = 0;
            }
        }
    },
    // Initialize
    initialize: function(wrapper){
        this.createTable(wrapper);
        this.initializeGrids();
        this.resetGrids();
        let controlButtons = new Controls(this.computeNextGen.bind(this), this.resetGrids.bind(this));
        controlButtons.setupControlButtons();
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
                let cellElem = new Cell(this.grid);
                let cell = cellElem.createCell(i, j);
                tr.appendChild(cell);
            }
            table.appendChild(tr);
        }
        $(wrapper).append(table);
    },
    updateView: function(){
        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.columns; j++) {
                let cell = document.getElementById(i + "_" + j);
                if (this.grid[i][j] == 0) {
                    cell.setAttribute("class", "dead");
                } else {
                    cell.setAttribute("class", "live");
                }
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
        // copy all 1 values to "live" in the table
        this.updateView();
    },
    applyRules: function(row, col){
        let numNeighbors = this.countNeighbors(row, col);
        if (this.grid[row][col] == 1) {
            if (numNeighbors < 2) {
                this.nextGrid[row][col] = 0;
            } else if (numNeighbors == 2 || numNeighbors == 3) {
                this.nextGrid[row][col] = 1;
            } else if (numNeighbors > 3) {
                this.nextGrid[row][col] = 0;
            }
        } else if (this.grid[row][col] == 0) {
            if (numNeighbors == 3) {
                this.nextGrid[row][col] = 1;
            }
        }
    },
    countNeighbors: function(row, col){
        let count = 0;
        if (row - 1 >= 0) {
            if (this.grid[row - 1][col] == 1) count++;
        }
        if (row - 1 >= 0 && col - 1 >= 0) {
            if (this.grid[row - 1][col - 1] == 1) count++;
        }
        if (row - 1 >= 0 && col + 1 < this.columns) {
            if (this.grid[row - 1][col + 1] == 1) count++;
        }
        if (col - 1 >= 0) {
            if (this.grid[row][col - 1] == 1) count++;
        }
        if (col + 1 < this.columns) {
            if (this.grid[row][col + 1] == 1) count++;
        }
        if (row + 1 < this.rows) {
            if (this.grid[row + 1][col] == 1) count++;
        }
        if (row + 1 < this.rows && col - 1 >= 0) {
            if (this.grid[row + 1][col - 1] == 1) count++;
        }
        if (row + 1 < this.rows && col + 1 < this.columns) {
            if (this.grid[row + 1][col + 1] == 1) count++;
        }
        return count;
    }
})

export {Grid};