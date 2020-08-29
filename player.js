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
    this.oxygen = 100;
    this.food = 100;
    this.water = 100;
    this.dieingRate = 0;
    
    
  }
    
  getStats(){
    return [this.health,this.oxygen,this.food,this.water];
  }
  
  show(){
    cam1.snap(-this.pos.x,-this.pos.y)
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
      if(this.collide(tilemap,createVector(floor(this.width+(newPos.x)/gridSpace),ceil(-1+(newPos.y/gridSpace))))||this.collide(tilemap,createVector(floor(this.width+(newPos.x)/gridSpace),ceil((-1+(newPos.y)/gridSpace))))){
        this.vector.x=0;
      }
    }else if(this.vector.x<0){//If moving left
      if(tilemap[floor((newPos.y-1)/gridSpace)][floor(newPos.x/gridSpace)]==","){
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
    return (tilemap[pos.y][pos.x]==",");
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
    if(this.oxygen==0){
      this.dieingRate+=1;
    }
    if(this.water==0){
      this.dieingRate+=1;
    }
    if(this.food==0){
      this.dieingRate+=1;
    }
    //Regeneration
    if(this.oxygen>this.saturationCon&&this.water>this.saturationCon&&this.food>this.saturationCon){
      this.dieingRate = -0.1;
    }
    
    this.health+=this.dieingRate;
    
  

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
    
  }
  
  show(){
    fill(0);
    let sidebarWidth = gameWidth/2-gameHeight/2;
    let sidebarRow = gameHeight/10;
    rect(0,0,sidebarWidth,gameHeight);
    fill(50,200,50);
    textSize(sidebarRow/2);
    for(let i = 0; i < this.items.length; i++){
      if(this.select == i){
        rect(0, 0 + i*sidebarRow,sidebarWidth,sidebarRow);
        fill(0);
        text(this.items[i].name,sidebarRow/4,sidebarRow*3/4 + i*sidebarRow);
        fill(50,200,50);
      }
      else{
       text(this.items[i].name,sidebarRow/4,sidebarRow*3/4 + i*sidebarRow);
      }
    }
    //console.log(this.items);
  }
  selected() {
    
  }
}

class Item {
  constructor(name){
    this.name = name;
  }
  name(){
    return this.name;
  }
}

