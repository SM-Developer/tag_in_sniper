function drawBullet( x, y, angle, scr, img, context ){
    var x = x - scr.x;
    var y = y - scr.y;
    var w = 30, h = 5;

    /* 캔버스 저장 */
    context.save();

    /* 캔버스 회전 */
    rotateContext( x, y, angle, context );

    /* 이미지 출력 */
    context.drawImage( img.bullet, 0, 0, w, h, x - w/2, y - h/2, w, h );

    /* 캔버스 복구 */
    context.restore();
}

function rotateContext( x, y, angle, context ){
    context.translate( x, y );
    context.rotate( angle * Math.PI/180 );
    context.translate( x * -1, y * -1 );
};