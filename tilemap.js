class Tilemap {
  
  constructor(x,y,heightMap,t,b) {
    this.array = make2Darray(y,x);
    this.Gen(heightMap,b);
    //this.tempGen();
  }
  
  Gen(heightMap,b){
    //fill with air
    for (let i=0;i<this.array.length;i++){
      for (let j=0;j<this.array[i].length;j++) {
        this.array[i][j] = ".";
      }
    }
    
    //apply terrain height
    let start = (this.array[0].length-heightMap.length)/2;
    for(let y=0;y<this.array.length;y++){
      for(let x=0;x<heightMap.length;x++){
        if(y<heightMap[x]){
          this.array[this.array.length-y-1][x+start] = b;
        }
      }
    }
    
    //add core
    for(let i=0;i<this.array[0].length;i++) {
      this.array[this.array.length-1][i] = "z";
    }
    // for(let i=0; i<this.array.length;i++) {
    //   this.array[0][i] = "z";
    // }
    
    //debug tiles
    // this.array [10][14]= "s";
    // this.array [10][15]= "w";
    // this.array [9][15]= "w";
    // this.array [8][15]= "w";
    //this.tree(16,9);
  }
  
  generateOres (density) {
    noise()
  }
  
  tree(x,y) {
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
  
//   tempGen() {
//         //, blocks
//     //. air
//     //temporary pregenerated tilemap
//     for (var i=0;i<this.array.length;i++){
//       for (var j=0;j<this.array[i].length;j++) {
//         this.array[i][j] = ",";
//       }
//     }
//     for (var i=0;i<floor(this.array.length/2);i++){
//       for (var j=0;j<this.array[i].length;j++) {
//         this.array[i][j] = ".";
//       }
//     }
//         this.array[10][27] = ",";
//     this.array[11][27] = ",";
//         this.array[11][28] = ",";
//            this.array[8][24] = ",";
    
//     this.array [11][15]= "s";
    
//     // 
//   }
  
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
            case "z": //core
              fill(34,34,36);
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
            case ",": //moon stone
              fill(100,100,100);
              break;
            case "w": //white stone
              break;
            case "d": //sand
              break;
            case "i": //ice
              break;
            case "b": //black stone
              fill(0);
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
      //console.log("Hello mother");
      console.log(player.mining);
      let tileId = planet.getTilemap()[y][x];
      if (this.tileMiningLevel(tileId)<=player.mining) {
        player.inventory.addItem(new Item(this.tileToItem(tileId),1));
        planet.getTilemap()[y][x] = ".";
      }
    }
  }
  
  tileMiningLevel (t) {
    switch (t) {
      case ".":
        return 255;
      case "m":
        return 0;
      case "z":
        return 255;
      default:
        return 0;
    }
  }
  
  inTilemap(x,y){
    return!(y<=0||x<=0||y>planet.size*gridSpace/2||x>planet.size*gridSpace)
  }
  
  tileToItem(t) {
    switch (t) {
      case "m":
        return 64;
    }
  }
}