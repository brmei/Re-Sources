/*global create createCanvas, background, noFill, strokeWeight, ellipse, stroke, fill, noStroke, circle, triangle, rect 
soundFormats, loadSound, floor, keyIsDown, color, frameRate, p5.Vector, collideRectRect
translate, p5, createVector*/
let gridSpace = 32; //number of pixels per unit
let friction = 2; //multiplier momentum is reduced by every frame
let inputMag = 6; //how much momentum a player inputs
let gameHeight = window.innerHeight*0.8; //size of canvas height
let gameWidth = window.innerWidth*0.9; //size of canvas width
//let gameHeight = 800 //size of canvas height
//let gameWidth = 1700; //size of canvas widthee

let sidebarWidth = gameWidth/2-gameHeight/2;
let sidebarRow = gameHeight/10;
let playerWidth = gridSpace;
let playerHeight = gridSpace;
let spawn;
//let cam1;
let gravity = 0.5;
let UIOn = false;
let inRange = false;

let player;
let planet;

//Items
let lSpag;
let water;
let oxy;
let SO;

//Recipes
let SO_r; //Spaghetti-Oxide
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
  rectMode(CORNER);
  strokeWeight(0);
  fill(200);
  spawn = createVector(25*gridSpace,0);
  spawn = createVector(25*gridSpace,8*gridSpace)
  player = new Player(spawn);
  planet = new Planet(100,30);
  //cam1 = new Cam(spawn);
  //items
  lSpag = new Item(0,5);
  water = new Item(1,1);
  oxy = new Item(2,1);
  SO = new Item(3,1);
  
  //recipes
  SO_r = new Recipe(SO,[lSpag,water,oxy]);
  
  player.inventory.addItem(lSpag);
  player.inventory.addItem(water);
  player.inventory.addItem(oxy);
  
}

//document.getElementsByTagName("canvas").addEventListener('contextmenu', event => event.preventDefault());//Disable right click


function draw() {
  //console.log(frameRate());
  //runs every tick
  receiveInput();
   
  push();
  //cam1.active();
  translate(-player.getPos().x+gameWidth/2,-player.getPos().y+gameHeight/2);
  player.update(planet);
  player.move(planet.getTilemap());
  planet.show();
  player.show();
  ellipse(player.pos.x + playerWidth/2,player.pos.y - playerHeight/2,20);
  
  pop();
  if(UIOn){
    player.inventory.show();
    //console.log("😂😂");
  } else {
    player.inventory.selected()
  }
  showStats();
  
  text(round(frameRate()),gameWidth-100,gameHeight-50)
  fill(255,0,0)
  //rect(0,0,200,200)
}

const make2Darray = (cols,rows) => new Array(cols).fill().map(item =>(new Array(rows)))

