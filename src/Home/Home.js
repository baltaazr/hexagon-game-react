import React, { Component } from "react";

import classes from "./Home.module.css";
import Button from "react-bootstrap/Button";
import Dropdown from "react-bootstrap/Dropdown";
import ButtonToolbar from "react-bootstrap/ButtonToolbar";
import FormCheck from "react-bootstrap/FormCheck";
import P5Wrapper from "react-p5-wrapper";
import sketchFlat from "../implementations/sketchFlat";
import sketchPointy from "../implementations/sketchPointy";
import sketch3D from "../implementations/3D/sketch3D";
import miniMap from "../implementations/3D/miniMap";
import * as abstraction from "../abstraction";

class Home extends Component {
  state = {
    implementation: "flat",
    start: false,
    difficulty: 2,
    mapsize: 0,
    map: [],
    player: null,
    enemies: null,
    finish: null,
    time: 0,
    gameOverBoolean: false,
    hexsize: 25,
    direction: { x: 0, y: 0, z: 0 },
    zoom: Math.PI / 3,
    animation: false,
    timer: false
  };

  componentDidUpdate() {
    document.addEventListener("keydown", this.move, false);
  }

  //HANDLERS

  changeImplementationHandler = newType => {
    this.setState({ implementation: newType });
  };

  difficultySliderHandler = event => {
    this.setState({ difficulty: parseInt(event.target.value) });
  };

  animationBoxHandler = () => {
    this.setState({ animation: !this.state.animation }, () => {
      console.log(this.state.animation);
    });
  };

  timerBoxHandler = () => {
    this.setState({ timer: !this.state.timer }, () => {
      console.log(this.state.timer);
    });
  };

  //GAME UPDATE

  startGame = () => {
    this.setState(
      {
        gameOverBoolean: false,
        mapsize: 2,
        player: { cords: abstraction.createVector(0, 0, 0) },
        time: 0,
        hexsize: 25
      },
      () => {
        this.refreshMap();
        if (this.state.timer) {
          this.timer();
        }
      }
    );
  };

  refreshMap = () => {
    let newMap = abstraction.generateNewMap(this.state.mapsize);
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

  levelUp = () => {
    this.setState(
      {
        mapsize: this.state.mapsize + 1,
        player: { cords: abstraction.createVector(0, 0, 0) },
        time: 0
      },
      () => {
        this.refreshMap();
        let newHexsize = this.state.hexsize;
        let h = 0;
        let w = 0;
        let height = document.getElementById("root").clientHeight;
        let width = document.getElementById("root").clientWidth;
        if (this.state.implementation === "flat") {
          h = this.state.hexsize * Math.sqrt(3);
          w = this.state.hexsize * 2;
          while (
            (this.state.mapsize - 1) * h > height / 2 ||
            (this.state.mapsize - 1) * (3 / 4) * w > width / 2
          ) {
            newHexsize *= 0.9;
            h = newHexsize * Math.sqrt(3);
            w = newHexsize * 2;
          }
        } else if (this.state.implementation === "pointy") {
          w = this.state.hexsize * Math.sqrt(3);
          h = this.state.hexsize * 2;
          while (
            (this.state.mapsize - 1) * (3 / 4) * h > height / 2 ||
            (this.state.mapsize - 1) * w > width / 2
          ) {
            newHexsize *= 0.9;
            w = newHexsize * Math.sqrt(3);
            h = newHexsize * 2;
          }
        }
        if (newHexsize !== this.state.hexsize) {
          this.setState({ hexsize: newHexsize });
        }
      }
    );
  };

  gameOver = () => {
    this.setState({ start: false });
  };

  //CONTROLS

  move = event => {
    if (this.state.start) {
      if (event.keyCode === 67) {
        if (this.state.implementation === "3d") {
          this.setState({ implementation: "flat" });
        } else if (this.state.implementation === "flat") {
          this.setState({ implementation: "pointy" });
        } else if (this.state.implementation === "pointy") {
          this.setState({ implementation: "3d" });
        }
        return;
      }
      if (this.state.implementation === "3d") {
        let newDirection = { x: 0, y: 0, z: 0 };
        if (event.keyCode === 90) {
          newDirection.x -= 1;
          newDirection.y += 1;
        } else if (event.keyCode === 87) {
          newDirection.x += 1;
          newDirection.y -= 1;
        } else if (event.keyCode === 69) {
          newDirection.z += 1;
          newDirection.y -= 1;
        } else if (event.keyCode === 65) {
          newDirection.x -= 1;
          newDirection.z += 1;
        } else if (event.keyCode === 88) {
          newDirection.z -= 1;
          newDirection.y += 1;
        } else if (event.keyCode === 68) {
          newDirection.x += 1;
          newDirection.z -= 1;
        }
        this.setState({ direction: newDirection });
      } else {
        let newCords = abstraction.createVector(
          this.state.player.cords.x,
          this.state.player.cords.y,
          this.state.player.cords.z
        );
        if (this.state.implementation === "flat") {
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
        } else if (this.state.implementation === "pointy") {
          if (event.keyCode === 87) {
            newCords.z -= 1;
            newCords.y += 1;
          } else if (event.keyCode === 69) {
            newCords.x += 1;
            newCords.z -= 1;
          } else if (event.keyCode === 65) {
            newCords.x -= 1;
            newCords.y += 1;
          } else if (event.keyCode === 68) {
            newCords.x += 1;
            newCords.y -= 1;
          } else if (event.keyCode === 90) {
            newCords.x -= 1;
            newCords.z += 1;
          } else if (event.keyCode === 88) {
            newCords.z += 1;
            newCords.y -= 1;
          }
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
            abstraction.dist(
              this.state.player.cords,
              this.state.finish.cords
            ) === 0
          ) {
            this.levelUp();
            return;
          }
        }
      }
    } else if (event.keyCode === 13) {
      this.startGame();
    }
  };

