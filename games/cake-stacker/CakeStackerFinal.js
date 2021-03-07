// README
/*
 Cake Stacker
 Maria Pasyechnyk
 mpasyech
 
 INSTRUCTIONS
 When you first launch the program you see a menu. Press keys 1, 2, or 3 to select how
 many layers you want your cake to be. To play the game, use the arrow keys to move the
 tray back and forth across the canvas (you can hold down the keys to move) to catch
 the falling cakes. Once all the layers are stacked, you'll be prompted to click
 with your mouse anywhere on the screen. When the Happy Birthday sign comes up at the end of the game,
 you see a replay and home button. You can press the replay button to replay the level,
 or press home to go back to the main menu.
 
 
 CODING QUALITY AND VISUAL DESIGN
 I had a great time working on this code and the visual designs. I drew the cake, tray,
 menu, and both the home and replay buttons through a digital drawing app and uploaded the graphics to the code. I did
 that because I wanted to have a unified look throughout the whole game - I wanted to have a certain
 theme going on, which I thought would be easier to do if I drew a lot of the aspects myself. 
 I also created a thump sound for when the cakes stack and included a sound when the
 game ends.
 The code is very clean, and every variable I have is crucial to making the game run. There's
 an intitialization function to help restore every aspect of the game to its original
 position if the player wants to restart the game. I created functions for every part of
 the gameplay: menu, drawing cakes and tray, tray movement, hit tests, score, and functions
 for different gameover states. I've also created functions for repeated code, like
 cakes resetting at the top of the canvas, drawing the stacked canvas, and drawing out background elements. These
 two functions clean up the code a lot because if I had to repeat a for loop
 and four more lines whenever resetting the arrays, the code would get really redundant. 
 I also made the keyPressed function functionalities simple - I kept myself from repeating
 code that didn't need to be repeated. Instead of calling initialization() and redefining 
 playGame three separate times, I created an if statement checking to see if a certain
 variable was more than zero to reset everything I needed to. Otherwise, everything would 
 reset as soon as any random key was pressed if I had put any statements directly under the
 keyPressed function and not in each if and else if statement. 
 I was stuck on coding the stacked cakes to appear in every frame as the game
 was running. I thought about changing the array somehow (push pop situation), but I'm
 not sure how to do that in javascript p5, plus we haven't learnt that yet. So instead,
 I decided to create a separate array that would display the stacked cakes.
 All in all, I'm really proud of my code. I'm really happy with how everything is nicely condensed
 and organized and my personal visuals.
 
 VIDEO
 https://youtu.be/_WcqRbKbLSg
 
 
 RELEASE
 I Maria Pasyechnyk grant permission to CS 105 course staff to use
 my Final Project program and video for the purpose of promoting CS 105.
 */


// images
let imgCake;
let imgTray;
let imgCandles; // unlit candles
let imgLitCandles;
let imgBackground;
let imgMenu; // background image for the main menu
let imgReplay; // replay button
let imgHome; // home button

// sounds
let partyHorn; 
let cakeStack;

// arrays holding x, y position of cakes and their speed
let cakeX = [];
let cakeY = [];
let cakeSpeed = [];

// variables
let numLayers; // # of layers to stack
let layersFalling = 7; // # of layers falling

// track tray x, y coordinate 
let trayX;
let trayY;

// hit test range for cake hitting tray
let trayHit;

// keeps track of how many layers stacked and y value of highest cake
let layersStacked; 
let stackY;

let playGame = false; // when game ends (last layer stacked)
let ending = false; // run functions after last layer stacked
let candleLit = false; // tracks when candles light up and when user can continue
let mouseWasPressed; // tracks how many times mouse is pressed

// load in images and sounds
function preload() {
  imgCake = loadImage("data/cake.png");
  imgTray = loadImage("data/tray.png");
  imgCandles = loadImage("data/candles.png");
  imgLitCandles = loadImage("data/lit_candles.png");

  imgBackground = loadImage("data/original_confetti.jpg"); // pinterest.ca
  imgMenu = loadImage("data/main_menu.jpg"); // drawn from reference image at wallup.net

  imgReplay = loadImage("data/replay_button.png");
  imgHome = loadImage("data/home.png");

  partyHorn = loadSound("data/party_horn.wav"); // youtube.ca from user Redlion 517
  cakeStack = loadSound("data/cake_stack.wav");
}