function showStats(){
  let stats = player.getStats();
  push();
  translate(width-sidebarWidth,height*0.02);
  rectMode(CORNER);
  let top = -10
  let health = stats[0];
  stroke(150,150,150)
  strokeWeight(2)
  fill(150,150,150)
  rect(0,top, sidebarWidth, 30, 10);
  fill(255,0,0)
  rect((1-(health/100))*sidebarWidth,top, (health/100)*sidebarWidth, 30, 10);
  
  let oxygen = stats[1];
  stroke(150,150,150);
  strokeWeight(2);
  fill(150,150,150);
  rect((1-0.9)*sidebarWidth,top+35, sidebarWidth*0.9, 15, 10);
  fill(255,255,255);
  rect((1-0.9)*sidebarWidth+(((1-(oxygen/100))*sidebarWidth*0.9)),top+35, (oxygen/100)*sidebarWidth*0.9, 15, 10);
  
  let water = stats[2];
  stroke(150,150,150)
  strokeWeight(2)
  fill(150,150,150)
  rect((1-0.8)*sidebarWidth,top+55, sidebarWidth*0.8, 15, 10);
  fill(70,200,230)
  rect((1-0.8)*sidebarWidth+(((1-(water/100))*sidebarWidth*0.8)),top+55, (water/100)*sidebarWidth*0.8, 15, 10);
  
  let food = stats[3];
  stroke(150,150,150)
  strokeWeight(2)
  fill(150,150,150)
  rect((1-0.7)*sidebarWidth,top+75, sidebarWidth*0.7, 15, 10);
  fill(255,69,0)
  rect((1-0.7)*sidebarWidth+(((1-(food/100))*sidebarWidth*0.7)),top+75, (food/100)*sidebarWidth*0.7, 15, 10);
  
  if(UIOn){
    stroke(0)
    strokeWeight(1)
    fill(0);
    textSize(30)
    text(round(health) + "%",sidebarWidth-165,15)
    text("Health",sidebarWidth-90,15)
    fill(0);
    textSize(15)
    text(round(oxygen) + "%",sidebarWidth-100,15+21)
    text("Oxygen",sidebarWidth-60,15+21)
    fill(0);
    textSize(15)
    text(round(water) + "%",sidebarWidth-90,15+20+22)
    text("Water",sidebarWidth-45,15+20+22)
    fill(0);
    textSize(15)
    text(round(food) + "%",sidebarWidth-80,15+20+22+21)
    text("Food",sidebarWidth-40,15+20+22+21)
    
  }
  pop();
}

//inputs
function receiveInput(){
  if(keyIsDown(39)||keyIsDown(68)){
    //player.vector.add(inputMag);
    player.addForce(createVector(inputMag,0))
  }
  if(keyIsDown(37)||keyIsDown(65)){
    //player.vector.sub(inputMag);
    player.addForce(createVector(-inputMag,0))
  }
  if(keyIsDown(38)||keyIsDown(87)){
    player.jump(7,planet.getTilemap());
  }
}

function keyPressed(){
  if(keyIsDown(69)){
    if(UIOn){
        player.inventory.switchItem();
      } else {
        UIOn = true;
      }
  } else if(keyIsDown(27)) {
    UIOn = false;
  } else if(keyIsDown(32)){
     player.inventory.useItem();
  } else if(keyIsDown(49)){
    console.log(SO_r.canCraft());
  } else if(keyIsDown(85)){
    
  }
}


function mouseClicked(){
  let pos = createVector(mouseX-(-player.getPos().x+gameWidth/2),mouseY-(-player.getPos().y+gameHeight/2));
  pos.x = floor(pos.x/gridSpace)//-54;
  pos.y = floor(pos.y/gridSpace)//-24;
  if (planet.getRelativeTilemap(0).inTilemap(pos.x,pos.y)) {
    planet.getRelativeTilemap(0).mine(pos.y,pos.x);
  }
}

