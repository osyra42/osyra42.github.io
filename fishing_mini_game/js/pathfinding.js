// A* Pathfinding algorithm

function findPath(startX, startY, endX, endY) {
  const openSet = [{x: startX, y: startY, g: 0, h: 0, f: 0, parent: null}];
  const closedSet = new Set();

  while (openSet.length > 0) {
    let lowestIdx = 0;
    for (let i = 1; i < openSet.length; i++) {
      if (openSet[i].f < openSet[lowestIdx].f) lowestIdx = i;
    }

    const current = openSet[lowestIdx];

    if (current.x === endX && current.y === endY) {
      const path = [];
      let node = current;
      while (node.parent) {
        path.unshift({x: node.x, y: node.y});
        node = node.parent;
      }
      return path;
    }

    openSet.splice(lowestIdx, 1);
    closedSet.add(`${current.x},${current.y}`);

    const dirs = [[-1,0], [1,0], [0,-1], [0,1]];
    for (const [dx, dy] of dirs) {
      const nx = current.x + dx;
      const ny = current.y + dy;

      if (!isWalkable(nx, ny)) continue;
      if (closedSet.has(`${nx},${ny}`)) continue;

      const g = current.g + 1;
      const h = Math.abs(nx - endX) + Math.abs(ny - endY);
      const f = g + h;

      const existing = openSet.find(n => n.x === nx && n.y === ny);
      if (existing) {
        if (g < existing.g) {
          existing.g = g;
          existing.f = f;
          existing.parent = current;
        }
      } else {
        openSet.push({x: nx, y: ny, g, h, f, parent: current});
      }
    }

    if (closedSet.size > 2000) break;
  }

  return [];
}
