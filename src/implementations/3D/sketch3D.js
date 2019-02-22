export default function sketch(p) {
  let map = [];
  let player = null;
  let enemies = null;
  let finish = null;
  let direction = { x: 0, y: 0, z: 0 };
  let size = 1000;
  let zModifier = 800;
  let zoom = Math.PI / 3;
  let animationHandler = null;
  let animationTimer = 0;

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
      if (props.animation) {
        if (map !== props.map) {
          console.log("CHANGE MAP");
          animationTimer = 0;
          direction = props.direction;
          clearInterval(animationHandler);
          console.log(direction, props.direction);
        } else if (
          Math.abs(direction.x - props.direction.x) > 0.1 ||
          Math.abs(direction.y - props.direction.y) > 0.1 ||
          Math.abs(direction.z - props.direction.z) > 0.1
        ) {
          console.log(direction, props.direction);
          console.log(
            Math.abs(direction.x - props.direction.x),
            Math.abs(direction.y - props.direction.y),
            Math.abs(direction.z - props.direction.z)
          );
          if (animationTimer !== 0) {
            console.log("RESET");
            console.log(animationHandler);
            clearInterval(animationHandler);
            animationTimer = 0;
          }
          animationHandler = setInterval(() => {
            animate(props.direction);
          }, 10);
        }
      } else {
        direction = props.direction;
      }

      map = props.map;
      player = props.player;
      enemies = props.enemies;
      finish = props.finish;
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

  let animate = newDirection => {
    // console.log(direction, newDirection);
    if (
      Math.abs(direction.x - newDirection.x) <= 0.1 &&
      Math.abs(direction.y - newDirection.y) <= 0.1 &&
      Math.abs(direction.z - newDirection.z) <= 0.1
    ) {
      console.log("DONE", animationHandler);
      animationTimer = 0;
      clearInterval(animationHandler);
    }
    animationTimer += 0.01;
    if (direction.x - newDirection.x > 0.01) {
      direction.x -= 0.01;
    } else if (newDirection.x - direction.x > 0.01) {
      direction.x += 0.01;
    }
    if (direction.y - newDirection.y > 0.01) {
      direction.y -= 0.01;
    } else if (newDirection.y - direction.y > 0.01) {
      direction.y += 0.01;
    }
    if (direction.z - newDirection.z > 0.01) {
      direction.z -= 0.01;
    } else if (newDirection.z - direction.z > 0.01) {
      direction.z += 0.01;
    }
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
    drawMap();
  };
}
