function printMap( map, scr, img, context ){
	var i, j;
	var si = Math.round( (scr.y+240) / 30 ) - 10;
	var sj = Math.round( (scr.x+360) / 30 ) - 14;
	for( i = si; i <= si + 16 + 4; i++ ){
		if( i < 1 ) continue;
		for( j = sj; j <= sj + 24 + 4; j++ ){
			if( j < 1 ) continue;
			
			if( map[i][j] == 1 ){
				context.drawImage( img.tile, 0, 0, 30, 30, (j-1)*30-scr.x, (i-1)*30-scr.y, 30, 30 );
			}
			if( map[i][j] == 2 ){
				context.drawImage( img.tile, 30, 0, 30, 30, (j-1)*30-scr.x, (i-1)*30-scr.y, 30, 30 );
			}
		}
	}
}