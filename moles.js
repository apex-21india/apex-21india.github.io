const holes = document.querySelectorAll('.hole');
const scoreBoard = document.querySelector('.score');
const moles = document.querySelectorAll('.mole');
const startButton = document.querySelector('.start');

let timeUp = false;


const game = {

    holes: holes,

    scoreBoard: scoreBoard,

    lastHole: 90,

    score: 0,
	
	running: false,

    randomTime: function (min, max) {
        return Math.round(Math.random() * (max - min) + min);
    },

    randomHole: function() {
        const index = Math.floor(Math.random() * this.holes.length);
        
        if(index === this.lastHole){
            return this.randomHole();
        }

        const hole = this.holes[index];
        return hole;
    },

    peep: function() {
        const game = this;
        const hole = this.randomHole();
        const time = this.randomTime(200, 400);
		if(time)
        hole.classList.add('up');
        setTimeout(function(){
            hole.classList.remove('up');
            if(!timeUp) 
                game.peep();
        }, time);
    },

    start: function () {
		const game = this;
        this.scoreBoard.textContent = 0;
        this.score = 0;
        timeUp = false;
		this.running = true;
        setTimeout(function(){
            timeUp = true;  
			game.running = false;
        }, 15000);
        this.peep(); 
        // dont know why changin order of peep with setTimeout works
    },

    bonk: function (e){
        if(!e.isTrusted) 
            return;
        this.score++;
        e.target.parentNode.classList.remove('up');
        this.scoreBoard.textContent = this.score;
    }
}

var view = {

    moles: moles,

    setUpEventListeners: function () {
        this.moles.forEach(function(mole){
            const bonk = game.bonk.bind(game);
            mole.addEventListener('click', bonk);
        })
		startButton.addEventListener('click', function () {
			if(game.running)
				return;
			game.start();
		})
    }
}

view.setUpEventListeners();
