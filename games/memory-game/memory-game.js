// Maria Pasyechnyk 
// ID: 20904388

/*
ENHANCEMENTS
1. I used images of cards (a card back and an Ace of each type) instead of squares and words (improved graphics)
2. I created a menu that prompts the player to play the game by pressing the 'enter' key and allows the user to read how to play the game
   by pressing the space bar
3. I created a timer that pops up once the player starts playing the game 
   to keep track of how long it took them to find all the pairs (helps the player improve if
	 they're looking to work on speed)
*/

// card images
let imgCardBack;
let imgDiamond;
let imgHeart;
let imgSpade;
let imgClub;

function preload() {
	imgCardBack = loadImage("cardback.png");
	imgDiamond = loadImage("diamond.png");
	imgHeart = loadImage("heart.png");
	imgSpade = loadImage("spade.png");
	imgClub = loadImage("club.png");
}

let pairs = ["Hearts", "Hearts", "Diamonds", "Diamonds",
	"Spades", "Spades", "Clubs", "Clubs"
];

/* "covered" is a boolean array. 
The array "covered" is the same length as the array "pairs"
Each element in "covered" is true or false indicating whether 
the word is covered by a rectangle or not. */
let covered = [];

/* currentPair is an array of length 2 with the two numbers 
     of the index of the current rectangles that are uncovered. */
let currentPair = [];

let count = 0; // how many times mouse clicked
let timer = 0; // count 2 seconds
let speedTimerSeconds; // time of gameplay in seconds
let speedTimerMinutes; // time of gameplay in minutes

// rectangle size, x and y positions
let rectSize;
let rectX;
let rectY;

let playGame; // initiate game after menu
let showHelp; // show help page

// used to see when to start or stop timer
let startTimer;
let stopTimer;
let numMousePressed; // how many times mouse was pressed (helps initiate timer)


function setup() {
	createCanvas(800, 300);
	rectMode(CENTER);
	imageMode(CENTER);

	textAlign(CENTER, CENTER);
	textFont("TrebuchetMS"); // sans-serif font

	rectX = 50;
	rectY = height / 2;
	rectSize = 90;
	playGame = false;
	showHelp = false;

	initialization();
}

function draw() {
	menu();
	if (showHelp === true) {
		helpMenu();
	}
	if (playGame === true) {
		displayGame();
		displayTimer();
	}
}

// main menu prompting player to play game
function menu() {
	background('#e3d1cf'); // light pink
	
	fill(0);
	textSize(60);
	text("The Memory Game", width / 2, 60);
	textSize(15);
	text("By: Maria Pasyechnyk", width / 2, 120);
	textSize(25);
	text("Press Enter to Play\nor\nPress Space for Instructions", width / 2, 220);
}

function helpMenu() {
	fill('#bda7a4');
	rect(width / 2, height / 2, 650, 250);
	fill(0);
	textSize(22);
	text("To play the game, click on a card to flip it over.\nThere are four pairs in total. Match up all the pairs to win!\nYour time playing the game will be displayed above the cards.", width / 2, 100);
	textSize(18);
	text("Press 'b' to go back to the menu or Enter to continue to the game", width / 2, 230);
}

// shuffle pairs array and set beginning elements in arrays
function initialization() {
	count = 0;
	time = 0;
	speedTimerSeconds = 0;
	speedTimerMinutes = 0;
	startTimer = false;
	stopTimer = false;
	numMousePressed = 0;
	shuffle(pairs, true);

	for (let i = 0; i < pairs.length; i++) {
		covered[i] = true;
	}
	for (let i = 0; i < 2; i++) {
		currentPair[i] = 0;
	}

	// resize card images
	imgCardBack.resize(rectSize, 0);
	imgDiamond.resize(rectSize, 0);
	imgHeart.resize(rectSize, 0);
	imgSpade.resize(rectSize, 0);
	imgClub.resize(rectSize, 0);
}

function displayGame() {
	background('#d1cbcb'); // greyish pink

	if (numMousePressed === 0) { // displays right before player plays game
		textSize(30);
		fill(0);
		text("Pick a Card...", width / 2, 40);
		text("Any Card", width / 2, 260);
	}

	fill(0); // black
	textSize(15);
	for (let i = 0; i < pairs.length; i++) { // generate card pairs
		if (pairs[i] === "Diamonds") {
			image(imgDiamond, rectX + (100 * i), rectY);
		}
		if (pairs[i] === "Hearts") {
			image(imgHeart, rectX + (100 * i), rectY);
		}
		if (pairs[i] === "Spades") {
			image(imgSpade, rectX + (100 * i), rectY);
		}
		if (pairs[i] === "Clubs") {
			image(imgClub, rectX + (100 * i), rectY);
		}
		if (covered[i] === true) {
			image(imgCardBack, rectX + (100 * i), rectY); // generate card back on top of pairs
		}
	}

	if (count === 2) { // once two cards have been uncovered
		if (millis() >= timer + 500) { // timer for 1/2 a second
			count = 0;
			if (pairs[currentPair[0]] != pairs[currentPair[1]]) { // check if cards flipped match each other
				for (let i = 0; i < pairs.length; i++) {
					covered[currentPair[i]] = true;
				}
			}
		}
	}
	// stops timer and game is over once all elements 
	// in covered array are false (all cards flipped and matched)
	if (!covered.includes(true)) {
		stopTimer = true;
		textSize(30);
		fill(0);
		text("Press 'r' to restart", width / 2, 260);
	}

}

// displays players time playing the game
function displayTimer() {
	if (numMousePressed > 0) {
		textSize(50);
		fill(0);
		text(speedTimerMinutes + ":" + speedTimerSeconds, width / 2, 40);
		if (frameCount % 60 === 0 && stopTimer != true) {
			speedTimerSeconds++;
			if (speedTimerSeconds > 59) { // moves onto minutes if game runs more than 59 seconds
				speedTimerMinutes += 1;
				speedTimerSeconds = 0;
			}
		}
	}
}

function mousePressed() {
	numMousePressed += 1;
	if (count < 2) { // only registers two mouse clicks, and no more
		for (let i = 0; i < pairs.length; i++) {
			if (mouseX >= rectX + (100 * i) - 45 && mouseX <= rectX + (100 * i) + 45 && mouseY >= rectY - 45 && mouseY <= rectY + 45 && covered[i] === true) { // card hit test
				count += 1;
				timer = millis();
				covered[i] = false;
				if (count === 1) { // assigns "pair" array index to currentPair array
					currentPair[0] = i;
				} else if (count === 2) {
					currentPair[1] = i;
				}
			}
		}
	}
}

function keyPressed() {
	if (key === 'r' || key === "R") { // restarts game on 'r'/"R" key
		initialization();
	} else if (keyCode === ENTER && playGame === false) { // game starts when enter key pressed following menu
		playGame = true;
	} else if (key === " " && playGame === false) { // show help page when space key pressed
		showHelp = true;
	} else if (key === 'b' || key === 'B' && playGame === false) { // go back to main menu from help page by pressing b
		showHelp = false;
		menu();
	}
}