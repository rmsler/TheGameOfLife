import { Shapes } from "./Shapes.js";

function Controls(computeNextGen, resetGrids) {
    if (!(this instanceof Controls)) {
        return new Controls(computeNextGen, resetGrids);
    }
    this.computeNextGen = () => computeNextGen();
    this.resetGrids = () => resetGrids();
    this.timer;
    this.reproductionTime = 500;
}
Object.assign(Controls.prototype, {
    setupControlButtons: function(){
        //selector for shapes
        var shapeSelector = document.getElementById('shapes');
            //clear the canvas for the new predefined shapes 
        shapeSelector.onchange = () => this.clearButtonHandler();
            //get config and draw it on the canvas
        $.getJSON("config.json", function(data) {
            let shape = new Shapes(data, this.clearButtonHandler);
            shape.init(shapeSelector);
        });
        //button to start
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