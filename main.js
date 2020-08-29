/*global create createCanvas, background, noFill, strokeWeight, ellipse, stroke, fill, noStroke, circle, triangle, rect 
soundFormats, loadSound, floor, keyIsDown, color, frameRate, p5.Vector, collideRectRect
translate, p5, createVector*/
let gridSpace = 32; //number of pixels per unit
let friction = 2; //multipliet momentum is reduced by every frame
let inputMag = 10; //how much momentum a player inputs
let gameHeight = 600; //size of canvas height
let gameWidth = 800; //size of canvas width
let playerWidth = gridSpace;
let playerHeight = gridSpace;
let spawn;
let cam1;
let gravity = 0.5;

let newPlayer;
let planet;

//Movement


//Music
let space1;


function preload() {
  soundFormats("mp3");
  space1 = loadSound("https://cdn.glitch.com/16c26bfa-0e05-488d-8525-9a6fbe0379a6%2FSpace_1.mp3?v=1598642738842");
}


function setup() {
  // Code here runs only once
  createCanvas(gameWidth, gameHeight);

  fill(200);
  spawn = createVector(25*gridSpace,0);
  newPlayer = new Player(spawn);
  planet = new Planet(50,0);
  
  cam1 = new Cam(spawn);
}

function draw() {
  //console.log(frameRate());
  //runs every tick
  background(50,0,70);
  receiveInput();
  cam1.active();
  planet.show();
  newPlayer.move(planet.getTilemap());
  newPlayer.show();
  newPlayer.isGrounded(planet);
  
}

const make2Darray = (cols,rows) => new Array(cols).fill().map(item =>(new Array(rows)))

function receiveInput(){
  if(keyIsDown(39)||keyIsDown(68)){
    newPlayer.vector.add(inputMag);
  }
  if(keyIsDown(37)||keyIsDown(65)){
    newPlayer.vector.sub(inputMag);
  }
  if(keyIsDown(38)||keyIsDown(87)){
    newPlayer.jump(inputMag,planet.getTilemap());
  }
}

class Cam {
  constructor(spawnpoint) {
    this.x = -spawnpoint.x;
    this.y = -spawnpoint.y;
  }
  active() {
    translate(this.x + (gameWidth - playerWidth) / 2,this.y + (gameHeight - playerHeight) / 2);
  }
  snapY(y) {
    this.y = y;
  }
  snapX(x) {
    this.x = x;
  }
  snap(x, y){
    this.x = x;
    this.y = y;
  }
  shift(x, y){
    this.x += x;
    this.y += y;
  }
}

class Item {
  constructor(id,count) {
    this.id = id;
    this.count = count;
  }
}

class Inventory {
  constructor() {
    this.items = [];
  }
  
  addItem(i) {
    this.items.push(i);
  }
}



class Tilemap {
  
  constructor(x,y) {
    this.array = make2Darray(y,x);
    //, blocks
    //. air
    //temporary pregenerated tilemap
    for (var i=0;i<this.array.length;i++){
      for (var j=0;j<this.array[i].length;j++) {
        this.array[i][j] = ",";
      }
    }
    for (var i=0;i<floor(this.array.length/2);i++){
      for (var j=0;j<this.array[i].length;j++) {
        this.array[i][j] = ".";
      }
    }
        this.array[10][27] = ",";
    this.array[11][27] = ",";
        this.array[11][28] = ",";
           this.array[8][24] = ",";
    
    this.array [10][14]= "s";
    // console.log(this.array);
    
    
  }
  
  getArray(){
    return this.array;
  }
  
  show(s){
    //for every tile create tile object
    for (var i=0;i<this.array.length;i++){
      for (var j=0;j<this.array[i].length-2*i;j++) {
        var tileTexture;
        //temporary color
        switch (this.array[i][j+i]) {
          case ".":
            fill(50,0,70);
            break;
          case ",":
            fill(100,100,100);
            break;
          case "s":
            fill(200,0,0);
          default:
            break;
        }
        switch (s) {
          case 0:
            rect((j+i)*gridSpace,i*gridSpace,gridSpace,gridSpace);
            break;
          case 1:
            rect((planet.size-i)*gridSpace,(j+i)*gridSpace,gridSpace,gridSpace);
            break;
          case 2:
            rect((planet.size-j-i)*gridSpace,(planet.size-i)*gridSpace,gridSpace,gridSpace);
            break;
          case 3:
            rect(i*gridSpace,(planet.size-j-i)*gridSpace,gridSpace,gridSpace);
            break;
          default:
            break;
        }
      }
    }
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
  
  getRelativeTilemap(n) {
    //rotates 90 degrees for every increment of n
    switch (this.side+n) {
      case 0:
        return this.sideN;
        break;
      case 1:
        return this.sideE;
        break;
      case 2:
        return this.sideS;
        break;
      case 3:
        return this.sideW;
        break;
      default:
        return;
    }
  }
  
  getTilemap(){
    return this.getRelativeTilemap(0).getArray();
  }
  
  rotate(n){
    this.side + n;
    if (this.side < 0) {
      this.side += 4;
    } else if (this.side > 3) {
      this.side -= 4;
    }
  }
  
  show() {
    //looks at current side of planet and renders it
    this.getRelativeTilemap(0).show(0);
    this.getRelativeTilemap(1).show(1);
    this.getRelativeTilemap(2).show(2);
    this.getRelativeTilemap(3).show(3);
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