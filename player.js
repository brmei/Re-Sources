class Player {
  
  constructor(spawn) {
    this.pos = spawn;
    this.width = 0.8;
    this.height = 1.6;

    this.maxGrav = 10;
    
    this.speed = 5;
    this.vector = new p5.Vector(0,0,0);
    
    this.onFloor = false;
    
    this.inventory = new Backpack();
    this.saturationCon = 50;
    this.health = 100;
    this.oxygen = 30;
    this.food = 10;
    this.water = 50;
    this.dieingRate = 0;
    
    
  }
  getPos(){
    return this.pos;
  }  
  
  getWidth(){
    return this.width;
  }
  getHeight(){
    return this.height;
  }
  
  getStats(){
    return [this.health,this.oxygen,this.water,this.food];
  }
  
  show(){
    fill(255,255,255);
    rect(this.pos.x,this.pos.y,gridSpace*this.width,-gridSpace*this.height);
  }
  
  

  
  addForce(vel){
    this.vector.add(vel);
  }
  
  move(tilemap) {
    this.vector.x /= friction;
    
    if(this.isGravity(tilemap)){
      if(this.inWater(tilemap)){
            this.vector.add(0,0.2*gravity);//Apply gravity
      }else{
        this.vector.add(0,gravity);//Apply gravity
      }
    }else{
      if(this.vector.y>0){
        this.vector.y = 0;//Stop when ground hit
      }
    }
    let newPos = p5.Vector.add(this.pos,this.vector);//New position if moved
      
    if(this.vector.x>0){//If moving right 
      if(this.collide(tilemap,createVector(floor(this.width+(newPos.x)/gridSpace),ceil(-1+(newPos.y/gridSpace))))||this.collide(tilemap,createVector(floor(this.width+(newPos.x)/gridSpace),ceil((-this.height+(newPos.y)/gridSpace))))){
        this.vector.x=0;
      }
    }else if(this.vector.x<0){//If moving left
      if(this.collide(tilemap,createVector(floor(newPos.x/gridSpace),floor((newPos.y-1)/gridSpace)))||this.collide(tilemap,createVector(floor(newPos.x/gridSpace),floor((newPos.y-this.height)/gridSpace)))){
        this.vector.x=0;
      }

    }
    newPos = createVector(this.pos.x,this.pos.y+this.vector.y);
    if(this.vector.y<0){//If moving up
      if(this.collide(tilemap,createVector(floor((newPos.x)/gridSpace),floor(-this.height+(newPos.y/gridSpace))))||this.collide(tilemap,createVector(floor(this.width+(newPos.x)/gridSpace),floor(-this.height+(newPos.y/gridSpace))))){
        this.vector.y=0;
      }
    }

    

  
    this.rotatePlanet(planet);
    if(this.vector.x>this.speed){
      this.vector.x = this.speed;
    }
    if(this.vector.y>this.maxGrav){
      this.vector.y = this.maxGrav;
    }
    this.pos.add(this.vector);
    if(!this.isGravity(tilemap)&&this.vector.y>=0){//If no gravity
      this.pos.y = gridSpace*floor(this.pos.y/gridSpace);  
    }
  }
  
  isGravity(tilemap){
    let flooredPos = createVector(floor(this.pos.x/gridSpace),floor((this.pos.y+gravity)/gridSpace));//Next position
    let normalPos = createVector((this.pos.x/gridSpace),((this.pos.y+gravity)/gridSpace));//Next position
    //If both corners are above nothing
    if(!this.inTilemap(normalPos.x,normalPos.y)){//Outside of tilemap
      return true;
    }//If no floor
    return !(this.collide(tilemap,createVector(flooredPos.x,floor(flooredPos.y)))||this.collide(tilemap,createVector(floor(normalPos.x+this.width),floor(normalPos.y))))
  }
  collide(tilemap,pos){
    if (!this.inTilemap(pos.x,pos.y)) return false;
    return (tilemap[pos.y][pos.x]=="," || tilemap[pos.y][pos.x]=="tree");
  }
  
  jump(inputMag,tilemap){
    if(this.inWater(tilemap)){
      this.vector.sub(0,inputMag*0.05);
    }else if(!this.isGravity(tilemap)){
      this.vector.sub(0,inputMag);
    }
  }
  
  inTilemap(x,y){
    return!(y<=0||x<=0||y>planet.size*gridSpace/2||x>planet.size*gridSpace)
  }
  
  inWater(tilemap){
    if(!this.inTilemap(this.pos.x,this.pos.y)) return false;
    return tilemap[floor((this.pos.y)/gridSpace)][floor(this.pos.x/gridSpace)]=="w";
  }
  
  update(planet){
    this.dieingRate = 0;
    if(this.oxygen<=20){
      this.dieingRate+=0.02*(20-this.oxygen);
    }
    if(this.water<=30){
      this.dieingRate+=0.001*(30-this.water);
    }
    if(this.food<=50){
      this.dieingRate+=0.0001*(50-this.food);
    }
    //Regeneration
    if(this.oxygen>this.saturationCon&&this.water>this.saturationCon&&this.food>this.saturationCon){
      this.dieingRate = -0.1;
    }
    
    this.health-=this.dieingRate;
    if(this.health>100){
      this.health=100;
    }
  

  }
  
  rotatePlanet(p) {
    /*in region y/x>1 rotate planet clockwise; in region -y/(x-p)>1 rotate planet counterclockwise*/
    if (this.pos.y/this.pos.x>1) {
      //rotate clockwise
      p.rotate(-1);
      this.vector.add(-20,-5);
      this.pos = createVector(-this.pos.y+p.size*gridSpace,this.pos.x);
    } else if (-this.pos.y/(this.pos.x-p.size*gridSpace)>1) {
      //rotate counterclockwise
      p.rotate(1);
      this.vector.add(20,-5);
      this.pos = createVector(this.pos.y,-this.pos.x+p.size*gridSpace);
    }
  }
  
  
}

