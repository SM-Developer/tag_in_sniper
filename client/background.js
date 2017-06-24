var Background = function(){
    var self = {
      star: new Array()
    }

    
    for( var i = 1; i <= 100; i++ ){
        self.star[i] = new Object();
        self.star[i].x = Math.random()*1100;
        self.star[i].y = Math.random()*600;
        self.star[i].scale = Math.random()*0.7 + 0.2;
    }

    self.print = function( scr, img, context ){
        /* 별 */
        for( var i = 1; i <= 100; i++ ){
            var s = self.star[i];
            if( s.x - scr.x / 12 < 0 || s.x - scr.x / 12 > 720 || s.y - scr.y / 12 < 0 || s.y - scr.y / 12 > 480 ) continue;
            context.fillStyle = "rgb(255,255,255)";
            context.beginPath();
            context.arc( s.x - scr.x / 12, s.y - scr.y / 12, s.scale+Math.random()*0.3, 0, Math.PI*2, false );
            context.closePath();
            context.fill();
        }
        
        /* 달 */
        context.drawImage( img.moon, 0, 0, 96, 96, 600 - 48 - scr.x / 10, 180 - 48 - scr.y / 10, 96, 96 );
        
        /* 건물 */
        context.drawImage( img.building, scr.x * ( 3720 / ( 30*(scr.width+1)*24 ) ), 0, 720, 480, 0, 300 - scr.y * 0.15, 720, 480 );

    }

    return self;
}