function Controls(computeNextGen, resetGrids) {
    if (!(this instanceof Controls)) {
        return new Controls(rows, columns);
    }
    this.computeNextGen = () => computeNextGen();
    this.resetGrids = () => resetGrids();
    this.timer;
    this.reproductionTime = 500;
}
Object.assign(Controls.prototype, {
    setupControlButtons: function(){
        let startButton = document.getElementById('start');
        startButton.onclick = ()=> this.startButtonHandler();

        // button to clear
        let clearButton = document.getElementById('clear');
        clearButton.onclick = ()=>this.clearButtonHandler();

        // button to next
        var nextButton = document.getElementById('next');
        nextButton.onclick = () => this.computeNextGen();

        //range input 
        var speedButton = document.getElementById('speed');
        speedButton.onchange = ()=>this.updateSpeed();
    },
    updateSpeed: function(e){
        e = e || window.event;
        e = e.target || e.srcElement;
        this.reproductionTime = 500 - e.value;
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
});

export {Controls};