function Grid(rows, columns, wrapper) {
    if (!(this instanceof Grid)) {
        return new Grid(rows, columns);
    }
    this.rows = rows;
    this.columns = columns;

    this.playing = false;

    this.grid = new Array(rows);
    this.nextGrid = new Array(rows);

    this.timer;
    this.reproductionTime = 100;
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
        this.setupControlButtons();
    },
    createTable: function(wrapper){
        if (!wrapper) {
            // Throw error
            console.error("Problem: No div for the drid table!");
        }
        let table = document.createElement("table");

        for (let i = 0; i < this.rows; i++) {
            let tr = document.createElement("tr");
            for (let j = 0; j < this.columns; j++) { //
                let cell = document.createElement("td");
                cell.setAttribute("id", i + "_" + j);
                cell.setAttribute("class", "dead");
                cell.onclick = () => this.cellClickHandler();
                tr.appendChild(cell);
            }
            table.appendChild(tr);
        }
        $(wrapper).append(table);
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
    setupControlButtons: function(){
        // button to start
        let startButton = document.getElementById('start');
        startButton.onclick = ()=> this.startButtonHandler();

        // button to clear
        let clearButton = document.getElementById('clear');
        clearButton.onclick = ()=>this.clearButtonHandler();
        // button to next
        var nextButton = document.getElementById('next');
        nextButton.onclick = ()=>this.computeNextGen();
    },
    clearButtonHandler: function(){
        this.playing = false;
        let startButton = document.getElementById('start');
        startButton.innerHTML = "Start";
        clearTimeout(this.timer);

        let cellsList = document.getElementsByClassName("live");
        // convert to array first, otherwise, you're working on a live node list
        // and the update doesn't work!
        let cells = [];
        for (let i = 0; i < cellsList.length; i++) {
            cells.push(cellsList[i]);
        }

        for (let i = 0; i < cells.length; i++) {
            cells[i].setAttribute("class", "dead");
        }
        this.resetGrids();
    }, 
    playGame: function(){
        this.computeNextGen();

        if (this.playing) {
            this.timer = setTimeout(()=>this.playGame(), this.reproductionTime);
        }
    },
    startButtonHandler: function(e){
        e = e || window.event;
        e = e.target || e.srcElement;
        if (this.playing) {
            console.log("Pause the game");
            this.playing = false;
            e.innerHTML = "Continue";
            clearTimeout(this.timer);
        } else {
            console.log("Continue the game");
            this.playing = true;
            e.innerHTML = "Pause";
            this.playGame();
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