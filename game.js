//Setting variables
var GameStart;
var GameEnd;

var ShopSelect;

var Stars;
var Lives;
var Meat;
var Wave;
var Points;
var Highscore;
var Timestamp = 0;
var EndGameTimer;

const SCALING = 0.625;
const BoxW = 100;
const BoxH = 107;
const XPosVal = [50,150,250,350,450,550,650,750];

var W1_SPAWNED;
var W2_SPAWNED;
var W3_SPAWNED;
var W4_SPAWNED;
var W5_SPAWNED;
var W6_SPAWNED;
var W7_SPAWNED;
var W8_SPAWNED;
var W9_SPAWNED;
var W10_SPAWNED;

var CrocMeat;
var Crocodile;
var Eagle;

var ChickenDeathSFX;
var EggEatenSFX;
var EggHatchingSFX;
var MeatEatSFX;
var MeatPlaceSFX;
var SplashOutSFX;
var SplashInSFX;

var StarImg;
var FarmerImg;
var ChickenImg;
var EggImg;
var EagleImg;
var TractorImg;
var ChickImg;
var HeartImg;
var FlowerImg;
var MeatImg;
var WheatImg;

var Slider;

//Loading assets
function preload() {
  BACKGROUND = loadImage("/Assets/background.png");
  TractorImg = loadImage("/Assets/tractor.png");
  FarmerImg = loadImage("/Assets/farmer.png");
  MeatImg = loadImage("/Assets/meat.png");
  StarImg = loadImage("/Assets/star.png");
  HeartImg = loadImage("/Assets/heart.png");
  ChickenImg = loadImage("/Assets/rooster.png");
  EggImg = loadImage("/Assets/egg.png");
  ChickImg = loadImage("/Assets/chick.png");
  CrocodileImg = loadImage("/Assets/crocodile.png");
  EagleImg = loadImage("/Assets/eagle.png");
  myFont = loadFont("/Assets/Font/AlloyInk-lgdWw.otf");
  EggEatenSFX = loadSound("/Assets/SFX/egg_eaten.ogg");
  MeatEatSFX = loadSound("/Assets/SFX/meat_eat.ogg");
  MeatPlaceSFX = loadSound("/Assets/SFX/meat_place.ogg");
  ChickenDeathSFX = loadSound("/Assets/SFX/chicken_death.ogg");
  SplashOutSFX = loadSound("/Assets/SFX/splash1.ogg");
  SplashInSFX = loadSound("/Assets/SFX/splash2.ogg");
  EggHatchingSFX = loadSound("/Assets/SFX/egg_hatching.ogg");
  WheatImg = loadImage("/Assets/wheat.png");
  FlowerImg = loadImage("/Assets/flower.png");
}

//Setting up the Game
function setup() {
  //Hide Cursor
  noCursor();

  //Set Canvas size
  createCanvas(1000, 688);

  //Groups
  TitleScreen = new Group();
  UI = new Group();
  Flowers = new Group();
  InGameGrid = new Group();
  PlacedItems = new Group();
  Chickens = new Group();
  Eggs = new Group();
  Enemies = new Group();
  
  //New Game
  NewGame();

  //Slider
  Slider = createSlider(0,1,0.5,0.01);
}

