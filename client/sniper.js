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

    self.print = function( scr, img, context ){
        var x = self.x - 16 - scr.x;
        var y = self.y - 24 - scr.y;
        var w = 32, h = 48;
        context.drawImage( img.sniper, 0 * 32, 0 * 48, w, h, x, y, w, h );
    }

    return self;
}