  directionMove = () => {
    let newCords = {
      x: this.state.player.cords.x + this.state.direction.x,
      y: this.state.player.cords.y + this.state.direction.y,
      z: this.state.player.cords.z + this.state.direction.z
    };
    if (
      newCords.x < this.state.mapsize &&
      newCords.y < this.state.mapsize &&
      newCords.z < this.state.mapsize &&
      newCords.x > -this.state.mapsize &&
      newCords.y > -this.state.mapsize &&
      newCords.z > -this.state.mapsize
    ) {
      this.setState(
        {
          player: {
            cords: newCords
          }
        },
        () => {
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
            abstraction.dist(
              this.state.player.cords,
              this.state.finish.cords
            ) === 0
          ) {
            this.levelUp();
            return;
          }
        }
      );
    }
  };

  zoom = event => {
    if (event.deltaY > 0 && this.state.zoom < (Math.PI * 7) / 8) {
      this.setState({ zoom: this.state.zoom + Math.PI / 12 });
    } else if (event.deltaY < 0 && this.state.zoom > 0) {
      this.setState({ zoom: this.state.zoom - Math.PI / 12 });
    }
  };

  //TIMER

  timer = () => {
    this.intervalHandle = setInterval(
      this.tick,
      10 / (this.state.difficulty / 10)
    );
  };

  tick = () => {
    if (this.state.start) {
      this.setState(
        {
          time: this.state.time + 1
        },
        () => {
          if (this.state.time === 100) {
            clearInterval(this.intervalHandle);
            let newEnemies = [];
            for (
              let enemyIndex = 0;
              enemyIndex < this.state.enemies.length;
              enemyIndex++
            ) {
              let newEnemy = { ...this.state.enemies[enemyIndex] };
              newEnemy.cords = abstraction.singleHexagonGreedySearch(
                this.state.player,
                newEnemy,
                this.state.mapsize
              ).cords;
              if (
                abstraction.dist(newEnemy.cords, this.state.player.cords) === 0
              ) {
                this.gameOver();
                return;
              } else {
                newEnemies.push(newEnemy);
              }
              if (enemyIndex === this.state.enemies.length - 1) {
                this.setState({ enemies: newEnemies, time: 0 });
                this.timer();
              }
            }
          }
        }
      );
    } else {
      clearInterval(this.intervalHandle);
    }
  };

  render() {
    return this.state.start ? (
      <React.Fragment>
        <h1 className={classes.lvl}>Level: {this.state.mapsize - 1}</h1>
        <div onClick={this.directionMove} onWheel={this.zoom}>
          {this.state.implementation === "3d" ? (
            <React.Fragment>
              <P5Wrapper time={this.state.time} sketch={miniMap} />
              <P5Wrapper
                sketch={sketch3D}
                map={this.state.map}
                player={this.state.player}
                enemies={this.state.enemies}
                finish={this.state.finish}
                direction={this.state.direction}
                zoom={this.state.zoom}
                animation={this.state.animation}
              />
            </React.Fragment>
          ) : (
            <P5Wrapper
              sketch={
                this.state.implementation === "flat" ? sketchFlat : sketchPointy
              }
              map={this.state.map}
              player={this.state.player}
              enemies={this.state.enemies}
              finish={this.state.finish}
              time={this.state.time}
              hexsize={this.state.hexsize}
            />
          )}
        </div>
      </React.Fragment>
    ) : (
      <div className={classes.Home}>
        <ButtonToolbar>
          <Button onClick={this.startGame}>
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
        <React.Fragment>
          Timer <FormCheck onClick={this.timerBoxHandler} />
        </React.Fragment>
        {this.state.implementation === "3d" ? (
          <React.Fragment>
            Animation <FormCheck onClick={this.animationBoxHandler} />
          </React.Fragment>
        ) : null}
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
