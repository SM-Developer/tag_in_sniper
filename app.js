var express = require('express');
var app = express();
var serv = require('http').Server(app);

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/client/index.html');
});
app.use('/client', express.static(__dirname + '/client'));

serv.listen(2000);
console.log("port : 2000 open");

var SOCKET_LIST = {};

var MAP_WIDTH = 800;
var MAP_HEIGHT = 600;
var GRAVITY = 1;
var PLAYER_RADIUS = 40;
var PLAYER_SPEED = 10;

//만드세요 맵
var Map = [[]];

var Sniper = function() {
  var self = {
    x: Math.random() * MAP_WIDTH,
    y: Math.random() * MAP_HEIGHT,
    deltaX: 0,
    ay: 0,
    state: 'idle'
  }

  self.update = function() {
    self.gravity();
    self.move();
  }
  self.gravity = function() {
    // 뽕진이가 중력 만드세요
  }
  self.move = function() {
    self.x += self.deltaX;
  }
  self.isShot = function(bullet) {
    if (Math.sqrt(
      Math.pow(self.x - bullet.x, 2) +
      Math.pow(self.y - bullet.y, 2)) < PLAYER_RADIUS) {
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
  self.pressAttack = false

  self.angle = 0;

  var superUpdate = self.update;
  self.update = function() {
    self.setSpeed();
    superUpdate();

    if(self.pressAttack) {
      self.shootBullet(self.angle);
    }
  }
  self.setSpeed = function() {
    if (self.pressRight) {
      self.deltaX = PLAYER_SPEED;
    }
    else if (self.pressLeft)
      self.deltaX = -PLAYER_SPEED;
    else
      self.deltaX = 0;
  }

  self.shootBullet = function(angle) {
    var b = Bullet(angle);
    b.x = self.x + (PLAYER_RADIUS + 10) * Math.cos(angle * 180 / Math.PI);
    b.y = self.y + (PLAYER_RADIUS + 10) * Math.sin(angle * 180 / Math.PI);
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
      player.state = data.state;
    }
    else if (data.inputId === 'left') {
      player.pressLeft = data.isPress;
      player.state = data.state;
    }
    else if (data.inputId === 'up') {
      player.pressUp = data.isPress;
      player.state = data.state;
    }
    else if (data.inputId === 'down') {
      player.pressDown = data.isPress;
      player.state = data.state;
    }
    else if (data.inputId === 'shoot') {
      player.state = 'idle';
      player.angle = data.angle;
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
      state: player.state,
    });
  }
  return pack;
}

var Bullet = function(angle) {
  var self;
  // x, y
  self.id = Math.random();
  self.spdX = Math.cos(angle/180*Math.PI) * 10;
  self.spdY = Math.sin(angle/180*Math.PI) * 10;

  self.timer = 0;
  self.toRemove = false;

  self.update = function() {
    if (self.timer++ > 100)
      self.toRemove = true;

    for (var i in Player.list) {
      var p = Player.list[i];
      if (p.isShot(self)) {
        self.toRemove = true;
        // 플레이어가맞음
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
        y: bullet.y
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
  socket.on('disconnect', function() {
    delete SOCKET_LIST[socket.id];
    Player.onDisconnect(socket);
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

}, 1000/25);
