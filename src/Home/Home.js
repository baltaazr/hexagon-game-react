import React, { Component } from "react";

import classes from "./Home.module.css";
import Button from "react-bootstrap/Button";
import Dropdown from "react-bootstrap/Dropdown";
import ButtonToolbar from "react-bootstrap/ButtonToolbar";
import P5Wrapper from "react-p5-wrapper";
import sketchFlat from "../implementations/sketchFlat";
import sketchPointy from "../implementations/sketchFlat";
import sketch3D from "../implementations/sketchFlat";
import * as abstraction from "../abstraction";

class Home extends Component {
  state = {
    implementation: "flat",
    start: false,
    difficulty: 2,
    mapsize: 0,
    map: [],
    timeInterval: 5000,
    player: null,
    enemies: null,
    finish: null,
    time: 0,
    gameOverBoolean: false,
    hexsize: 25
  };

  componentDidMount() {
    document.addEventListener("keydown", this.move, false);
  }

  changeImplementationHandler = newType => {
    this.setState({ implementation: newType });
  };

  difficultySliderHandler = event => {
    this.setState({ difficulty: event.target.value });
  };

  startButtonHandler = () => {
    this.setState(
      {
        gameOverBoolean: false,
        mapsize: 2,
        player: { cords: abstraction.createVector(0, 0, 0) },
        timeInterval: 1000 / (this.state.difficulty / 10),
        time: 0,
        hexsize: 25
      },
      () => {
        this.refreshMap();
      }
    );
  };

  refreshMap = () => {
    let newMap = [];
    for (let n = 0; n < this.state.mapsize; n++) {
      for (let x = -n; x <= n; x++) {
        for (let y = -n; y <= n; y++) {
          for (let z = -n; z <= n; z++) {
            if (x + y + z === 0) {
              newMap.push({ cords: { x: x, y: y, z: z } });
            }
          }
        }
      }
    }
    let newEnemies = abstraction.generateEnemies(this.state.mapsize - 1);
    let newFinish = null;
    let finishInRed = true;
    while (finishInRed) {
      newFinish = {
        cords: abstraction.generateRandomHex(this.state.mapsize - 1)
      };
      finishInRed = false;
      for (let index = 0; index < newEnemies.length; index++) {
        const enemy = newEnemies[index];
        if (abstraction.dist(enemy.cords, newFinish.cords) === 0) {
          finishInRed = true;
        }
      }
    }
    this.setState({
      map: newMap,
      enemies: newEnemies,
      finish: newFinish,
      start: true
    });
  };

  move = event => {
    if (this.state.start) {
      let newCords = abstraction.createVector(
        this.state.player.cords.x,
        this.state.player.cords.y,
        this.state.player.cords.z
      );
      if (event.keyCode === 81) {
        newCords.x -= 1;
        newCords.y += 1;
      } else if (event.keyCode === 87) {
        newCords.z -= 1;
        newCords.y += 1;
      } else if (event.keyCode === 69) {
        newCords.x += 1;
        newCords.z -= 1;
      } else if (event.keyCode === 65) {
        newCords.x -= 1;
        newCords.z += 1;
      } else if (event.keyCode === 83) {
        newCords.z += 1;
        newCords.y -= 1;
      } else if (event.keyCode === 68) {
        newCords.x += 1;
        newCords.y -= 1;
      }
      if (
        newCords.x < this.state.mapsize &&
        newCords.y < this.state.mapsize &&
        newCords.z < this.state.mapsize &&
        newCords.x > -this.state.mapsize &&
        newCords.y > -this.state.mapsize &&
        newCords.z > -this.state.mapsize
      ) {
        this.setState({
          player: {
            cords: newCords
          }
        });
        for (
          let enemyIndex = 0;
          enemyIndex < this.state.enemies.length;
          enemyIndex++
        ) {
          let enemy = this.state.enemies[enemyIndex];
          if (abstraction.dist(enemy.cords, this.state.player.cords) === 0) {
            this.gameOver();
            return;
          }
        }
        if (
          abstraction.dist(this.state.player.cords, this.state.finish.cords) ===
          0
        ) {
          this.levelUp();
          return;
        }
      }
    }
  };

  gameOver = () => {
    this.setState({ start: false });
  };

  levelUp = () => {
    this.setState(
      {
        mapsize: this.state.mapsize + 1,
        player: { cords: abstraction.createVector(0, 0, 0) },
        time: 0
      },
      () => {
        this.refreshMap();
        let h = 0;
        let w = 0;
        if (this.state.implementation === "flat") {
          h = this.state.hexsize * Math.sqrt(3);
          w = this.state.hexsize * 2;
        } else if (this.state.implementation === "pointy") {
          w = this.state.hexsiz * Math.sqrt(3);
          h = this.state.hexsiz * 2;
        }
        let height = document.getElementById("root").clientHeight;
        let width = document.getElementById("root").clientWidth;
        if (
          (this.state.mapsize - 1) * h > height / 2 ||
          (this.state.mapsize - 1) * (3 / 4) * w > width / 2
        ) {
          this.setState({ hexsize: this.state.hexsize * 0.9 });
        }
      }
    );
  };

  timer = () => {
    this.intervalHandle = setInterval(this.tick, this.timeInterval);
    let time = this.state.minutes;
    this.secondsRemaining = time * 60;
  };

  tick = () => {
    var min = Math.floor(this.secondsRemaining / 60);
    var sec = this.secondsRemaining - min * 60;
    this.setState({
      minutes: min,
      seconds: sec
    });
    if (sec < 10) {
      this.setState({
        seconds: "0" + this.state.seconds
      });
    }
    if (min < 10) {
      this.setState({
        value: "0" + min
      });
    }
    if ((min === 0) & (sec === 0)) {
      clearInterval(this.intervalHandle);
    }
    this.secondsRemaining--;
  };

  render() {
    return this.state.start ? (
      <P5Wrapper
        sketch={
          this.state.implementation === "flat"
            ? sketchFlat
            : this.state.implementation === "pointy"
            ? sketchPointy
            : sketch3D
        }
        mapsize={this.state.mapsize}
        map={this.state.map}
        timeInterval={this.state.timeInterval}
        player={this.state.player}
        enemies={this.state.enemies}
        finish={this.state.finish}
        time={this.state.time}
        gameOver={this.gameOver}
        hexsize={this.state.hexsize}
      />
    ) : (
      <div className={classes.Home}>
        <ButtonToolbar>
          <Button onClick={this.startButtonHandler}>
            Start: {this.state.implementation.toUpperCase()}
          </Button>
          <Dropdown className={"ml-1"}>
            <Dropdown.Toggle variant="success" id="dropdown-basic">
              Change Type
            </Dropdown.Toggle>

            <Dropdown.Menu>
              <Dropdown.Item
                onClick={() => this.changeImplementationHandler("flat")}
              >
                Flat
              </Dropdown.Item>
              <Dropdown.Item
                onClick={() => this.changeImplementationHandler("pointy")}
              >
                Pointy
              </Dropdown.Item>
              <Dropdown.Item
                onClick={() => this.changeImplementationHandler("3d")}
              >
                3D
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </ButtonToolbar>
        <label>Difficulty</label>
        <input
          type="range"
          className="custom-range"
          min="1"
          max="10"
          value={this.state.difficulty}
          onChange={this.difficultySliderHandler}
        />
      </div>
    );
  }
}

export default Home;
