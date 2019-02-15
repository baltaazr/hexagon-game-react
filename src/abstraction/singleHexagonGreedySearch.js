export default (problem, hexagon, mapsize) => {
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

let createVector = (x, y, z) => {
  return { x: x, y: y, z: z };
};

let dist = (p1, p2) => {
  return Math.sqrt(
    Math.pow(p2.x - p1.x, 2) +
      Math.pow(p2.y - p1.y, 2) +
      Math.pow(p2.z - p1.z, 2)
  );
};

let add = (p1, p2) => {
  return { x: p1.x + p2.x, y: p1.y + p2.y, z: p1.z + p2.z };
};