class Backpack {
  constructor() {
    this.items = [];
    this.select = 0; //The position of the current item the player has selected
  }
  
  addItem(i) {
    append(this.items, i);
  }
  
  switchItem(){
    this.select++;
    if(this.select == this.items.length){
      this.select = 0;
    }
  }
  
  useItem(){
     switch (this.items[this.select].id) {
        case 0: //L. Spaghetti
          player.food += 10;
          break;
        case 1: //Water Flask
          player.water += 10;
          break;
        case 2: //Oxygen Tank
          player.oxygen += 10;
          break;
        default:
          return null;
      }
    this.items[this.select].count -= 1;
   
    if(this.items[this.select].count == 0){
      this.items.splice(this.select, 1);
     
      if(this.select>0){this.select--}
      
    }
  }
  deleteItem(index){
    this.items.splice(index, 1);
    if(this.select>0){this.select--}
  }
  show(){
    fill(0);
    rect(0,0,sidebarWidth,gameHeight);
    fill(50,200,50);
    textSize(sidebarRow/2);
    for(let i = 0; i < this.items.length; i++){
      if(this.select == i){
        rect(0, 0 + i*sidebarRow,sidebarWidth,sidebarRow);
        fill(0);
        text(this.items[i].count+" | "+this.items[i].name(),sidebarRow/4,sidebarRow*3/4 + i*sidebarRow);
        text(this.items[i].count,sidebarRow/4,sidebarRow*3/4 + i*sidebarRow);
        fill(50,200,50);
      }
      else{
       text(this.items[i].count+" | "+this.items[i].name(),sidebarRow/4,sidebarRow*3/4 + i*sidebarRow);
      }
    }
    //console.log(this.items);
  }
  selected() {
    if(this.items.length==0){return}
    fill(50,200,50);
    textSize(sidebarRow/2);
    rect(0, 0,sidebarWidth,sidebarRow,10);
    fill(0);
    text(this.items[this.select].count+" | "+this.items[this.select].name(),sidebarRow/4,sidebarRow*3/4);
    fill(50,200,50);
  }
}

class Item {
  constructor(id,count){
    this.id = id;
    this.count = count;
  }
  name() {
    switch (this.id) {
      case 0:
        return "Liquified Spaghetti";
      case 1:
        return "Flask of Water";
      case 2:
        return "Oxygen Tank";
      default:
        return null;
    }
    return this.name;
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
  showCraftMenu() {
    
  }
}

class Recipe {
  constructor(item,ingredients = []){
    this.item = item;
    this.ingredients = ingredients;
  }
  canCraft(){
    for(let i = 0; i < this.ingredients.length; i++){
      for(let e = 0; e < player.inventory.items.length; e++){
        if(player.inventory.items[e].id == this.ingredients[i].id){break}
        if(e == player.inventory.items.length - 1){return false}
      }
    }
    return true;
  }
  craft(){
    for(let i = 0; i < this.ingredients.length; i++){
      for(let e = 0; e = player.inventory.items; e++){
        if(player.inventory.items[e] == this.ingredients[i]){
          player.inventory.items.deleteItem[e];
          break;
        }
      }
    }
    player.inventory.items.addItem(item);
  }
}