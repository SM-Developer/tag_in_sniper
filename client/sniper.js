var Sniper = function(){
    var self = {
        motion: 0,
        state: 'idle'
    }
    
    self.update = function(){
        if( state === 'idle' ){
            self.motion = 0;
        }
        else if( state === 'walk' ){
            self.motion++;
        }
    }

    self.print = function( img, context ){
        var w = 32, h = 48, x = self.x - 16, y = self.y - 24;
        context.drawImage( img.sniper, 0 * 32, 0 * 48, w, h, x, y, w, h );
    }

    return self;
}