//Main Code
function draw() {
  //Set background
  background(BACKGROUND);

  //Sound Volumes
  ChickenDeathSFX.setVolume(Slider.value());
  EggEatenSFX.setVolume(Slider.value());
  EggHatchingSFX.setVolume(Slider.value());;
  MeatEatSFX.setVolume(Slider.value());;
  MeatPlaceSFX.setVolume(Slider.value());;
  SplashOutSFX.setVolume(Slider.value());;
  SplashInSFX.setVolume(Slider.value());;

  //Set Font
  textFont(myFont);
  
  //Title Screen
  if (GameStart === 0) {
    textSize(55);//Set text size
    text("StopCroc: The Farm",width/2-300,height/2);//Title 
    textSize(22.5);//Set text size
    text("Press enter to start",width/2-150,height*(2/3));
    text("Press Escape to go the help page",width/2-220,height/2+50);
    
    if(Tractor.position.x <= -30) {
      Tractor.position.y = 200;
      Tractor.mirrorX(-1);
      Tractor.setSpeed(2,0);
    }
    else if(Tractor.position.x >= 1030) {
      Tractor.position.y = 600;
      Tractor.mirrorX(1);
      Tractor.setSpeed(-2,0);
    }
  }
  //Game Start
  else if(GameStart === 1) {
    //Remove Titlescreen sprites
    TitleScreen.removeSprites();

    //Make Eggs and Chickens visible
    for (let i = 0; i < Chickens.length; i++) {
      Chickens[i].visible = true;
      Eggs[i].visible = true;
    }

    //Set text size
    textSize(22.5);

    //Farmer
    Farmer.position.x = mouseX;
    Farmer.position.y = mouseY;

    //Background
    image(BACKGROUND, 0, 75, 1000, 750);

    //Loop through Grids in InGameGrid
    for (let i = 0; i < InGameGrid.length; i++) {
      //Checks if cursor is over a grid square
      if(Farmer.overlap(InGameGrid[i])) {
        //Check if mouse has been left clicked
        InGameGrid[i].onMouseReleased = function() {
          //Buying/Placing the meat
          if(ShopSelect == "Meat" && Stars >= 2 && InGameGrid[i].Placed == false) {
            CrocMeat = createSprite(InGameGrid[i].position.x,InGameGrid[i].position.y);
            CrocMeat.scale = 0.6;
            CrocMeat.addImage(MeatImg);
            CrocMeat.depth = 0;
            PlacedItems.add(CrocMeat);
            MeatPlaceSFX.play();
            Stars -= 2;
          }
        }
      }

      //Checks if meat is on a grid
      for (let j = 0; j < PlacedItems.length; j++) {
        if(PlacedItems[j].overlap(InGameGrid[i])) InGameGrid[i].Placed = true;
      }
    }

    //Set thickness of grid lines 
    strokeWeight(3);

    //Draw Grid
    for(i = 0; i < 9; i++) line(BoxW*i,10+((BoxH*2)),BoxW*i,545);
    for(i=0; i < 4; i++) line(0,10+((BoxH*2)+(BoxH*i)),800,10+((BoxH*2)+(BoxH*i)));
    
    //Restart thickness stroke
    strokeWeight(1);
    
    //Main Gameplay
    if(Lives >= 1) {
      ///Checks enemies collisions
      ENEMYEATING();
      ///Checks to see if enemy is over river
      EnemyExit();
      ///Spawning the enemies with diffrent stats on different waves
      if(Wave == 1 & W1_SPAWNED < 3) SpawnCroc(1,3,1,3);//Wave,maxamount,speed,secs
      else if(Wave == 1 & W1_SPAWNED == 3) EndOfWave();//Checks end of wave

      if(Wave == 2 & W2_SPAWNED < 5) SpawnCroc(2,5,2,3);//Wave,maxamount,speed,secs
      else if(Wave == 2 & W2_SPAWNED == 5) EndOfWave();//Checks end of wave

      if(Wave == 3 & W3_SPAWNED < 7) SpawnCroc(3,7,2.5,3);//Wave,maxamount,speed,secs
      else if(Wave == 3 & W3_SPAWNED == 7) EndOfWave();//Checks end of wave

      if(Wave == 4 & W4_SPAWNED < 10) SpawnCroc(4,10,3.5,2.5);//Wave,maxamount,speed,secs
      else if(Wave == 4 & W4_SPAWNED == 10) EndOfWave();//Checks end of wave

      if(Wave == 5 & W5_SPAWNED < 12) SpawnCroc(5,12,4,2.5);//Wave,maxamount,speed,secs
      else if(Wave == 5 & W5_SPAWNED == 12) EndOfWave();//Checks end of wave

      if(Wave == 6 & W6_SPAWNED < 13) SpawnEagle(6,13,5,2.5);//Wave,maxamount,speed,secs
      else if(Wave == 6 & W6_SPAWNED == 13) EndOfWave();//Checks end of wave

      if(Wave == 7 & W7_SPAWNED < 14) SpawnCroc(7,14,5.5,2.25);//Wave,maxamount,speed,secs
      else if(Wave == 7 & W7_SPAWNED == 14) EndOfWave();//Checks end of wave

      if(Wave == 8 & W8_SPAWNED < 15) SpawnEagle(8,15,6.5,2.25);//Wave,maxamount,speed,secs
      else if(Wave == 8 & W8_SPAWNED == 15) EndOfWave();//Checks end of wave

      if(Wave == 9 & W9_SPAWNED < 16) SpawnCroc(9,16,7,2.25);//Wave,maxamount,speed,secs
      else if(Wave == 9 & W9_SPAWNED == 16) EndOfWave();//Checks end of wave

      if(Wave == 10 & W10_SPAWNED < 18) SpawnEagle(10,18,8,1.5);//Wave,maxamount,speed,secs
      else if(Wave == 10 & W10_SPAWNED == 18) EndOfWave();//Checks end of wave
    }
    //Checks if lives are equal or lower than 0
    else GameEnd = true;

    //Displays UI
    UserInterface();
    
    //If the game is ended display gameover UI
    if(GameEnd) GameOver();
  }
  //Help Screen
  else if(GameStart === 2){
    // Tractor.remove();
    TitleScreen.removeSprites();
    
    textSize(64);
    text("Help",width/2-100,100);

    textSize(20);
    text("The aim of the game is to lure away the predators without violence or animal cruelty!\n\nTry and keep the livestock safe by feeding the crocodiles!\n\nClick on the meat icon in the top right side of the screen to select that in your hand.\n\nTo place a meat on the grid you have to left click on it(-2 stars).\n\nYou must place the meats down to stop predators from eating the chickens and eggs.\n\nFor every predator that eats a meat you gain 2 stars back and gain a point.\n\nFor every predator that eats an egg you lose a life.\n\nIf a predator is in the path where there is no meat, chickens, or eggs you'll lose a life.\n\nYou have three lives so make them count!",10,200);

    textSize(32);
    text("PRESS ESCAPE TO GO BACK",width/2-250,670);
  }
  //Display all sprites 
  drawSprites();
}

