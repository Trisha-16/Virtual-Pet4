var dog,sadDog,happyDog,garden,washroom,bedroom,database;
var foodS,foodStock;
var fedTime,lastFed,currentTime;
var feed,addFood;
var foodObj;
var gameState,readState;
var eat,sleep,bath,play;
function preload(){
sadDog=loadImage("images/Dog.png");
happyDog=loadImage("images/Happy.png");
washroom=loadImage("images/WashRoom.png")
bedroom=loadImage("images/BedRoom.png")
garden=loadImage("images/Garden.png")
}

function setup() {
  database=firebase.database();
  createCanvas(1000,500);
  
  foodObj = new Food();

  foodStock=database.ref('Food');
  foodStock.on("value",readStock); 

  fedTime=database.ref('FeedTime');
  fedTime.on("value",function(data){ 
    lastFed=data.val();
  });

  //read game state from database
  readState=database.ref('gameState');
  readState.on("value",function(data){
    gameState=data.val();
  });
   
  dog=createSprite(550,250,10,10);
  dog.addImage(sadDog);
  dog.scale=0.15;
  
  eat=createButton("FEED DRAGO");
  eat.position(515,15);
  

  addFood=createButton("ADD FOOD");
  addFood.position(400,15); 
  addFood.mousePressed(addFoods);

  sleep=createButton("SLEEP")
  sleep.position(365,55);
  
  bath=createButton("BATH")
  bath.position(480,55);

  play=createButton("PLAY")
  play.position(320,15);
 
  eat.mousePressed(Eat);
  eat.mousePressed(feedDog);
  sleep.mousePressed(Sleep);
  bath.mousePressed(Bath);
  play.mousePressed(Play);
}

function draw() {
  currentTime=hour();
 
  
  if(gameState!=='Hungry'){
    addFood.hide();
    eat.show();
  }
  else{
    addFood.show();
    eat.show(); 
    foodObj.display();
    drawSprites();
  }
  
  if(gameState=="playing"){
    foodObj.garden();
  }
  else if(gameState=="sleeping"){
   foodObj.bedroom();
  }
  else if(gameState=="bathing"){
    foodObj.washroom();
  }
  else{
    update("Hungry")
  }
}

//function to read food Stock
function readStock(data){
  foodS=data.val();
  foodObj.updateFoodStock(foodS);
}


//function to update food stock and last fed time
function feedDog(){
  dog.addImage(happyDog);

  foodObj.updateFoodStock(foodObj.getFoodStock()-1);
  database.ref('/').update({
    Food:foodObj.getFoodStock(),
    FeedTime:hour(),
    gameState:"Hungry"
   
  })
 
}

//function to add food in stock
function addFoods(){
  
  foodS++;
  database.ref('/').update({
    Food:foodS
  })
}

//update gameState
function update(state){
  database.ref('/').update({
    gameState:state
  })
}
function Play(){
  update("playing")
}

function Bath(){
  update("bathing")
}

function Sleep(){
  update("sleeping")
}

function Eat(){
  update("Hungry")
}