// run menu when first launched 
function setup() {
  createCanvas(550, 750);
  background(220);
  imageMode(CENTER, CENTER);
  textFont("Coiny");
  trayY = height - 50; // tray Y position
  menu();
  initialization();
}

// run game's functions
function draw() {
  if (playGame) {
    drawCakes();
    displayScore();
    movement();
    hitTest();
    gameOver();
  }
  checkGameState();
}

// draw menu
function menu() {
  imgMenu.resize(0, height);
  image(imgMenu, width / 2, height / 2);

  fill(0);
  textSize(60);
  textAlign(CENTER, CENTER);
  text("CAKE STACKER", width / 2, height / 3 - 15);
  textSize(35);
  textAlign(LEFT);
  text("1. Five layers", width / 2, height * 0.63);
  text("2. Ten layers", width / 2, height * 0.73);
  text("3. Fifteen layers", width / 2, height * 0.83);
}

// initialize arrays for cake position and set beginning variables
function initialization() {
  imgCake.resize(100, 0); 
  imgTray.resize(130, 0); 
  imgBackground.resize(width, 0);
  imgCandles.resize(100, 0);
  imgLitCandles.resize(100, 0);
  imgReplay.resize(30, 0);
  imgHome.resize(30, 0);

  candleLit = false;
  stackY = 0;
  layersStacked = 0;  
  trayX = width / 2; // intial x position of tray
  trayHit = 0; // no stacked cakes
  let cakeSpacing = width / 5; // where cakes intitially positioned at top of screen

  // initializing arrays
  // starting position of layers at top of screen
  for (let i = 0; i < layersFalling; i++) {
    cakeX[i] = cakeSpacing * (i + 1) - 55;
    cakeY[i] = 0; 
    cakeSpeed[i] = random(2, 5);
  }
}

// best function; cleans up code nicely
// access array elements in cake x, y position and speed and reset them
function restartPosition(n) {
  cakeX[n] = random(50, width - 50);
  cakeY[n] = 0; 
  cakeSpeed[n] = random(2, 5);
}

// best loading and displaying image
// draw stacked cakes
function drawStacked() {
  for (let i = 0; i < layersStacked; i++) {
    stackY = (i + 1) * 40;
    image(imgCake, trayX, trayY - stackY);
    trayHit = trayY - stackY;
  }
}

// display score (# of layers stacked) at top right corner 
function displayScore() {
  // rectangle outline for score
  rectMode(CORNER);
  noFill();
  stroke(0);
  rect(width - 200, 23, 190, 30, 20);
  
  // map()
  // progress bar 
  let bar = map(layersStacked, 0, numLayers, 0, 190); 
  noStroke();
  fill('#37AFB4'); // teal
  rect(width - 200, 23, bar, 30, 20);

  // display num of layers stacked
  textAlign(CENTER);
  textSize(20);
  fill(255); // white
  text(layersStacked + " / " + numLayers + " layers stacked", width - 105, 40);
}

// draw background, tray, and score
function drawBackground() {
  image(imgBackground, width / 2, height / 2);  // dimensions: 100 X 56

  // table for tray
  rectMode(CORNER);
  fill("#B8F4FA"); // light blue
  rect(0, height - 30, width, 30);

  image(imgTray, trayX, trayY);  // tray dimensions: 130 X 78

  displayScore();
  drawStacked();
}

// draw cakes falling and stacked cakes
function drawCakes() {
  drawBackground();

  // set cake falling speed and draw falling cake
  for (let i = 0; i < layersFalling; i++) {
    cakeY[i] += cakeSpeed[i]; 
    image(imgCake, cakeX[i], cakeY[i]); 

    if (cakeY[i] >= height + 32) { // cakeY[i] = 0 when hits bottom of screen
      restartPosition(i);
    }
    drawStacked();
  }
}

