function playSndBackground() {
    sndBackground = new Audio('./client/snd/bgm.mp3'); 
    sndBackground.addEventListener('ended', function() {
        this.currentTime = 0;
        this.play();
    }, false);
    sndBackground.play();
}

function playSndFire() {
    sndFire = new Audio('./snd/fire.wav');
    sndFire.volume = 0.2;
    sndFire.play();
}

function playSndDie() {
    sndDie = new Audio('./snd/die.mp3');
    sndDie.volume = 0.3;
    sndDie.play();
}
