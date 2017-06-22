var Sniper = function(){
    var self = {
        motion: 0,
        dir: 1,
        state: 'idle'
    }
    
    self.update = function(){
        if( self.state == 'idle' ){
            self.motion = 0;
        }
        else if( self.state == 'walk' ){
            self.motion += 0.34;
            if( self.motion >= 9 ) self.motion = 1;
        }
    }

    self.print = function( scr, img, context ){
        /* 캔버스 저장 */
        context.save();

        var x = self.x - 16 - scr.x;
        var y = self.y - 24 - scr.y;
        var w = 32, h = 48;
        var m = Math.floor( self.motion );

        /* 왼쪽 방향이면 캔버스 반전 */
        if( self.dir == 0 ){
            context.scale( -1, 1 );
            x *= -1;
            x -= 32;
        }

        context.drawImage( img.sniper, m * 32, 0 * 48, w, h, x, y, w, h );

        /* 캔버스 복구 */
        context.restore();
    }

    return self;
}