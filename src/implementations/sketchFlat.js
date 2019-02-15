import singleHexagonGreedySearch from "../abstraction/singleHexagonGreedySearch";

export default function sketch(p) {
  let HEXSIZE = 25;
  let h = HEXSIZE * Math.sqrt(3);
  let w = HEXSIZE * 2;
  let mapsize = 5;
  let timeInterval = 5000;
  let map = [];
  let player = null;
  let enemies = null;
  let finish = null;
  let time = 0;
  let gameOver = null;

  p.setup = function() {
    console.log(p);
    p.createCanvas(p.windowWidth, p.windowHeight - 4);
    p.imageMode(p.CENTER);
    p.angleMode(p.DEGREES);
  };

  p.myCustomRedrawAccordingToNewPropsHandler = function(props) {
    console.log(props);
    if (props.mapsize) {
      mapsize = props.mapsize;
    }
    if (props.timeInterval) {
      timeInterval = props.timeInterval;
    }
    if (props.map) {
      map = props.map;
    }
    if (props.player) {
      player = props.player;
    }
    if (props.enemies) {
      enemies = props.enemies;
    }
    if (props.finish) {
      finish = props.finish;
    }
    if (props.time) {
      time = props.time;
    }
    if (props.gameOver) {
      gameOver = props.gameOver;
    }
    p.push();
    let center = p.createVector(p.width / 2, p.height / 2);
    p.translate(center.x, center.y);
    drawMap();
    p.pop();
  };

  p.draw = function() {
    if (player && enemies && finish) {
      p.push();
      p.fill(255, 0, 0);
      p.rect(30, 40, 500, 20);
      p.pop();
      p.push();
      p.fill(0, 255, 0);
      p.rect(30, 40, ((time - p.millis()) / timeInterval) * 500, 20);
      p.pop();
      p.push();
      let center = p.createVector(p.width / 2, p.height / 2);
      p.translate(center.x, center.y);
      if (
        (mapsize - 1) * h > p.height / 2 ||
        (mapsize - 1) * (3 / 4) * w > p.width / 2
      ) {
        console.log("SHRINK");
        HEXSIZE = HEXSIZE * 0.9;
        h = HEXSIZE * Math.sqrt(3);
        w = HEXSIZE * 2;
        drawMap();
      }
      if (p.millis() > time) {
        console.log("MOVE");
        for (let enemyIndex = 0; enemyIndex < enemies.length; enemyIndex++) {
          let enemy = enemies[enemyIndex];
          let enemyCords = offset_to_absolute(
            cube_to_offset(
              p.createVector(enemy.cords.x, enemy.cords.y, enemy.cords.z)
            )
          );
          polygon(enemyCords.x, enemyCords.y, HEXSIZE, 6);
        }
        p.push();
        p.fill(0, 255, 0);
        let finishCords = offset_to_absolute(
          cube_to_offset(
            p.createVector(finish.cords.x, finish.cords.y, finish.cords.z)
          )
        );
        polygon(finishCords.x, finishCords.y, HEXSIZE, 6);
        p.pop();
        p.push();
        p.fill(255, 0, 0);
        for (let enemyIndex = 0; enemyIndex < enemies.length; enemyIndex++) {
          let enemy = enemies[enemyIndex];
          enemy.cords = singleHexagonGreedySearch(player, enemy).cords;
          let enemyCords = offset_to_absolute(
            cube_to_offset(
              p.createVector(enemy.cords.x, enemy.cords.y, enemy.cords.z)
            )
          );
          polygon(enemyCords.x, enemyCords.y, HEXSIZE, 6);
          if (p.dist(enemy.cords, player.cords) === 0) {
            gameOver();
          }
        }
        p.pop();
        time = p.millis() + timeInterval;
      }
      p.pop();
    }
  };

  let drawMap = () => {
    p.background(255);
    for (let n = 0; n < map.length; n++) {
      const mapHex = map[n];
      let cords = offset_to_absolute(
        cube_to_offset(
          p.createVector(mapHex.cords.x, mapHex.cords.y, mapHex.cords.z)
        )
      );
      polygon(cords.x, cords.y, HEXSIZE, 6);
    }
    p.push();
    p.fill(0, 255, 0);
    let finishCords = offset_to_absolute(
      cube_to_offset(
        p.createVector(finish.cords.x, finish.cords.y, finish.cords.z)
      )
    );
    polygon(finishCords.x, finishCords.y, HEXSIZE, 6);
    p.pop();
    p.push();
    p.fill(0);
    let playerCords = offset_to_absolute(
      cube_to_offset(
        p.createVector(player.cords.x, player.cords.y, player.cords.z)
      )
    );
    polygon(playerCords.x, playerCords.y, HEXSIZE, 6);
    p.pop();
    p.push();
    p.fill(255, 0, 0);
    for (let enemyIndex = 0; enemyIndex < enemies.length; enemyIndex++) {
      const enemy = enemies[enemyIndex];
      let cords = offset_to_absolute(
        cube_to_offset(
          p.createVector(enemy.cords.x, enemy.cords.y, enemy.cords.z)
        )
      );
      polygon(cords.x, cords.y, HEXSIZE, 6);
    }
    p.pop();
  };

  let offset_to_absolute = hex => {
    let row = hex.y * h;
    let col = hex.x * (3 / 4) * w;
    if (hex.x % 2 !== 0) {
      row += (1 / 2) * h;
    }
    return p.createVector(col, row);
  };

  let cube_to_offset = cube => {
    var col = cube.x;
    var row = cube.z + (cube.x - (cube.x & 1)) / 2;
    return p.createVector(col, row);
  };

  let polygon = (x, y, radius, npoints) => {
    var angle = 360 / npoints;
    p.beginShape();
    for (var a = 0; a < 360; a += angle) {
      var sx = x + p.cos(a) * radius;
      var sy = y + p.sin(a) * radius;
      p.vertex(sx, sy);
    }
    p.endShape(p.CLOSE);
  };
}
