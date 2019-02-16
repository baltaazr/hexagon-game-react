export default function sketch(p) {
  let map = [];
  let player = null;
  let enemies = null;
  let finish = null;
  let time = 0;
  let mouseX = 0;
  let mouseY = 0;

  let angle = 0;
  p.setup = function() {
    p.createCanvas(p.windowWidth, p.windowHeight - 4, p.WEBGL);
  };

  p.draw = function() {
    p.background(0);
    p.camera(0, 0, p.height / 2 / p.tan(p.PI / 6), -100, -100, 0, 0, 1, 0);
    p.ambientLight(255);

    p.push();
    p.rotateX(angle);
    p.rotateY(angle * 0.3);
    p.rotateZ(angle * 1.2);
    p.noStroke();
    p.normalMaterial();
    p.box(100);
    p.pop();

    p.translate(0, 100);
    p.rotateX(p.HALF_PI);
    p.ambientMaterial(100);
    p.plane(500, 500);

    angle += 0.03;
  };

  p.myCustomRedrawAccordingToNewPropsHandler = function(props) {
    mouseX = props.mouseX;
    mouseY = props.mouseY;
    if (props.map !== map) {
      map = props.map;
      player = props.player;
      enemies = props.enemies;
      finish = props.finish;
      time = props.time;
      p.background(255);
      // drawTime();
      // drawMap();
      return;
    }
    if (props.player !== player) {
      // p.push();
      // drawCube(
      //   player.cords.x,
      //   player.cords.y,
      //   player.cords.z,
      //   p.createVector(255, 255, 255)
      // );
      // drawCube(
      //   props.player.cords.x,
      //   props.player.cords.y,
      //   props.player.cords.z,
      //   p.createVector(0, 0, 0)
      // );
      // p.pop();
      player = props.player;
      return;
    }
    if (props.enemies !== enemies) {
      // p.push();
      // for (let enemyIndex = 0; enemyIndex < enemies.length; enemyIndex++) {
      //   let enemy = enemies[enemyIndex];
      //   drawCube(
      //     enemy.cords.x,
      //     enemy.cords.y,
      //     enemy.cords.z,
      //     p.createVector(255, 255, 255)
      //   );
      // }
      // drawCube(
      //   finish.cords.x,
      //   finish.cords.y,
      //   finish.cords.z,
      //   p.createVector(0, 255, 0)
      // );
      // for (
      //   let enemyIndex = 0;
      //   enemyIndex < props.enemies.length;
      //   enemyIndex++
      // ) {
      //   let enemy = props.enemies[enemyIndex];
      //   drawCube(
      //     enemy.cords.x,
      //     enemy.cords.y,
      //     enemy.cords.z,
      //     p.createVector(255, 0, 0)
      //   );
      // }
      // p.pop();
      enemies = props.enemies;
      return;
    }
    if (props.time !== time) {
      time = props.time;
      // drawTime();
      return;
    }
  };
}

//   p.setup = function() {
//     console.log(p);
//     p.createCanvas(p.windowWidth, p.windowHeight - 4, p.WEBGL);
//     p.imageMode(p.CENTER);
//     p.angleMode(p.DEGREES);
//     p.background(255);
//     // p.camera(0, 0, 0, 0, 0, 0, 0, 1, 0);
//   };

//   p.draw = function() {
//     if (player) {
//       console.log("CAMERA");
//       p.camera(player.x, player.y, player.z, p.mouseX, p.mouseY, 1, 0, 1, 0);
//     }
//   };

//   let drawMap = () => {
//     p.push();
//     for (let n = 0; n < map.length; n++) {
//       const mapHex = map[n];
//       drawCube(
//         mapHex.cords.x,
//         mapHex.cords.y,
//         mapHex.cords.z,
//         p.createVector(255, 255, 255)
//       );
//     }
//     drawCube(
//       finish.cords.x,
//       finish.cords.y,
//       finish.cords.z,
//       p.createVector(0, 255, 0)
//     );
//     drawCube(
//       player.cords.x,
//       player.cords.y,
//       player.cords.z,
//       p.createVector(0, 0, 0)
//     );
//     for (let enemyIndex = 0; enemyIndex < enemies.length; enemyIndex++) {
//       const enemy = enemies[enemyIndex];
//       drawCube(
//         enemy.cords.x,
//         enemy.cords.y,
//         enemy.cords.z,
//         p.createVector(255, 0, 0)
//       );
//     }
//     p.pop();
//   };

//   let drawTime = () => {
//     // p.push();
//     // p.fill(255, 0, 0);
//     // p.rect(10, 10, 500, 20);
//     // p.pop();
//     // p.push();
//     // p.fill(0, 255, 0);
//     // p.rect(10, 10, ((100 - time) / 100) * 500, 20);
//     // p.pop();
//   };

//   let drawCube = (x, y, z, color) => {
//     p.push();
//     p.fill(color.x, color.y, color.z);
//     p.translate(x * 100, y * 100, z * 100);
//     p.box(100);
//     p.pop();
//   };
// }
