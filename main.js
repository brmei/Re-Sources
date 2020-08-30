/*global create createCanvas, background, noFill, strokeWeight, ellipse, stroke, fill, noStroke, circle, triangle, rect 
soundFormats, loadSound, floor, keyIsDown, color, frameRate, p5.Vector, collideRectRect
translate, p5, createVector*/
let gridSpace = 32; //number of pixels per unit
let friction = 2; //multiplier momentum is reduced by every frame
let inputMag = 6; //how much momentum a player inputs
let gravMag = 12;
let gameHeight = window.innerHeight*0.8; //size of canvas height
let gameWidth = window.innerWidth*0.9; //size of canvas width
//let gameHeight = 800 //size of canvas height
//let gameWidth = 1700; //size of canvas widthee

let sidebarWidth = gameWidth/2-gameHeight/2;
let sidebarRow = gameHeight/10;
let playerWidth = gridSpace;
let playerHeight = gridSpace;
let spawn;
let newPlanetSize;
//let cam1;
let gravity = 0.5;
let UIOn = false; //Is the inventory open?
let craftOn = false; //Is the crafting list open?
let fuelOn = false; //Is the fuel meter being displayed?
let inRange = false;
let shipLaunched = false;

let player;
let ship;
let planet;

//Items
let lSpag;
let water;
let oxy;
let SO;
let steam;
let ap;
let io;
let thermite;

//Recipes
let shipCraft;
let SO_r; //Spaghetti-Oxide
let steam_r;
let thermite_r;
//Movement


//Music
let songID;
let juke;
let beep;
let boop;
let space1;
let space2;
let heat;
let current;
let mine;

//Particles
let systems = [];
let flames = [];

function preload() {
  soundFormats("mp3");
  beep = loadSound("https://cdn.glitch.com/d1474153-2476-47c8-9888-60d3a5c02c62%2FBeep_1-%5BAudioTrimmer.com%5D.mp3?v=1598781958120");
  boop = loadSound("https://cdn.glitch.com/d1474153-2476-47c8-9888-60d3a5c02c62%2FreverseBoop.mp3?v=1598782179880");
  space1 = loadSound("https://cdn.glitch.com/16c26bfa-0e05-488d-8525-9a6fbe0379a6%2FSpace_1.mp3?v=1598642738842");
  space2 = loadSound("https://cdn.glitch.com/d1474153-2476-47c8-9888-60d3a5c02c62%2FSpace_2.mp3?v=1598781729912");
  heat = loadSound("https://cdn.glitch.com/d1474153-2476-47c8-9888-60d3a5c02c62%2FHeat.mp3?v=1598781734126");
  mine = loadSound("https://cdn.glitch.com/b8ff3d5a-385e-4dfe-8c37-d7a4d05dfb6c%2FMining-%5BAudioTrimmer.com%5D.mp3?v=1598793123461");
}


function setup() {
  // Code here runs only once
  createCanvas(gameWidth, gameHeight);
  rectMode(CORNER);
  strokeWeight(0);
  fill(200);
  newWorld();
  //cam1 = new Cam(spawn);
  //items
  lSpag = new Item(0,5);
  water = new Item(1,1);
  oxy = new Item(2,1);
  SO = new Item(3,1);
  steam = new Item(4,4);
  ap = new Item(5,2);
  io = new Item(64,1);
  thermite = new Item(6,1);
  
  //recipes
  
  SO_r = new Recipe(SO,[lSpag,water,oxy],[2,1,1]);
  steam_r = new Recipe(steam,[water,oxy],[1,1]);
  thermite_r = new Recipe(thermite,[ap,io],[2,1]);
  shipCraft = new CraftMenu([thermite_r,SO_r,steam_r]);
  
  player.inventory.addItem(new Item(lSpag.id,lSpag.count));
  player.inventory.addItem(new Item(water.id,water.count));
  player.inventory.addItem(new Item(oxy.id,oxy.count));
  player.inventory.addItem(new Item(ap.id,ap.count));
  
  
  
  juke = new Jukebox();
  songID = 0;
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
  player.move(planet.getTilemap(),shipLaunched);
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
  if(craftOn){
    shipCraft.showCraft();
  } else if(fuelOn){
    ship.showFuel();
  }
  showStats();
  
  text(round(frameRate()),gameWidth-100,gameHeight-50)
  fill(255,0,0)
  //rect(0,0,200,200)
  runParticles()
  if(shipLaunched){
    player.lift();
  }
}

