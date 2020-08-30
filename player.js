class Player {
  
  constructor(spawn,inventory = new Backpack()) {
    this.pos = spawn;
    this.width = 0.8;
    this.height = 1.6;

    this.maxGrav = 10;
    
    this.speed = 5;
    this.vector = new p5.Vector(0,0,0);
    
    this.onFloor = false;
    
    this.inventory = inventory;
    this.saturationCon = 50;
    this.health = 100;
    this.oxygen = 100;
    this.food = 100;
    this.water = 100;
    this.dieingRate = 0;
    
    this.mining = 0;
    
    
    this.landed = true;
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
  
  getInventory(){
    return this.inventory;
  }
  
  lift(){
    this.pos.y=this.pos.y-1;
  }
  
  show(){
    if(!shipLaunched) {
      fill(255,255,255);
      rect(this.pos.x,this.pos.y,gridSpace*this.width,-gridSpace*this.height);
    } else {
      fill(0,13,255);
      rect(round(this.pos.x/gridSpace)*gridSpace,this.pos.y-gridSpace*2,gridSpace,2*gridSpace);
      rect(round(this.pos.x/gridSpace)*gridSpace+gridSpace,this.pos.y-gridSpace,gridSpace,2*gridSpace);
      rect(round(this.pos.x/gridSpace)*gridSpace-gridSpace,this.pos.y-gridSpace,gridSpace,2*gridSpace);
    }
  }
  
  

  
  addForce(vel){
    this.vector.add(vel);
  }
  
  move(tilemap,shipLaunched) {
    if(shipLaunched){
      return;
    }
    this.vector.x /= friction;
    
    if(this.isGravity(tilemap)){
      if(this.inWater(tilemap)){
            this.vector.add(0,0.2*gravity);//Apply gravity
      }else{
        this.vector.add(0,gravity);//Apply gravity
      }
    }else{
      if(this.vector.y>0){
        if(this.landed==false){
          systems.push(new particleSystem(createVector(this.pos.x+gridSpace*this.width/2,this.pos.y),40,0,-180));
          this.landed = true;
        }
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
    
    if(!this.isGravity(tilemap)&&abs(this.vector.x)>0.5&&systems.length<=1){//If running
      if(this.vector.x<0){
          systems.push(new particleSystem(createVector(this.pos.x+gridSpace*this.width/2,this.pos.y),20,-10,-80));
      }else{
          systems.push(new particleSystem(this.pos.copy(),20,190,80));
      }
    
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
    switch (tilemap[pos.y][pos.x]) {
      case ".":
        return false;
      case "w":
        return false;
      case "s":
        return false;
      default:
        return true;
    }
  }
  
  jump(inputMag,tilemap){
    if(this.inWater(tilemap)){
      this.vector.sub(0,gravMag*0.05);
    }else if(!this.isGravity(tilemap)&&this.landed){
      this.vector.sub(0,gravMag);
      this.landed=false;
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
    //Oxygen, Water, Food
    //this.water = 0;
    //temporary decrease valyes
    if (this.water-0.002>=0) {this.water -= 0.002;}
    else {this.water=0}
    if (this.oxygen-0.01>=0) {this.oxygen -= 0.01;}
    else {this.oxygen=0}
    if (this.food-0.001>=0) {this.food -= 0.001;}
    else{this.food=0}
    
    //Dieing
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
      if(this.oxygen>100){
      this.oxygen=100;
    }
      if(this.water>100){
      this.water=100;
    }
      if(this.food>100){
      this.food=100;
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
