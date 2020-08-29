class Player {
  
  constructor(spawn) {
    this.pos = spawn;
    this.speed = 5;
    this.vector = new p5.Vector(0,0,0);
    //this.inventory = new Inventory();
  }
    
  show(){
    fill(255,255,255);
    rect(this.pos.x,this.pos.y,gridSpace,gridSpace);
  }
  
  move(tilemap) {
    this.vector.x /= friction;
  
    if(this.isGravity(tilemap)){
      this.vector.add(0,gravity);//Apply gravity
    }else{
      if(this.vector.y>0){
        this.vector.y = 0;//Stop when ground hit
      }
    }
    let newPos = p5.Vector.add(this.pos,this.vector);
    if(this.vector.x>0){//If moving right 
      if(this.collide(tilemap,createVector(ceil((newPos.x)/gridSpace),ceil((newPos.y/gridSpace))))||this.collide(tilemap,createVector(ceil((newPos.x+1)/gridSpace),-1+ceil(((newPos.y)/gridSpace))))){
        this.vector.x=0;
      }
    }else if(this.vector.x<0){//If moving left
      if(this.collide(tilemap,createVector(floor((newPos.x)/gridSpace),floor(newPos.y/gridSpace)))||this.collide(tilemap,createVector(floor((newPos.x)/gridSpace),-1+floor((newPos.y)/gridSpace)))){
        this.vector.x=0;
      }
    }
    newPos = this.pos.copy();
    newPos.y += this.vector.y;
    if(this.vector.y<0){//If moving up
      if(this.collide(tilemap,createVector(floor((newPos.x)/gridSpace),floor((newPos.y/gridSpace))))||this.collide(tilemap,createVector(1+floor((newPos.x)/gridSpace),floor((newPos.y/gridSpace))))){
        console.log("test")
        this.vector.y=0;
      }
    }

    //this.touchingWall(planet);
    this.rotatePlanet(planet);
    
    this.pos.add(this.vector);
    if(!this.isGravity(tilemap)){
      this.pos.y = gridSpace*floor(this.pos.y/gridSpace);  
    }
    cam1.snap(-this.pos.x,-this.pos.y)
    //cam1.shift(-this.vector.x,-this.vector.y);
  }
  
  isGravity(tilemap){
    //console.log(this.pos.y);
    let newPos = createVector(floor(this.pos.x/gridSpace),floor((this.pos.y+gravity)/gridSpace));//Next position
    //console.log(tilemap)
    //If both corners are above nothing
    if(!this.inTilemap(newPos.x,newPos.y)){//Outside of tilemap
      return true;
    }
    return !(this.collide(tilemap,createVector(newPos.x,newPos.y+1))||this.collide(tilemap,createVector(newPos.x+1,newPos.y+1)))
  }
  collide(tilemap,pos){
    return(tilemap[(pos.y)][(pos.x)]==",");
  }
  
  jump(inputMag,tilemap){
    if(!this.isGravity(tilemap)){
      this.vector.sub(0,inputMag);
    }
  }
  
  inTilemap(x,y){
    return!(y<0||x<0||y>planet.size*gridSpace/2||x>planet.size*gridSpace)
  }
  
  // relativePosition (i,j) {
  //   let relativeX = j*gridSpace - this.x;
  //   let relativeY = i*gridSpace - this.y;
  //   //console.log("relative x: " + relativeX);
  //   if (relativeX > relativeY) {
  //     if (relativeX > 0) return "down"
  //     else return "up"
  //   } else {
  //     if (relativeY > 0) return "left"
  //     else return "right"
  //   }
  // }
  isGrounded(p) {
    let tilemap = p.getRelativeTilemap(0).getArray()
    for (var i=0;i<tilemap.length;i++){
      for (var j=0;j<tilemap[i].length;j++) {
        switch (tilemap[i][j]) {
          case ".":
            //air does nothing
            break;
          default:
            //If not air
            if(collideRectRect(this.x, this.y + this.vector.y, playerWidth, playerHeight, j*gridSpace, i*gridSpace, gridSpace, gridSpace)){
              //console.log("true");
              cam1.snap(cam1.x,-(i-1)*gridSpace);
              this.y = (i-1)*gridSpace;
              return true; 
            }
        }
      }
    }
    //console.log("false");
    return false;
  }
  touchingWall(p) {
     for (var i=0;i<p.getRelativeTilemap(0).array.length;i++){
      for (var j=0;j<p.getRelativeTilemap(0).array[i].length;j++) {
        switch (p.getRelativeTilemap(0).array[i][j]) {
          case ".":
            //air does nothing
            break;
          default:
            
            if(collideRectRect(this.x, this.y + gridSpace/10, playerWidth, playerHeight*4/5, j*gridSpace, i*gridSpace, gridSpace, gridSpace)){
              //console.log("true");
              if (this.vector.x < 0) {
                cam1.snap(-(j-1)*gridSpace,cam1.y);
                this.x = (j-1)*gridSpace;
              } else if (this.vector.x > 0) {
                cam1.snap(-(j+1)*gridSpace,cam1.y);
                this.x = (j+1)*gridSpace;
              }
              return true; 
            }
            // if(collideRectRect(this.x+this.vector.x, this.y, gridSpace, gridSpace, j*gridSpace, i*gridSpace, gridSpace, gridSpace)){
            //   console.log("true");
            //   cam1.snap(-(j-1)*gridSpace,cam1.y);
            //   this.x = (j-1)*gridSpace;
            //   return true; 
            // }
        }
      }
    } 
    return false;
  }
  
  rotatePlanet(p) {
    /*in region y/x>1 rotate planet clockwise; in region -y/(x-p)>1 rotate planet counterclockwise*/
    if (this.pos.y/this.pos.x>1) {
      //rotate clockwise
      p.rotate(1);
      this.vector.add(-20,10);
      this.pos = createVector(-this.pos.y+p.size*gridSpace,this.pos.x);
    } else if (-this.pos.y/(this.pos.x-p.size*gridSpace)>1) {
      //rotate counterclockwise
      p.rotate(-1);
      this.vector.add(20,10);
      this.pos = createVector(this.pos.y,-this.pos.x+p.size*gridSpace);
    }
  }
  
  checkShip(p) {
    let playerTile = createVector(floor(this.pos.x/gridSpace),floor(this.pos.y/gridSpace));
    for (var i=-2;i<3;i++) {
      for (var j=-2;j<3;j++) {
        if(tilemap[(playerTile.x+j)][(playerTile.y+i)]=="s") {
          return "true";
        }
      }
    }
    return "false";
  }
}