// movement of tray controlled by player
function movement() {
  trayX = constrain(trayX, 70, width - 70); 
  if (keyIsDown(LEFT_ARROW)) {
    trayX -= 3;
  } else if (keyIsDown(RIGHT_ARROW)) {
    trayX += 3;
  }
}

// best hit test
// tracks when cake hits tray and when cake hits stacked layers and plays sound
function hitTest() {
  let topConditional; // hit past certain y position (min y value)
  let bottomConditional; // hit before certain y position (max y value)

  // best for loop; has the best content
  for (let i = 0; i < layersFalling; i ++) {
    if (layersStacked === 0) { // if tray empty
      bottomConditional = height - 20;
      topConditional = trayY;
    } else {
      bottomConditional = trayHit + 10;
      topConditional = trayHit;
    }
    if (cakeY[i] + 45 >= topConditional && cakeY[i] + 45 <= bottomConditional && cakeX[i] - 50 >= trayX - 65 && cakeX[i] + 50 <= trayX + 65) {
      restartPosition(i);
      layersStacked += 1;
      cakeStack.play();
    }
  }
}

// clear falling cakes and display message when last layer stacked
function gameOver() {
  if (layersStacked === numLayers) { // check when all layers stacked
    playGame = false;
    ending = true;
    mouseWasPressed = 0; // sets # times mouse was pressed to zero
    drawBackground();

    image(imgCandles, trayX + 3, trayHit - 35); // draw unlit candles on top of cake
    rectMode(CENTER, CENTER);

    // mauve rounded rectangle 
    noStroke();
    fill("#B97296"); // mauve 
    rect(width / 2, height / 2, 400, 80, 20);

    fill(255); // white
    textAlign(CENTER, CENTER);
    textSize(30);
    text("Click anywhere to light up", width / 2, height / 2 - 15);
    text("the candles", width / 2, height / 2 + 15);
  }
}

// display happy birthday message and play horn sound
function birthday() {
  if (ending === true) {
    candleLit = true;
    image(imgLitCandles, trayX + 3, trayHit - 35); // draw lit candles

    // mauve rounded rectangle
    fill("#B97296"); // mauve
    rectMode(CENTER, CENTER);
    rect(width / 2, height / 2, 400, 80, 20);

    textAlign(CENTER, CENTER);
    textSize(30);
    fill(255); // white
    text("Happy Birthday!", width / 2, height / 2);

    // replay and home buttons
    image(imgReplay, width / 2 + 150, height / 2);
    image(imgHome, width / 2 - 150, height / 2);

    // if mouse pressed more than once after ending, then sound doesn't play
    if (mouseWasPressed === 0) {
      partyHorn.play();
    }
  }
}

// hit test for replay and home button once candles are lit and bday message pops up
function checkGameState() {
  if (mouseIsPressed && candleLit) {
    if (mouseX >= width / 2 - 165 && mouseX <= width / 2 - 135 && mouseY >= height / 2 - 15 && mouseY <= height / 2 + 15) {
      menu();
      ending = false;
    } else if (mouseX <= width / 2 + 165 && mouseX >= width / 2 + 135 && mouseY >= height / 2 - 15 && mouseY <= height / 2 + 15) {
      ending = false;
      playGame = true;
      initialization();
    }
  }
}

// run birthday function once mouse is pressed at end of game
function mousePressed() {
  birthday();
  mouseWasPressed += 1;
}

// how many layers to stack
function keyPressed() {
  let newNumLayers = 0; // # layers to stack decided by player

  if (key === '1') {
    newNumLayers = 5;
  } else if (key === '2') {
    newNumLayers = 10;
  } else if (key === '3') {
    newNumLayers = 15;
  }

  // best conditional (avoids repetition)
  // start game only if 1, 2, or 3 key is pressed
  if (newNumLayers > 0) {
    initialization();
    playGame = true;
    numLayers = newNumLayers;
  }
}