/*class Cam {
  constructor(spawnpoint) {
    this.x = -spawnpoint.x;
    this.y = -spawnpoint.y;
  }
  active() {
    translate(this.x + (gameWidth - player.getWidth()) / 2,this.y + (gameHeight - player.getHeight()) / 2);
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
  getPos(){
    return createVector(this.x,this.y)
  }
}*/





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
    // this.array [10][14]= "s";
    // this.array [10][15]= "w";
    // this.array [9][15]= "w";
    // this.array [8][15]= "w";
    this.tree(16,9);
  }
  
  tree(x,y){
    let height = floor(random(2,6));
    for(let i=0;i<height;i++){
      this.array[y-i][x] = "tree";
    }
    this.array[y-height][x] = "leaf";
    if(random(1)<0.3){
      this.array[y-height-1][x+1] = "leaf";
    }
    if(random(1)<0.3){
      this.array[y-height-1][x-1] = "leaf";
    }
    if(random(1)<0.3){
      this.array[y-height+1][x+1] = "leaf";
      if(height>3){
        if(random(1)<0.5){
          this.array[y-height-1][x+1] = "leaf";
        }
      }
    }
    if(random(1)<0.3){
      this.array[y-height+1][x-1] = "leaf";
      if(height>3){
        if(random(1)<0.5){
          this.array[y-height-1][x-1] = "leaf";
        }
      }
    }
    
    
    if(height>5){
      if(random(1)<0.85){
        this.array[y-2][x+1] = "leaf";
      }
    }
 
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
    let renderDis = sqrt(pow(ceil(gameHeight/2),2) + pow(ceil(gameWidth/2),2));
    let seenY = false;
    let stopY = false;
    for (var i=0;i<this.array.length;i++){
      if(stopY==false) {
        let seenX = false;
        let stopX = false;
        for (var j=0;j<this.array[i].length-2*i;j++) {
          var tileTexture;
          //temporary color
          switch (this.array[i][j+i]) {
            case ".": //void
              fill(0,0,0,0)
              break;
            case ",": //moon soil lol
              fill(100,100,100);
              break;
            case "s": //ship
              fill(200,0,0);
              break;
            case "w": //water
              fill(0,0,100);
              break;
            case "m": //iron oxide
              fill(166,52,30);
              break;
            case "tree": //tree
              fill(83, 49, 24);
              break;
            case "leaf":
              fill(107,142,35);
              break;
            default:
              break;
          }
          let newTile = createVector(0,0);
          switch (s) {
            case 0:
              //console.log((j+i)*gridSpace,i*gridSpace)
              newTile.set((j+i)*gridSpace,i*gridSpace);
              break;
            case 1:
              newTile.set((planet.size-i)*gridSpace,(j+i)*gridSpace);
              break;
            case 2:
              newTile.set((planet.size-j-i)*gridSpace,(planet.size-i)*gridSpace);
              break;
            case 3:
              newTile.set(i*gridSpace,(planet.size-j-i)*gridSpace);
              break;
            default:
              break;
          }
          if(stopX==false) {
            if ((newTile.dist(player.pos)<renderDis)) {
              seenX = true;
              seenY = true;
              rect(newTile.x,newTile.y,gridSpace,gridSpace);
            } else {
              if(seenX){
                stopX = true;
              }
            }
          }
          //rect(newTile.x,newTile.y,gridSpace,gridSpace);
        }
      } else if (seenY) {
        stopY = true;
      }
    }
  }
  
  
  mine (y,x) {
    if(dist((player.pos.x-player.getWidth()/2)/gridSpace,-player.getHeight()/2+(player.pos.y)/gridSpace,x,y) <3){
      //console.log("Hi mom");
      planet.getTilemap()[y][x] = ".";
    }
      
  }
  inTilemap(x,y){
    return!(y<=0||x<=0||y>planet.size*gridSpace/2||x>planet.size*gridSpace)
  }
}

class Planet {

  constructor(size,intensity) {
    this.type = createVector(randomGaussian(255/2,intensity),randomGaussian(255/2,intensity));
    //console.log(this.type)
    this.side = 0;
    this.size = size;
    this.atmosphere = 8;
    this.sideN = new Tilemap(size,floor(size/2),this.generateLandscape());
    this.sideE = new Tilemap(size,floor(size/2),this.generateLandscape());
    this.sideS = new Tilemap(size,floor(size/2),this.generateLandscape());
    this.sideW = new Tilemap(size,floor(size/2),this.generateLandscape());
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
    let r = random(10);
    for(let i=0;i<length;i++){
      let b = this.calculateCircularHeight(i,sqrt((pow(length/2),2)*2));
      //console.log("add " + b + "from " + i + " and " + length);
      let angle = i*2*PI/length;
      let height = minHeight+(maxHeight-minHeight)*noise(r*cos(angle),r*sin(angle)+b);
      heights.push(height);
    }
    //console.log(heights)
    return heights;
  }
  
  calculateCircularHeight (x,r) {
    return sqrt(( (pow(r,2))+(2*sqrt(2)*x*r)-(2*pow(x,2)) )/2) - sqrt(2)*r/2;
  }
  
  rotate(n){
    this.side = (this.side+n+4)%4;
  }
  
  show() {
    background(0)
    //background(50,0,70);
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