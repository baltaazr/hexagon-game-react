export default function sketch(p) {
  let time = 0;

  p.myCustomRedrawAccordingToNewPropsHandler = function(props) {
    if (props.time !== time) {
      time = props.time;
      drawTime();
      return;
    }
  };

  p.setup = function() {
    p.createCanvas(p.windowWidth, 100);
    p.imageMode(p.CENTER);
    p.angleMode(p.DEGREES);
    p.background(255);
  };

  p.draw = function() {};

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
}
