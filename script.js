/*global create createCanvas, background, noFill, strokeWeight, ellipse, stroke, fill, noStroke, circle, triangle, rect 
soundFormats, loadSound, floor, keyIsDown*/
let gridspace = 32;
let newPlayer;
let newPlanet;

//Music
let space1;


function preload() {
  soundFormats("mp3");
  space1 = loadSound("https://cdn.glitch.com/16c26bfa-0e05-488d-8525-9a6fbe0379a6%2FSpace_1.mp3?v=1598642738842");
}


function setup() {
  // Code here runs only once
  createCanvas(800, 600);
  
  fill(200);
  
  newPlayer = new Player();
  newPlanet = new Planet(50,0);
}

function draw() {
  //runs every tick
  background(50,0,70);
  receiveInput();
  newPlayer.show();
}

class Player {
  
  constructor() {
    this.x = 0;
    this.y = 0;
    this.speed = 5;
  }
    
  show(){
    rect(this.x,this.y,10,10);
  }
  
  moveLeft(){
    this.x -= this.speed;
  }
  
  moveRight(){
    this.x += this.speed;
  }
}

const make2Darray = (cols,rows) => new Array(cols).fill().map(item =>(new Array(rows)))

function receiveInput(){
  if(keyIsDown(39)){
    newPlayer.moveRight();
  }
  if(keyIsDown(37)){
    newPlayer.moveLeft();
  }
}

class Tilemap {
  
  constructor(x,y) {
    this.array = make2Darray(x,y);
    
    //temporary pregenerated tilemap
    for(var i=0; i<this.array.length;i++){
      for(var j in this.array[i]) {
        j = ".";
      }
    }
    console.log(this.array);
  }
  
  show(){
    
  }
}

class Planet {

  constructor(size = 50,richness) {
    this.side = 0;
    this.size = size;
    this.richness = richness;
    this.sideN = new Tilemap(size,floor(size/2));
    this.sideE = new Tilemap(size,floor(size/2));
    this.sideS = new Tilemap(size,floor(size/2));
    this.sideW = new Tilemap(size,floor(size/2));
  }
  
  show(){
    //looks at current side of planet and renders it
    switch (this.side) {
      case 0:
        this.sideN.show();
        break;
      default:
        return;
    }
  }
   
}

//processing keyboard inputs
// window.addEventListener("keydown",function (e) {
//   if(e.defaultPrevent) {
//     return;
//   }
  
//   switch (event.key) {
//     case "ArrowDown":
//       break;
//     case "ArrowDown":
//       break;
//     case "ArrowDown":
//       break;
//     case "ArrowDown":
//       break;
//     default:
//       return;
//   }
//   e.preventDefault();
// },true);