function newWorld() {
  newPlanetSize = abs(floor(randomGaussian(50,15)));
  spawn = createVector(newPlanetSize/2*gridSpace,0);
  if(player==undefined){
      player = new Player(spawn);
  }else{
      player = new Player(spawn,player.getInventory());
  }
  planet = new Planet(newPlanetSize,30);
  shipLaunched = false;
}

function runParticles(){
    for(let i=systems.length-1;i>=0;i--){
     let current = systems[i];
     current.run();
     if(current.finished()){
       systems.splice(i,1); 
    }
  }
  
  for(let i=flames.length-1; i>= 0; i--){
    let current = flames[i]
    current.update();
    if(current.getR() <= 0 ){
      flames.splice(i, 1);
    }
  }
  if(shipLaunched){
    flames.push(new flame(-gridSpace+(gridSpace*player.getWidth()/2)+gridSpace*round(gameWidth/2/gridSpace),gridSpace+gameHeight/2,random(7,15)))
    flames.push(new flame(gridSpace+(gridSpace*player.getWidth()/2)+gridSpace*round(gameWidth/2/gridSpace),gridSpace+gameHeight/2,random(7,15)))
  }
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
    pop();
    textSize(20);
    text("Use [esc] to exit inventory",10,gameHeight - 10);
  } else {
    pop();
    textSize(20);
    text("Use [e] to access inventory",10,gameHeight - 10);
  }
}

