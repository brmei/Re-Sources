class Jukebox {
  constructor(){
    this.playing = false;
  }
  update(){
    if(current.currentTime() == current.duration() || current.currentTime() == 0){
      current.play();
    }
  }
  initialize(id){
    if(this.playing){return}
    this.playing = true;
    switch (id) {
      case 0:
        space1.play();
        break;
      case 1:
        space2.play();
        break;
      case 2:
        heat.play();
        break;
      default:
        return;
    }
  }
}