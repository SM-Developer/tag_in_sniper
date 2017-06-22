var Sniper = function() {
    var self = {
        motion: 0,
        state: 'idle'
    }
    
    self.update = function() {
        if( state === 'idle' ){
            self.motion = 0;
        }
        else if( state === 'walk' ){
            self.motion++;
        }
    }

    return self;
}