//Functions
function keyPressed() {
  //Start Game
  if(keyCode===ENTER & GameStart == 0) GameStart = 1;
  //Help Page
  else if(keyCode===ESCAPE & GameStart == 0) {
    GameStart = 2;
    clear();
    Enemies.removeSprites();
    Chickens.removeSprites();
    PlacedItems.removeSprites();
    Eggs.removeSprites();
    InGameGrid.removeSprites();
    UI.removeSprites();
  }
  else if(keyCode===ESCAPE & GameStart == 2) RestartGame();
  //Restart Game
  else if(keyCode===ENTER & GameEnd) {
    GameStart = 0; 
    RestartGame();
  }
}

function NewGame() {
  GameStart = 0;//Set to false as game hasn't started
  GameEnd = false;
  ShopSelect = "Nothing";
  Stars = 6;
  Lives = 3;
  Wave = 1;
  Points = 0;
  Highscore = 0;
  EndGameTimer = 0;
  FlowerSpawn = false;

  W1_SPAWNED = 0;
  W2_SPAWNED = 0;
  W3_SPAWNED = 0;
  W4_SPAWNED = 0;
  W5_SPAWNED = 0;
  W6_SPAWNED = 0;
  W7_SPAWNED = 0;
  W8_SPAWNED = 0;
  W9_SPAWNED = 0;
  W10_SPAWNED = 0;

  //Create and show sprite
  ///Title Screen
  Tractor = createSprite(1000,600);
  Tractor.addImage(TractorImg);
  Tractor.setSpeed(-2, 0);
  TitleScreen.add(Tractor); 

  if(!FlowerSpawn) {
    FlowerX = 0;
    for(i=0; i < 7; i++) {
      FlowerX += 130

      Flower = createSprite(FlowerX+random(50), random(520,570));
      Flower.addImage(FlowerImg)
      Flower.depth = -50
      TitleScreen.add(Flower);
      
      Wheat = createSprite(FlowerX+random(50), random(180,230));
      Wheat.addImage(WheatImg)
      Wheat.depth = -50
      TitleScreen.add(Wheat);
    }
    FlowerSpawn = true;
  }

  ///In-Game
  ShopMeat = createSprite(-100,0);
  ShopMeat.addImage(MeatImg);
  ShopMeat.scale = SCALING;
  UI.add(ShopMeat);

  //Button Grid
  for(var i=0; i < 8; i++) {
    for(var j=0; j < 3; j++) {
      Grid = createSprite(50+(BoxW*i),63+((BoxH*2)+(BoxH*j)),BoxW,BoxH);
      Grid.Placed = false;
      Grid.visible = false;
      InGameGrid.add(Grid);
    }
  }

  //Create Chicken & egg sprites 
  for(var i=0; i < 8; i++) {
      Chicken = createSprite(50+(BoxW*i),575);
      Chicken.addImage(ChickenImg);
      Chicken.scale = SCALING;
      Chicken.visible = false;
      Chickens.add(Chicken);

      Egg = createSprite(50+(BoxW*i),650);
      Egg.addImage("Chick",ChickImg);
      Egg.addImage("Egg",EggImg);
      Egg.changeImage("Egg");
      Egg.scale = SCALING;
      Egg.visible = false;
      Eggs.add(Egg);
  }

  //Farmer Cursor
  Farmer = createSprite(-100,0);
  Farmer.addImage("Farmer", FarmerImg);
  Farmer.addImage("Meat", MeatImg);
  Farmer.changeImage("Farmer");
  Farmer.scale = 0.4;
  Farmer.depth = 75;
  UI.add(Farmer);
}

