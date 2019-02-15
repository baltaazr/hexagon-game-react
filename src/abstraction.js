export const singleHexagonGreedySearch = (problem, hexagon, mapsize) => {
  if (dist(problem.cords, hexagon.cords) === 0) {
    return hexagon;
  }
  let queue = [];
  let surroundings = [
    createVector(-1, 1, 0),
    createVector(0, 1, -1),
    createVector(1, 0, -1),
    createVector(1, -1, 0),
    createVector(0, -1, 1),
    createVector(-1, 0, 1)
  ];
  for (let i = 0; i < surroundings.length; i++) {
    const surrounding = surroundings[i];
    let surroundingCords = add(hexagon.cords, surrounding);
    if (
      surroundingCords.x < mapsize &&
      surroundingCords.y < mapsize &&
      surroundingCords.z < mapsize &&
      surroundingCords.x > -mapsize &&
      surroundingCords.y > -mapsize &&
      surroundingCords.z > -mapsize
    ) {
      queue.push({ cords: surroundingCords });
    }
  }
  while (queue.length > 0) {
    let qIndex = 0;
    for (let nodeIndex = 0; nodeIndex < queue.length; nodeIndex++) {
      if (
        dist(queue[qIndex].cords, problem.cords) >
        dist(queue[nodeIndex].cords, problem.cords)
      ) {
        qIndex = nodeIndex;
      }
    }
    return queue[qIndex];
  }
  return null;
};

export const createVector = (x, y, z) => {
  return { x: x, y: y, z: z };
};

export const dist = (p1, p2) => {
  return Math.sqrt(
    Math.pow(p2.x - p1.x, 2) +
      Math.pow(p2.y - p1.y, 2) +
      Math.pow(p2.z - p1.z, 2)
  );
};

export const generateEnemies = n => {
  let enemies = [];
  for (let radius = 1; radius <= n; radius++) {
    for (let i = 0; i < radius; i++) {
      let cords = generateRandomHex(radius);
      enemies.push({ cords: createVector(cords.x, cords.y, cords.z) });
    }
  }
  return enemies;
};

export const add = (p1, p2) => {
  return { x: p1.x + p2.x, y: p1.y + p2.y, z: p1.z + p2.z };
};

export const generateRandomHex = n => {
  let x = 0;
  let y = 0;
  let z = 0;
  let a = Math.floor(Math.random() * 6 + 1);
  let b = Math.floor(Math.random() * n + 1);
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
  return createVector(x, y, z);
};
