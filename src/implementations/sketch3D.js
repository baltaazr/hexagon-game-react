export default function sketch(p) {
  let map = [];
  let player = null;
  let enemies = null;
  let finish = null;
  let time = 0;
  let direction = null;
  let size = 100;
  let zModifier = 800;

  p.setup = function() {
    p.createCanvas(p.windowWidth, p.windowHeight - 7, p.WEBGL);
    p.imageMode(p.CENTER);
    zModifier = p.height / 2 / p.tan(p.PI / 6);
  };

  p.draw = function() {
    if (player) {
      //console.log(direction.z + p.height / 2 / p.tan(p.PI / 6));
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
      drawTime();
      drawMap();
    }
    // if(player){
    // }
    // p.ambientLight(255);
    // p.push();
    // p.rotateX(angle);
    // p.rotateY(angle * 0.3);
    // p.rotateZ(angle * 1.2);
    // p.noStroke();
    // p.normalMaterial();
    // p.box(100);
    // p.pop();
    // p.translate(0, 100);
    // p.rotateX(p.HALF_PI);
    // p.ambientMaterial(100);
    // p.plane(500, 500);
    // angle += 0.03;
  };

  p.myCustomRedrawAccordingToNewPropsHandler = function(props) {
    map = props.map;
    player = props.player;
    enemies = props.enemies;
    finish = props.finish;
    time = props.time;
    direction = props.direction;
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

  let drawTime = () => {
    // p.push();
    // p.fill(255, 0, 0);
    // p.rect(10, 10, 500, 20);
    // p.pop();
    // p.push();
    // p.fill(0, 255, 0);
    // p.rect(10, 10, ((100 - time) / 100) * 500, 20);
    // p.pop();
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
