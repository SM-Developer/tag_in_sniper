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

        if( self.state == 'jump' ){
            m = 6;
        }

        /* 왼쪽 방향이면 캔버스 반전 */
        if( self.dir == 0 ){
            context.scale( -1, 1 );
            x *= -1;
            x -= 32;
        }

        if ( self.state == 'die' ){
            context.drawImage( img.sniper, 1 * 32, 1 * 48, 42, h, x, y, 42, h );
        }
        else if( self.state != 'snipe' ){
            context.drawImage( img.sniper, m * 32, 0 * 48, w, h, x, y, w, h );
        }
        else{
            context.drawImage( img.sniper, 0 * 32, 1 * 48, w, h, x, y, w, h );
        }

        if ( self.state != 'die' ){
            self.printGun( x, y, m, scr, img, context );
        }

        /* 캔버스 복구 */
        context.restore();
    }
    self.printGun = function( x, y, m, scr, img, context ){
        /* 캔버스 저장 */
        context.save();
        
        /* 출력용 임시 변수 생성 */
        var w = 50;
        var h = 10;
        y += 20;

        /* 점프 모션 */
        if( self.state == 'jump' ) y += 2;
        /* 앉기 모션 */
        else if( self.state == 'snipe' ) y += 8;
        /* 달리기 모션 */
        else{
            if( m % 2 == 1 ) y++;
            if( m == 2 || m == 6 ) y += 2;
        }
        
        /* 이미지 출력 */
        context.drawImage( img.gun, 0, 0, w, h, x, y, w, h );
        
        /* 캔버스 복구 */
        context.restore();
    }

    return self;
}