function UserInterface() {
  //Shop bar
  fill(181, 181, 188);
  rect(800,0, 200,688);
  fill(0);
  text("Item Shop", 840, 30);
  ///Items
  ////Meat
  ShopMeat.position.x = 850
  ShopMeat.position.y = 90
  ShopMeat.onMousePressed = function() {
    ShopSelect = "Meat";
    Farmer.changeImage("Meat");
  }
  text(" = x2", 890, 100);//Price of item
  image(StarImg, 950, 60, 50, 50);
  text("Selected:\n"+ShopSelect,800,200);//What is selected

  //Title bar
  fill(200, 162, 200);
  rect(0, 0, 800, 120);
  fill(0);

  //Display remaining stars
  image(StarImg, 10, 5, 50, 50);
  text("Stars remaining: "+Stars, 70, 35);

  //Display remaining lives
  image(HeartImg, 8, 60, 50, 50);
  text("Lives: "+Lives, 70, 90);
  
  //Display wave
  text("Wave: "+Wave, width/2-120,25);

  //Display points
  text("Points: "+Points, width/2+150, 25);
}

function SPAWNERC(speed) {
  Crocodile = createSprite(random(XPosVal), 160);
  Crocodile.addImage(CrocodileImg);
  Crocodile.setSpeed(speed, 90);
  Crocodile.depth = 50;
  Crocodile.Eaten = "None";
  Crocodile.scale = 0.6;
  Enemies.add(Crocodile);
  SplashOutSFX.play();
}

function SPAWNERE(speed) {
  Eagle = createSprite(random(XPosVal), 160);
  Eagle.addImage(EagleImg);
  Eagle.setSpeed(speed, 90);
  Eagle.depth = 50;
  Eagle.Eaten = "None";
  Eagle.scale = 0.6;
  Enemies.add(Eagle);
}

function SpawnCroc(wave,maxamount,speed,secs) {
  if(Wave == wave & Enemies.length != maxamount) {
    if (millis() - Timestamp > (secs*1000)) {
      SPAWNERC(speed);

      if(wave == 1) W1_SPAWNED += 1;
      if(wave == 2) W2_SPAWNED += 1;
      if(wave == 3) W3_SPAWNED += 1;
      if(wave == 4) W4_SPAWNED += 1;
      if(wave == 5) W5_SPAWNED += 1;
      if(wave == 6) W6_SPAWNED += 1;
      if(wave == 7) W7_SPAWNED += 1;
      if(wave == 8) W8_SPAWNED += 1;
      if(wave == 9) W9_SPAWNED += 1;
      if(wave == 10) W10_SPAWNED += 1;

      Timestamp = millis();
    }
  }
}

function SpawnEagle(wave,maxamount,speed,secs) {
  if(Wave == wave & Enemies.length != maxamount) {
    if (millis() - Timestamp > (secs*1000)) {
      SPAWNERE(speed);

      if(wave == 1) W1_SPAWNED += 1;
      if(wave == 2) W2_SPAWNED += 1;
      if(wave == 3) W3_SPAWNED += 1;
      if(wave == 4) W4_SPAWNED += 1;
      if(wave == 5) W5_SPAWNED += 1;
      if(wave == 6) W6_SPAWNED += 1;
      if(wave == 7) W7_SPAWNED += 1;
      if(wave == 8) W8_SPAWNED += 1;
      if(wave == 9) W9_SPAWNED += 1;
      if(wave == 10) W10_SPAWNED += 1;

      Timestamp = millis();
    }
  }
}

