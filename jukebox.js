class Jukebox {
  constructor(){
  }
  update(){
    if(current.currentTime() == current.duration()){
      current.play();
    }
  }
  initialize(newSong){
    current = newSong;
  }
}