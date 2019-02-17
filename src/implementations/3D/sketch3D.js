export default function sketch(p) {
  let map = [];
  let player = null;
  let enemies = null;
  let finish = null;
  let direction = null;
  let size = 1000;
  let zModifier = 800;
  let zoom = Math.PI / 3;

  p.setup = function() {
    p.createCanvas(p.windowWidth - 100, p.windowHeight - 115, p.WEBGL);
    p.imageMode(p.CENTER);
    zModifier = p.height / 2 / p.tan(p.PI / 6);
  };

  p.draw = function() {};

  p.myCustomRedrawAccordingToNewPropsHandler = function(props) {
    if (
      direction !== props.direction ||
      map !== props.map ||
      enemies !== props.enemies ||
      player !== props.player ||
      zoom !== props.zoom
    ) {
      map = props.map;
      player = props.player;
      enemies = props.enemies;
      finish = props.finish;
      direction = props.direction;
      zoom = props.zoom;
      p.background(255);
      p.camera(
        0,
        0,
        zModifier,
        direction.x * size,
        direction.y * size,
        direction.z * size + Math.floor(zModifier),
        0,
        1,
        0
      );
      p.perspective(zoom, p.width / p.height, zModifier / 10, zModifier * 10);
      drawMap();
    }
  };

  let drawMap = () => {
    p.push();
    for (let n = 0; n < map.length; n++) {
      const mapHex = map[n];
      drawCube(mapHex.cords.x, mapHex.cords.y, mapHex.cords.z, null, true);
    }

    drawCube(
      finish.cords.x,
      finish.cords.y,
      finish.cords.z,
      p.createVector(0, 255, 0)
    );

    for (let enemyIndex = 0; enemyIndex < enemies.length; enemyIndex++) {
      const enemy = enemies[enemyIndex];
      drawCube(
        enemy.cords.x,
        enemy.cords.y,
        enemy.cords.z,
        p.createVector(255, 0, 0)
      );
    }
    p.pop();
  };

  let drawCube = (x, y, z, color, noFill) => {
    p.push();
    if (noFill) {
      p.noFill();
      p.stroke(0);
    } else {
      p.fill(color.x, color.y, color.z);
    }
    p.translate(
      x * size - player.cords.x * size,
      y * size - player.cords.y * size,
      z * size + zModifier - player.cords.z * size
    );
    p.box(size);
    p.pop();
  };
}