function ENEMYEATING() {
  //Checking grid collisons
  for (let o = 0; o < InGameGrid.length; o++) {
      //Enemy eating Meat
      for (let j = 0; j < Enemies.length; j++) {
        for (let o = 0; o < PlacedItems.length; o++) {
          if(Enemies[j].overlap(PlacedItems[o]) & (Enemies[j].Eaten != "NPC" & Enemies[j].Eaten != "Meat")) {
            MeatEatSFX.play();
            Enemies[j].Eaten = "Meat";
            Enemies[j].mirrorY(-1);
            Enemies[j].setSpeed(2.5,-90);
            PlacedItems[o].remove();
          }
        }
      }

      //Enemy eating Chicken
      for (let j = 0; j < Enemies.length; j++) {
        for (let o = 0; o < Chickens.length; o++) {
          if(Enemies[j].overlap(Chickens[o]) & (Enemies[j].Eaten != "Meat" & Enemies[j].Eaten != "NPC")) {
            ChickenDeathSFX.play();            
            Enemies[j].Eaten = "NPC";
            Enemies[j].mirrorY(-1);
            Enemies[j].setSpeed(2.5,-90);
            Chickens[o].remove();
          }
        }
      }

      //Enemy eating Egg
      for (let j = 0; j < Enemies.length; j++) {
        for (let o = 0; o < Eggs.length; o++) {
          if(Enemies[j].overlap(Eggs[o]) & (Enemies[j].Eaten != "Meat" & Enemies[j].Eaten != "NPC")) {
            EggEatenSFX.play();
            Enemies[j].Eaten = "NPC";
            Enemies[j].mirrorY(-1);
            Enemies[j].setSpeed(2.5,-90);
            Eggs[o].remove();
            Lives -= 1;
          }
        }
      }

      //Enemy going off the scene
      for (let j = 0; j < Enemies.length; j++) {
        if(Enemies[j].position.y > 688) {
          Enemies[j].remove();
          Lives -= 1;
        }
      }

      //Free up grid space
      if(PlacedItems.overlap(InGameGrid[o]));
      else InGameGrid[o].Placed = false;
  }
}

function EnemyExit() {
  //Loop through the enemy group
  for(i = 0; i < Enemies.length; i++) {

    //Checks if enemy is above water and they ate something
    if(Enemies[i].position.y <= 160 & Enemies[i].Eaten != "None") {
      
      //Checks if crocodile is the enemy, then play sound splash
      if(Enemies.contains(Crocodile)) SplashInSFX.play();

      //Reward if eaten meat
      if(Enemies[i].Eaten == "Meat") {
        Stars += 2;
        Points += 1;
      }

      //Minus point
      if(Enemies[i].Eaten == "NPC") {
        Points -= 1;
      }

      //Remove the enemy
      Enemies[i].remove();
    }
  }
}

function EndOfWave() {
  if(Enemies.length == 0 & Wave != 10)
  {
    Wave += 1;
    Stars += 1;
  }
  else if(Enemies.length == 0 & Wave == 10) GameEnd = true; 
}

function RestartGame() {
  NewGame();
}

function GameOver() {
  //Every one second that goes by once function is called
  if(frameCount%60 == 0 & EndGameTimer != 6 & Lives >= 1) EndGameTimer += 1;

  //If Lives is bigger than 1 then
  if(Lives >= 1) {
    //Play sound on 0 seconds
    if(EndGameTimer == 0) if(!EggHatchingSFX.isPlaying()) EggHatchingSFX.play();

    //After 4 seconds Change egg sprite to chick
    if(EndGameTimer == 4) for(i = 0; i < Eggs.length; i++) Eggs[i].changeImage("Chick");  
  }

  //After 6 seconds or 0 seconds if lives is less than 1
  if((EndGameTimer == 6) || (Lives < 1 & EndGameTimer == 0)) {
  
    //Clear the canvas of all sprites and others
    clear();
    Enemies.removeSprites();
    Chickens.removeSprites();
    PlacedItems.removeSprites();
    Eggs.removeSprites();
    InGameGrid.removeSprites();
    UI.removeSprites();

    //Setting and reading highscore
    if(Points >= Highscore) Cookies.set("Highscore", Points);

    if(Cookies.get('Highscore') == null) Cookies.set("Highscore", 0);
    
    Highscore = Cookies.get('Highscore');

    //Background
    image(BACKGROUND, 0, 0, 1000, 688);

    //Text
    fill(0);//colour
    textSize(50);//size

    //Display Game Over
    text('Game Over', width/2-150, 50);

    //Checks whether you have lives or not
    if(Lives >= 1) text("You Won!", width/2-150, 150);
    else text("You Lost!", width/2-150, 150);

    //Diplay your points
    text("Highscore: "+Highscore, width/2-200, 300);
    text("Score: "+Points, width/2-150, 450);

    //Replay
    text("Press ENTER to replay", width/2-300, 600);
  }
}