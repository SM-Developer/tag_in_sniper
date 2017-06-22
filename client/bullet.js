var Bullet = function( x, y, angle ) {
	self.x = x;
	self.y = y;
	self.angle = angle;


    self.print = function( scr, img, context ){
        /* 캔버스 저장 */
        context.save();

        var x = self.x - 16 - scr.x;
        var y = self.y - 16 - scr.y;
        var w = 32, h = 32;

        context.fillRect( x, y, w, h );
        //context.drawImage( img.sniper, m * 32, 0 * 48, w, h, x, y, w, h );

        /* 캔버스 복구 */
        context.restore();
    }

}

function drawBullet(x, y, angle, scr, img, context) {
    context.save();

    var x = x - 16 - scr.x;
    var y = y - 16 - scr.y;
    var w = 32, h = 32;

    context.fillRect( x, y, w, h );
    //context.drawImage( img.sniper, m * 32, 0 * 48, w, h, x, y, w, h );

    /* 캔버스 복구 */
    context.restore();
}