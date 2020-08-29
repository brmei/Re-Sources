/*global create createCanvas, background, noFill, strokeWeight, ellipse, stroke, fill, noStroke, circle, triangle, rect 
soundFormats, loadSound, floor, keyIsDown, color, frameRate, p5.Vector, collideRectRect
translate, p5, createVector*/
let gridSpace = 32; //number of pixels per unit
let friction = 2; //multiplier momentum is reduced by every frame
let inputMag = 6; //how much momentum a player inputs
let gameHeight = window.innerHeight*0.8; //size of canvas height
let gameWidth = window.innerWidth*0.9; //size of canvas width
let playerWidth = gridSpace;
let playerHeight = gridSpace;
let spawn;
let cam1;
let gravity = 0.5;
let UIOn = false;


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
  rectMode(CORNER)
  strokeWeight(0);
  fill(200);
  spawn = createVector(25*gridSpace,0);
  newPlayer = new Player(spawn);
  planet = new Planet(50,0);
  cam1 = new Cam(spawn);
  newPlayer.inventory.addItem(new Item("Food"));
  newPlayer.inventory.addItem(new Item("Water"));
  newPlayer.inventory.addItem(new Item("Rocks"));
  
}

function draw() {
  //console.log(frameRate());
  //runs every tick
  receiveInput();
   
  push();
  cam1.active();
  newPlayer.update(planet);
  newPlayer.move(planet.getTilemap());
  planet.show();
  newPlayer.show();
  pop();
  if(UIOn){
    newPlayer.inventory.show(newPlayer.pos.x,newPlayer.pos.y);
    console.log("😂😂");
  }
  showStats();
}

const make2Darray = (cols,rows) => new Array(cols).fill().map(item =>(new Array(rows)))

function showStats(){
  let stats = newPlayer.getStats();
  push();
  translate(width*0.8,height*0.1);
  rectMode(CORNER);
  let health = stats[0];
  stroke(150,150,150)
  strokeWeight(2)
  fill(255,0,0,100)
  rect(0,0, 250, 15, 10);
  
  let oxygen = stats[0];
  stroke(150,150,150)
  strokeWeight(2)
  fill(255,0,0,100)
  rect(0,0, 250, 15, 10);
  
  let food = stats[0];
  stroke(150,150,150)
  strokeWeight(2)
  fill(255,0,0,100)
  rect(0,0, 250, 15, 10);
  
  let water = stats[0];
  stroke(150,150,150)
  strokeWeight(2)
  fill(255,0,0,100)
  rect(0,0, 250, 15, 10);
  pop();
}

function receiveInput(){
  if(keyIsDown(39)||keyIsDown(68)){
    //newPlayer.vector.add(inputMag);
    newPlayer.addForce(createVector(inputMag,0))
  }
  if(keyIsDown(37)||keyIsDown(65)){
    //newPlayer.vector.sub(inputMag);
    newPlayer.addForce(createVector(-inputMag,0))
  }
  if(keyIsDown(38)||keyIsDown(87)){
    newPlayer.jump(7,planet.getTilemap());
  }
}

function keyPressed(){
  if(keyIsDown(81)){
    if(UIOn){
        newPlayer.inventory.switchItem();
      } else {
        UIOn = true;
      }
  } else if(keyIsDown(27)) {
    UIOn = false;
  } else if(keyIsDown(85)){
    
  }
}

function mouseClicked(){
  for (var i=0;i<planet.getTilemap().length;i++){
      for (var j=0;j<planet.getTilemap()[i].length;j++) {
        if(collidePointRect(mouseX, mouseY,i*gridSpace,j*gridSpace,gridSpace,gridSpace)){
          this.array[i][j] = ".";
          console.log("Digging this");
        }
      }
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



class Ship {
  constructor(x,y) {
    this.pos = createVector(x,y);
    this.fuel;
    this.energy;
    
  }
  
  playerClose(player) {
    if(this.pos.sub(player.pos).mag() < 3*gridSpace) return true;
  }
  showButtons() {}
}

class Tilemap {
  
  constructor(x,y,heightMap) {
    this.array = make2Darray(y,x);
    this.Gen(heightMap);
    //this.tempGen();
  }
  
  Gen(heightMap){
    for (let i=0;i<this.array.length;i++){
      for (let j=0;j<this.array[i].length;j++) {
        this.array[i][j] = ".";
      }
    }
    let start = (this.array[0].length-heightMap.length)/2;
    for(let y=0;y<this.array.length;y++){
      for(let x=0;x<heightMap.length;x++){
        if(y<heightMap[x]){
          this.array[this.array.length-y-1][x+start] = ",";
        }
      }
    }
    this.array [10][14]= "s";
    this.array [10][15]= "w";
    this.array [9][15]= "w";
    this.array [8][15]= "w";
    this.array [10][16]= "w";
    this.array [9][16]= "w";
    this.array [8][16]= "w";
  }
  
  tempGen(){
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
    
    this.array [11][15]= "s";
    
    // 
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
            break;
          case "w":
            fill(0,0,100);
            break;
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

  constructor(size,richness) {
    this.side = 0;
    this.size = size;
    this.richness = richness;
    this.atmosphere = 8;
    this.sideN = new Tilemap(size,floor(size/2),this.generateLandscape());
    //this.sideN.tempGen();
    this.sideE = new Tilemap(size,floor(size/2),this.generateLandscape());
    //    this.sideE.tempGen();
    this.sideS = new Tilemap(size,floor(size/2),this.generateLandscape());
    //  this.sideS.tempGen();
    this.sideW = new Tilemap(size,floor(size/2),this.generateLandscape());
    //  this.sideW.tempGen();
  }
  
  getRelativeTilemap(n) {
    //rotates 90 degrees for every increment of n
    switch ((this.side+n)%4) {
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
  
  generateLandscape(){
    noiseSeed(random(999));
    let length = (this.size-this.atmosphere*2);
    let maxHeight = (this.size/2)-this.atmosphere;
    let minHeight = maxHeight*0.7;
    //console.log(length)
    let heights = [];
    let r = random(10)
    for(let i=0;i<length;i++){
      let angle = i*2*PI/length;
      let height = minHeight+(maxHeight-minHeight)*noise(r*cos(angle),r*sin(angle))
      heights.push(height);
    }
    //console.log(heights)
    return heights;
  }
  
  
  rotate(n){
    this.side = (this.side+n+4)%4;
  }
  
  show() {
    background(50,0,70);
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






class Fire {
  constructor(health){
    this.maxHealth = health;
    this.health = health;
  }
  
  getHealth(){
    return this.health;
  }
  
  putOut(){
    this.health-=1;
  }
  
  update(){
    this.health+=0.1;
    this.show();
  }
  
  show(){
    if(this.health>0.7*this.maxHealth){
      
    }
  }
}