export default function sketch(p) {
  let hexsize = 25;
  let h = hexsize * Math.sqrt(3);
  let w = hexsize * 2;
  let map = [];
  let player = null;
  let enemies = null;
  let finish = null;
  let time = 0;

  p.myCustomRedrawAccordingToNewPropsHandler = function(props) {
    if (props.map !== map) {
      map = props.map;
      player = props.player;
      enemies = props.enemies;
      finish = props.finish;
      time = props.time;
      hexsize = props.hexsize;
      h = hexsize * Math.sqrt(3);
      w = hexsize * 2;
      p.background(255);
      drawTime();
      drawMap();
      return;
    }
    if (props.player !== player) {
      p.push();
      let center = p.createVector(p.width / 2, p.height / 2);
      p.translate(center.x, center.y);
      let oldPlayerCords = offset_to_absolute(
        cube_to_offset(
          p.createVector(player.cords.x, player.cords.y, player.cords.z)
        )
      );
      polygon(oldPlayerCords.x, oldPlayerCords.y, hexsize, 6);
      p.push();
      p.fill(0);
      let newPlayerCords = offset_to_absolute(
        cube_to_offset(
          p.createVector(
            props.player.cords.x,
            props.player.cords.y,
            props.player.cords.z
          )
        )
      );
      polygon(newPlayerCords.x, newPlayerCords.y, hexsize, 6);
      p.pop();
      p.pop();
      player = props.player;
      return;
    }
    if (props.enemies !== enemies) {
      p.push();
      let center = p.createVector(p.width / 2, p.height / 2);
      p.translate(center.x, center.y);
      for (let enemyIndex = 0; enemyIndex < enemies.length; enemyIndex++) {
        let enemy = enemies[enemyIndex];
        let oldEnemyCords = offset_to_absolute(
          cube_to_offset(
            p.createVector(enemy.cords.x, enemy.cords.y, enemy.cords.z)
          )
        );
        polygon(oldEnemyCords.x, oldEnemyCords.y, hexsize, 6);
      }
      p.push();
      p.fill(0, 255, 0);
      let finishCords = offset_to_absolute(
        cube_to_offset(
          p.createVector(finish.cords.x, finish.cords.y, finish.cords.z)
        )
      );
      polygon(finishCords.x, finishCords.y, hexsize, 6);
      p.pop();
      p.push();
      p.fill(255, 0, 0);
      for (
        let enemyIndex = 0;
        enemyIndex < props.enemies.length;
        enemyIndex++
      ) {
        let enemy = props.enemies[enemyIndex];
        let newEnemyCords = offset_to_absolute(
          cube_to_offset(
            p.createVector(enemy.cords.x, enemy.cords.y, enemy.cords.z)
          )
        );
        polygon(newEnemyCords.x, newEnemyCords.y, hexsize, 6);
      }
      p.pop();
      p.pop();
      enemies = props.enemies;
      return;
    }
    if (props.hexsize && props.hexsize !== hexsize) {
      hexsize = props.hexsize;
      h = hexsize * Math.sqrt(3);
      w = hexsize * 2;
      p.background(255);
      drawMap();
      return;
    }
    if (props.time !== time) {
      time = props.time;
      drawTime();
      return;
    }
  };

  p.setup = function() {
    p.createCanvas(p.windowWidth, p.windowHeight - 4);
    p.imageMode(p.CENTER);
    p.angleMode(p.DEGREES);
    p.background(255);
  };

  p.draw = function() {};

  let drawMap = () => {
    p.push();
    let center = p.createVector(p.width / 2, p.height / 2);
    p.translate(center.x, center.y);
    for (let n = 0; n < map.length; n++) {
      const mapHex = map[n];
      let cords = offset_to_absolute(
        cube_to_offset(
          p.createVector(mapHex.cords.x, mapHex.cords.y, mapHex.cords.z)
        )
      );
      polygon(cords.x, cords.y, hexsize, 6);
    }
    p.push();
    p.fill(0, 255, 0);
    let finishCords = offset_to_absolute(
      cube_to_offset(
        p.createVector(finish.cords.x, finish.cords.y, finish.cords.z)
      )
    );
    polygon(finishCords.x, finishCords.y, hexsize, 6);
    p.pop();
    p.push();
    p.fill(0);
    let playerCords = offset_to_absolute(
      cube_to_offset(
        p.createVector(player.cords.x, player.cords.y, player.cords.z)
      )
    );
    polygon(playerCords.x, playerCords.y, hexsize, 6);
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
      polygon(cords.x, cords.y, hexsize, 6);
    }
    p.pop();
    p.pop();
  };

  let drawTime = () => {
    p.push();
    p.fill(255, 0, 0);
    p.rect(10, 10, 500, 20);
    p.pop();
    p.push();
    p.fill(0, 255, 0);
    p.rect(10, 10, ((100 - time) / 100) * 500, 20);
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
