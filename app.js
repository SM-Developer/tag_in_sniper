var express = require('express');
var app = express();
var serv = require('http').Server(app);

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/client/index.html');
});
app.use('/client', express.static(__dirname + '/client'));

var map = new Array();
require('./server/map.js').getMap(map);


serv.listen(2000);
console.log("port : 2000 open");

var SOCKET_LIST = {};

var MAP_WIDTH = 800;
var MAP_HEIGHT = 600;
var GRAVITY = 1;
var PLAYER_RADIUS = 40;
var PLAYER_SPEED = 5;

var Sniper = function() {
  var self = {
    x: Math.random() * MAP_WIDTH,
    y: Math.random() * MAP_HEIGHT,
    dir: 0, // 0 left 1 right
    deltaX: 0,
    vy: 0,
    state: 'idle'
  }

  self.update = function() {
    self.gravity();
    self.move();
  }
  self.gravity = function() {
    var fy = Math.floor( (self.y+24) / 30 );
    /* 1의 속도로 중력 가속 */
    if( self.vy < 20 ) self.vy += 1;
    /* y위치에 속력을 더한다. */
    self.y += self.vy;
    
    var x = Math.floor( (self.x+32) / 30 );
    var lx = Math.floor( (self.x+20) / 30 );
    var rx = Math.floor( (self.x+40) / 30 );
    var y = Math.floor( (self.y-24) / 30 );
    
    /* 천장에 닿을 때 */
    if( ( map[ y+1 ][ x ] == 1 || map[ y+1 ][ lx ] == 1 || map[ y+1 ][ rx ] == 1 ) && self.vy < 0 ){
      self.y = y*30 + 48;
      self.vy = 0;
      return;
    }
    
    y = Math.floor( (self.y+24) / 30 );
    /* 바닥에 닿을 때 ( 바로 밑에 땅이 있다 && 떨어지고 있다 && 바닥을 통과하지 않았다 )*/
    if( ( map[ y+1 ][ x ] != 0 || map[ y+1 ][ lx ] != 0 || map[ y+1 ][ rx ] != 0 ) && self.vy > 0 && self.y - self.vy <= y*30 - 24 ){
      self.y = y*30 - 24;
      self.vy = 0;
      if( self.state === 'jump' ){
        self.state = 'idle';
      }
    }
    else{
      self.state = 'jump';
    }
  }
  self.move = function() {
    self.x += self.deltaX;

    var tmpX = Math.floor( (self.x+16) / 30 );
    var tmpY = Math.floor( (self.y+48) / 30 );
    /* 벽에 닿을 때 */
    if( map[ tmpY ][ tmpX ] == 1 || map[ tmpY - 1 ][ tmpX ] == 1 ){
      self.x = tmpX*30 + 12;
    }
    if( map[ tmpY ][ tmpX + 1 ] == 1 || map[ tmpY - 1 ][ tmpX + 1 ] == 1 ){
      self.x = tmpX*30 - 14;
    }
  }
  self.isShot = function(bullet) {
    if (Math.sqrt(
      Math.pow(self.x - bullet.x, 2) +
      Math.pow(self.y - bullet.y, 2)) < PLAYER_RADIUS / 2) {
        return true;
    }
    return false;
  }

  return self;
}

var Player = function(id) {
  var self = Sniper();
  self.id = id;

  // move, 조준경 움직임
  self.pressRight = false;
  self.pressLeft = false;
  self.pressUp = false;
  self.pressDown = false;
  self.pressJump = false;
  self.pressShoot = false;

  self.angle = 0;

  var superUpdate = self.update;
  self.update = function() {
    if( self.state != 'snipe' ){
      self.setSpeed();
    }
    else self.deltaX = 0;

    if( self.pressJump && self.state != 'jump' ){
      self.vy = -12;
    }

    if(self.pressShoot) {
      self.shootBullet(self.angle);
      self.pressShoot = false;
    }

    superUpdate();
  }

  self.setSpeed = function() {
    if( self.state != 'jump' ){
      self.state = 'walk';
    }

    if( self.pressRight ){
      self.dir = 1;
      self.deltaX = PLAYER_SPEED;
    }
    else if( self.pressLeft ){
      self.dir = 0;
      self.deltaX = -PLAYER_SPEED;
    }
    else{
      self.deltaX = 0;
      if( self.state != 'jump' ){
        self.state = 'idle';
      }
    }
  }

  self.shootBullet = function(angle) {
    var b = Bullet(angle);
    b.x = self.x + (PLAYER_RADIUS + 10) * Math.cos(angle / 180 * Math.PI);
    b.y = self.y + (PLAYER_RADIUS + 10) * Math.sin(angle / 180 * Math.PI);
  }

  Player.list[id] = self;
  return self;
}