//inputs
function receiveInput(){
  if(!shipLaunched){
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
}

function keyPressed(){
  juke.initialize(songID);
  if(keyIsDown(69)){
    if(UIOn){
        player.inventory.switchItem();
      } else {
        beep.play();
        UIOn = true;
        craftOn = false;
      }
  } else if(keyIsDown(27)) {
    UIOn = false;
    craftOn = false;
    fuelOn = false;
    boop.play();
  } else if(keyIsDown(32)){
     player.inventory.useItem();
  } else if(keyIsDown(49)){
    console.log(SO_r.canCraft());
  } else if(keyIsDown(67)){
    if (ship.playerClose(player)) {
      if(craftOn){
        shipCraft.switchRecipe();
      } else{
        beep.play();
        shipCraft.update();
        craftOn = true;
        UIOn = false;
      }
    }
  } else if(craftOn && keyIsDown(13)){
      shipCraft.craftSelected();
  } else if(keyIsDown(70)){
    fuelOn = true;
  }
}


function mouseClicked(){
  let pos = createVector(mouseX-(-player.getPos().x+gameWidth/2),mouseY-(-player.getPos().y+gameHeight/2));
  pos.x = floor(pos.x/gridSpace)
  pos.y = floor(pos.y/gridSpace)
  if (planet.getRelativeTilemap(0).inTilemap(pos.x,pos.y)) {
    planet.getRelativeTilemap(0).mine(pos.y,pos.x,mouseX,mouseY);
  }
}

class Planet {

  constructor(size,intensity) {
    this.type = createVector(randomGaussian(255/2,intensity),abs(randomGaussian(511/2,intensity)-256));
    //console.log(this.type);
    this.base = this.parseType(this.type);
    //console.log(this.base);
    this.side = 0;
    this.size = size;
    this.atmosphere = 8;
    this.sideN = new Tilemap(size,floor(size/2),this.generateLandscape(),this.type,this.base,0);
    this.sideE = new Tilemap(size,floor(size/2),this.generateLandscape(),this.type,this.base,1);
    this.sideS = new Tilemap(size,floor(size/2),this.generateLandscape(),this.type,this.base,2);
    this.sideW = new Tilemap(size,floor(size/2),this.generateLandscape(),this.type,this.base,3);
    
  }
  
  parseType(t) {
    if (this.type.x < 85) {
      songID = 2;
      if (this.type.y < 85) {
        return "d";
      } else if (this.type.y <170) {
        return "b";
      } else {

      }
    } else if (this.type.x <170) {
      if (this.type.y < 85) {
        songID = 0;
        return "m"; //mars-like planet
      } else if (this.type.y <170) {
        songID = 0;
        return ","; //moon-like planetoid
      } else {
        songID = 1;
        return "w";
      }
    } else {
      if (this.type.y < 85) {
        songID = 0;
        return "i";
      } else if (this.type.y <170) {
        songID = 1;
      } else {
        songID = 1;
      }
    }
    return ",";
  }
  
  getPlanetDifficulty(t) {
    return abs(t.x-127)+t.y;
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
      //let r = sqrt(pow(length/2,2)+pow(length,2));
      let b = this.calculateCircularHeight(i,length);
      let angle = i*2*PI/length;
      //console.log(b)
      let offset = -(r/2)+r*noise(r*cos(angle),r*sin(angle)+b/2)
      if(i<=1||i>=length-2){
        offset=0;
      }
      //console.log(offset)
      let height = floor(b+offset);
      //let height = minHeight+(maxHeight-minHeight)*noise(r*cos(angle),r*sin(angle)+b);
      heights.push(height);
    }
    console.log(heights)
    return heights;
  }
  
  calculateCircularHeight (x,l) {
    return (length/2)+sqrt(pow(l/2,2)+pow(l/2,2)-pow(x-(l/2),2));
  }
  
  rotate(n){
    this.side = (this.side+n+4)%4;
  }
  
  show() {
    //background(168,189,186);
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

class flame{
  constructor(x, y, r) {
    this.x = x;
    this.y = y;
    this.r = r;
    
    this.c = color(255);
    let ran = random(3);
    if(ran < 1){
      this.c = color(255,100,20,250);
    } else if(ran >= 1 && r < 2 ){
      this.c = color(255, 200, 10, 250);
    } else if(ran >= 2 ){
      this.c = color(255, 80, 5, 250); 
    }
    
  }
  getR(){
    return this.r;
  }
  
  update(){
    this.move();
    this.shrink();
    this.show();
  }
  
  show() {
    noStroke();
    stroke(this.c)
    fill(this.c);
    ellipse(this.x, this.y, this.r);
  }

  move() {
    this.x += random(-4, 4);
    this.y += random(1, 4);
  }
  
  shrink(){    
   this.r-=0.2;
  }
  
  

}

class particleSystem{
  constructor(pos,n,startA,angle){
    this.pos = pos;
    this.particles=this.makeParticles(n,startA,angle);
  }
  
  makeParticles(n,startA,angle){
     let p = [];
    for(let i=0;i<n;i++){
     p.push(new particle(createVector(this.pos.x+random(-0.2,0.2),this.pos.y+random(-0.2,0.2)),startA,angle));                         
    }
    return p;
  }
    
  run(){
     for(let i=this.particles.length-1;i>=0;i--){
       let current = this.particles[i];
       current.update();
       if(current.isDead()){
         this.particles.splice(i,1); 
       }
     }
  }
  
  finished(){
    return this.particles.length==0; 
  }
    
  
}

class particle{
   constructor(pos,startA,angle){
     console.log(startA)
     this.startLife = 15;
     this.life = this.startLife;
     this.acc = createVector(0,0.05);
     this.vel = p5.Vector.fromAngle(radians(startA+random(angle)),1);
     this.pos = pos;
     this.rot = radians(random(360));
   }
  
  isDead(){
    return this.life<0;
  }
  
  update(){
    this.vel.add(this.acc);
    this.pos.add(this.vel);
    this.life--;
    this.show()
  }
  
  show(){
    let min = 70;
    let diff = 255-min;
    stroke(50,min+(diff*this.life/this.startLife));
    fill(50,min+(diff*this.life/this.startLife));
    push();
    rectMode(CENTER)
    translate(-player.getPos().x+gameWidth/2,-player.getPos().y+gameHeight/2);
    translate(this.pos.x,this.pos.y);
    rotate(this.rot);
    rect(0,0,4,4);
    pop();

    

  }
  
}