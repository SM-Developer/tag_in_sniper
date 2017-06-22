var Screen = function( player, map ){
    var self = {
        x: player.x - 360,
        y: player.y - 240,
        dx: player.x + 360,
        dy: player.y + 240,
        width: map[0].width,
        height: map[0].height
    }

    self.move = function( player ){
    	/* 스크린이 따라갈 목표 지정 */
		if( player.state == 'snipe' ){
			self.dx = player.sniping.x;
			self.dy = player.sniping.y;
		}
		else{
			self.dx = player.x;
			self.dy = player.y;
		}
		
		/* 남은 거리에 비례해서 따라간다 */
		self.x += (self.dx - self.x - 360) / 10;
		self.y += (self.dy - self.y - 240) / 10;
		
		/* 거의 비슷하게 따라왔으면 그냥 설정 */
		if( Math.abs( self.x + 360 - self.dx ) + Math.abs( self.y + 240 - self.dy ) <= 1 ){
			self.x = self.dx - 360;
			self.y = self.dy - 240;
		}
		
		/* 테두리 */
		if( self.x < 0 ) self.x = 0;
		if( self.y < 0 ) self.y = 0;
		if( self.x > 30*self.width*24 - 720 ) self.x = 30*self.width*24 - 720;
		if( self.y > 30*self.height*16 - 480 ) self.y = 30*self.height*16 - 480;
		
		/* 소숫점 없애기 */
		self.x = Math.round( self.x );
		self.y = Math.round( self.y );
    }

    return self;
}