Player.list = {};


Player.onConnect = function(socket) {
  var player = Player(socket.id);

  socket.on('keyPress', function(data) {
    if (data.inputId === 'right') {
      player.pressRight = data.isPress;
    }
    else if (data.inputId === 'left') {
      player.pressLeft = data.isPress;
    }
    else if (data.inputId === 'up') {
      player.pressUp = data.isPress;
    }
    else if (data.inputId === 'down') {
      player.pressDown = data.isPress;
    }

    else if (data.inputId === 'jump') {
      player.pressJump = data.isPress;
    }
    else if (data.inputId === 'shoot') {
      if( player.state != 'snipe' ){
        player.state = 'snipe';
      }
      else{
        player.pressUp = player.pressDown = player.pressLeft = player.pressRight = false;
        player.state = 'idle';
        player.pressShoot = true;
        player.angle = data.angle;
      }
    }
    else if (data.inputId === 'cancel') {
      if( player.state == 'snipe' ){
        player.pressUp = player.pressDown = player.pressLeft = player.pressRight = false;
        player.state = 'idle';
      }
    }
  });
}

Player.onDisconnect = function(socket) {
  delete Player.list[socket.id];
}

Player.update = function() {
  
  var pack = [];
  for (var i in Player.list) {
    var player = Player.list[i];
    player.update();
    pack.push({
      x: player.x,
      y: player.y,
      id: player.id,
      dir: player.dir,
      state: player.state,
    });
  }
  return pack;

}

var Bullet = function(angle) {
  var self = {
      id: Math.random(),
      spdX: Math.cos(angle/180*Math.PI) * 20,
      spdY: Math.sin(angle/180*Math.PI) * 20,
      angle: angle,
      timer: 0,
      toRemove: false,
  }

  self.update = function() {
    if (self.timer++ > 30) {
      self.toRemove = true;
    }

    self.x += self.spdX;
    self.y += self.spdY;

    var tmpX = Math.floor( (self.x+30) / 30 );
    var tmpY = Math.floor( (self.y+30) / 30 );
    /* 벽에 닿을 때 */
    if( tmpX < 0 || tmpX > map[0].width * 24 || tmpY < 0 || tmpY > map[0].height * 16 || map[ tmpY ][ tmpX ] == 1 ){
      self.toRemove = true;
    }

    for (var i in Player.list) {
      var p = Player.list[i];
      if (p.isShot(self)) {
        // 플레이어가맞음
        self.toRemove = true;
      }
    }
  }

  Bullet.list[self.id] = self;
  return self;
}

Bullet.list = {};
Bullet.update = function() {
  var pack = [];
  for (var i in Bullet.list) {
    var bullet = Bullet.list[i];
    bullet.update();
    if (bullet.toRemove) {
      delete Bullet.list[i];
    }

    else {
      pack.push({
        x: bullet.x,
        y: bullet.y,
        angle: bullet.angle
      });
    }
  }
  return pack;
}

var DEBUG = true;

var io = require('socket.io')(serv, {});
io.sockets.on('connection', function(socket) {
  socket.id = Math.random();
  SOCKET_LIST[socket.id] = socket;


  Player.onConnect(socket);
  socket.emit('initGame', socket.id, Player.list[socket.id], map);

  socket.on('disconnect', function() {
    delete SOCKET_LIST[socket.id];
    Player.onDisconnect(socket);

    for (var i in SOCKET_LIST) {
      var tmpSocket = SOCKET_LIST[i];
      tmpSocket.emit('delPerson', socket.id);
    }

  });
});

setInterval(function() {
  var pack = {
    player: Player.update(),
    bullet: Bullet.update()
  }

  for (var i in SOCKET_LIST) {
    var socket = SOCKET_LIST[i];
    socket.emit('newPosition', pack);
  }

}, 1000/33);
