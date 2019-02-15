import React, { Component } from "react";

import classes from "./Home.module.css";
import Button from "react-bootstrap/Button";
import Dropdown from "react-bootstrap/Dropdown";
import ButtonToolbar from "react-bootstrap/ButtonToolbar";
import P5Wrapper from "react-p5-wrapper";
import sketchFlat from "../implementations/sketchFlat";
import sketchPointy from "../implementations/sketchFlat";
import sketch3D from "../implementations/sketchFlat";

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
    gameOverBoolean: false
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
    console.log(this.state.implementation);
    this.refreshMap();
    this.setState({
      start: true,
      gameOverBoolean: false,
      mapsize: 2,
      player: { cords: { x: 0, y: 0, z: 0 } },
      timeInterval: 1000 / (this.state.difficulty / 10),
      time: 0
    });
  };

  generateEnemies = n => {
    let enemies = [];
    for (let radius = 1; radius <= n; radius++) {
      for (let i = 0; i < radius; i++) {
        let cords = this.generateRandomHex(radius);
        enemies.push({ cords: { x: cords.x, y: cords.y, z: cords.z } });
      }
    }
    return enemies;
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
    let newEnemies = this.generateEnemies(this.state.mapsize - 1);
    let newFinish = null;
    let finishInRed = true;
    while (finishInRed) {
      newFinish = { cords: this.generateRandomHex(this.state.mapsize - 1) };
      finishInRed = false;
      for (let index = 0; index < newEnemies.length; index++) {
        const enemy = newEnemies[index];
        if (this.dist(enemy.cords, newFinish.cords) === 0) {
          finishInRed = true;
        }
      }
    }
    if (newEnemies && newFinish && newMap) {
      this.setState({
        enemies: newEnemies,
        finish: newFinish,
        map: newMap
      });
    }
  };

  dist = (p1, p2) => {
    return Math.sqrt(
      Math.pow(p2.x - p1.x, 2) +
        Math.pow(p2.y - p1.y, 2) +
        Math.pow(p2.z - p1.z, 2)
    );
  };

  generateRandomHex = n => {
    let x = 0;
    let y = 0;
    let z = 0;
    let a = Math.floor(Math.random * 6 + 1);
    let b = Math.floor(Math.random * n + 1);
    if (a === 1) {
      x = -n;
      y = b;
      z = -y - x;
    } else if (a === 2) {
      x = n;
      y = -b;
      z = -y - x;
    }
    if (a === 3) {
      y = -n;
      x = b;
      z = -y - x;
    } else if (a === 4) {
      y = n;
      x = -b;
      z = -y - x;
    }
    if (a === 5) {
      z = -n;
      y = b;
      x = -y - z;
    } else if (a === 6) {
      z = n;
      y = -b;
      x = -y - z;
    }
    return { x: x, y: y, z: z };
  };

  move = event => {
    if (this.state.start) {
    }
  };

  gameOver = () => {
    this.setState({ start: false });
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
