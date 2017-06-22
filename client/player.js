var SNIPING_SPEED = 1.5;
var SNIPING_SPEED_FRICTION = 0.5;

var Player = function( x, y, state ) {
    var self = Sniper();
    self.x = x;
    self.y = y;
    self.state = state;

    self.sniping = new Object();
    self.sniping.x = self.x;
    self.sniping.y = self.y;
    self.sniping.vx = 0;
    self.sniping.vy = 0;

    self.moveSniping = function(){
      /* 속도 증가 */
      if( key.up && self.sniping.vy > -20 ) self.sniping.vy -= SNIPING_SPEED;
      if( key.down && self.sniping.vy < 20 ) self.sniping.vy += SNIPING_SPEED;
      if( key.left && self.sniping.vx > -20 ) self.sniping.vx -= SNIPING_SPEED;
      if( key.right && self.sniping.vx < 20 ) self.sniping.vx += SNIPING_SPEED;

      /* 마찰력 */
      if( self.sniping.vx < 0 ) self.sniping.vx += SNIPING_SPEED_FRICTION;
      if( self.sniping.vx > 0 ) self.sniping.vx -= SNIPING_SPEED_FRICTION;
      if( self.sniping.vy < 0 ) self.sniping.vy += SNIPING_SPEED_FRICTION;
      if( self.sniping.vy > 0 ) self.sniping.vy -= SNIPING_SPEED_FRICTION;

      /* 사정거리 이내 */
      if( myMath.dist( self.x, self.y, self.sniping.x + self.sniping.vx, self.sniping.y + self.sniping.vy ) < 600 ){
        self.sniping.x += self.sniping.vx;
        self.sniping.y += self.sniping.vy;
      }
      /* 사정거리 밖이면 원모양으로 회전 */
      else{
        self.sniping.x += self.sniping.vx;
        self.sniping.y += self.sniping.vy;
        var angle = Math.atan2( self.sniping.y - self.y, self.sniping.x - self.x );
        self.sniping.x = self.x + 600 * Math.cos( angle );
        self.sniping.y = self.y + 600 * Math.sin( angle );
      }
    }

    self.printSniping = function(){
        /* 조준점 */
        context.drawImage( img.snipe, 0, 0, 32, 32, self.sniping.x - 16 - scr.x, self.sniping.y - 16 - scr.y, 32, 32 );
        
        var range = 600;
        /* 조준원 */
        context.fillStyle = "rgba( 0, 255, 0, 0.05 )";
        context.beginPath();
        context.arc( self.x - scr.x, self.y - scr.y, range, 0, Math.PI*2, false);
        context.closePath();
        context.fill();
        
        /* 조준원 테두리 */
        context.strokeStyle = "rgb( 0, 255, 0 )";
        for( ; range >= 100; range -= 200 ){
          context.beginPath();
          context.arc( self.x - scr.x, self.y - scr.y, range, 0, Math.PI*2, false);
          context.closePath();
          context.stroke();
        }
    }

    return self;
}

var myMath = new Object();

myMath.dist = function( x1, y1, x2, y2 ){
  return Math.sqrt( ( x1 - x2 ) * ( x1 - x2 ) + ( y1 - y2 ) * ( y1 - y2 ) );
};