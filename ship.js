
class Backpack {
  constructor() {
    this.items = [];
    this.select = 0; //The position of the current item the player has selected
  }
  
  addItem(item) {
    for(let i = 0; i < this.items.length; i++) {
      if(this.items[i].id == item.id) {
        this.items[i].count += item.count;
        return true;
      }
    }
    append(this.items, item);
    shipCraft.update();
  }
  
  switchItem(){
    this.select++;
    if(this.select == this.items.length){
      this.select = 0;
    }
  }
  
  useItem(index = this.select){
     switch (this.items[index].id) {
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
    this.items[index].count -= 1;
    this.select -= 1;
    if (this.select < 0) {this.select = 0;}
    if(this.items[index].count == 0){
      this.items.splice(index, 1);
     
      if(this.select>this.items.length){this.select--}
      
    }
  }
  useForCraft(index){
    this.items[index].count -= 1;
    if(this.items[index].count == 0){
      this.items.splice(index, 1);
    }
  }
  deleteItem(index){
    this.items.splice(index, 1);
    if(this.select>0){this.select--}
  }
  hasItem(id){
    for(let i = 0; i < this.items.length; i++){
      if(this.items[i].id == id){return true}
    }
    return false;
  }
  show(){
    fill(0);
    rect(0,0,sidebarWidth,gameHeight);
    fill(50,200,50);
    textSize(sidebarRow/2);
    for(let i = 0; i < this.items.length; i++){
      if(this.select == i){
        let strName = this.items[i].count+" | "+this.items[i].name();
        rect(0, 0 + i*sidebarRow,textWidth(strName)+sidebarRow*3/4,sidebarRow);
        rect(0, 0 + i*sidebarRow,sidebarWidth,sidebarRow,10);
        fill(0);
        text(this.items[i].count+" | "+this.items[i].name(),sidebarRow/4,sidebarRow*3/4 + i*sidebarRow);
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
    let strName = this.items[this.select].count+" | "+this.items[this.select].name();
    rect(0, 0,textWidth(strName)+sidebarRow*3/4,sidebarRow);
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
      case 3:
        return "SO"; //Spaghetti Oxide
      case 64:
        return "Iron Oxide"
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
  constructor(item,ingredients = [],quantity = []){
    this.item = item;
    this.ingredients = ingredients;
    this.quantity = quantity;
  }
  canCraft(){
    for(let i = 0; i < this.ingredients.length; i++){
      for(let e = 0; e < player.inventory.items.length; e++){
        if(player.inventory.items[e].id == this.ingredients[i].id && player.inventory.items[e].count >= this.quantity[i]){break}
        if(e == player.inventory.items.length - 1){return false}
      }
    }
    return true;
  }
  craft(){
    for(let i = 0; i < this.ingredients.length; i++){
      for(let e = 0; e < player.inventory.items.length; e++){
        if(player.inventory.items[e].id == this.ingredients[i].id){
          for(let j = 0; j < this.quantity[i]; j++){
            player.inventory.useForCraft(e);
          }
          break;
        }
      }
    }
    player.inventory.addItem(new Item(this.item.id,this.item.count));
  }
}

class CraftMenu {
  constructor(recipes){
    this.recipes = recipes;
    this.available = [];
    this.select = 0;
  }
  switchRecipe(){
    this.select++;
    if(this.select == this.available.length){
      this.select = 0;
    }
  }
  update(){
    this.available = [];
    for(let i = 0; i < this.recipes.length; i++){
      if(this.recipes[i].canCraft()){
        append(this.available, this.recipes[i]);
      }
    }
  }
  show(){
    fill(0);
    rect(0,0,gameWidth/2,gameHeight);
    fill(50,200,50);
    textSize(sidebarRow/2);
    for(let i = 0; i < this.available.length; i++){
      if(this.select == i){
        let strName = this.available[i].item.name();
        rect(0, 0 + i*sidebarRow,textWidth(strName)+sidebarRow*3/4,sidebarRow);
        rect(0, 0 + i*sidebarRow,sidebarWidth,sidebarRow,10);
        fill(0);
        text(this.available[i].item.name(),sidebarRow/4,sidebarRow*3/4 + i*sidebarRow);
        fill(50,200,50);
      }
      else{
       text(this.available[i].item.name(),sidebarRow/4,sidebarRow*3/4 + i*sidebarRow);
      }
    }
    //console.log(this.items);
  }
}