const timerDisplay = document.querySelector('.time');
const scoreDisplay = document.querySelector('.score');
const startButton = document.querySelector('.start-button');
const insectButtons = document.querySelectorAll('.insect__button');
const screens = document.querySelectorAll('.screen');
let seconds = score = 0;
let selectedInsect = {};

startButton.addEventListener('click', function () {
	screens[0].classList.add('up');
})

insectButtons.forEach(button => button.addEventListener('click', function () {
	const img = button.querySelector('img');
	const src = img.getAttribute('src');
	const alt = img.getAttribute('alt');
	selectedInsect = {
		src, 
		alt
	};
	screens[1].classList.add('up');
	startGame();
}))



function digitalize(time){
    return time < 10 ? '0' + time : time;
}

function increaseTime(){
	seconds++;
	const m = Math.floor(seconds / 60);
	const s = seconds % 60;
	
	timerDisplay.textContent = `${digitalize(m)}: ${digitalize(s)}`;
}

function addInsects() {
	setTimeout(createInsect, 1000);
	setTimeout(createInsect, 1500);
}

function createInsect() {
	const insect = document.createElement('div');
	insect.classList.add('insect');
	const {x, y} = randomLocation();
	insect.style.left = `${x}px`;
	insect.style.top = `${y}px`;
	let src = selectedInsect.src.toString();
	src = src.replace('.png', '');
	const alt = selectedInsect.alt;
	const choice = Math.floor(Math.random() * 2);
	insect.innerHTML = `<img src="${src}${choice ? choice : ''}.png" alt="${alt}" style="transform: rotate(${Math.random() * 360}deg)">`;
	screens[2].appendChild(insect);
	insect.addEventListener('click', catchInsect);
}

function catchInsect(){
	increaseScore();
	addInsects();
	this.remove();
}

function increaseScore(){
	score++;
	scoreDisplay.textContent = score;
}


function randomLocation() {
	const width = window.innerWidth;
	const height = window.innerHeight;
	const x = Math.random() * (width - 100);
	const y = Math.random() * (height - 170) + 100;
	return {x, y};
}

function startGame() {
	setTimeout(createInsect, 1000);
	setInterval(increaseTime, 1000);
	setInterval(createInsect, 5000);
}



