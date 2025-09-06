const puzzle = document.getElementById("puzzle");
const resetBtn = document.getElementById("resetBtn");
const winMessage = document.getElementById("winMessage");
let tiles = [];

function createPuzzle() {
  puzzle.querySelectorAll(".tile").forEach(t => t.remove()); // clear old tiles
  tiles = [];

  // create 15 tiles
  for (let i = 1; i <= 15; i++) {
    const tile = document.createElement("div");
    tile.classList.add("tile");
    tile.style.backgroundPosition = calcBackgroundPos(i);
    tile.dataset.correct = i; // store correct position number
    tiles.push(tile);
    puzzle.appendChild(tile);

    tile.addEventListener("click", () => moveTile(tile));
    tile.addEventListener("touchstart", () => moveTile(tile));
  }

  // empty tile
  const emptyTile = document.createElement("div");
  emptyTile.classList.add("tile", "empty");
  emptyTile.dataset.correct = 16; // empty slot is the 16th
  tiles.push(emptyTile);
  puzzle.appendChild(emptyTile);
}

function calcBackgroundPos(n) {
  const row = Math.floor((n - 1) / 4);
  const col = (n - 1) % 4;
  return `-${col * 100}px -${row * 100}px`;
}

function areAdjacent(i, j, cols = 4) {
  const ri = Math.floor(i / cols), ci = i % cols;
  const rj = Math.floor(j / cols), cj = j % cols;
  return Math.abs(ri - rj) + Math.abs(ci - cj) === 1;
}

function moveTile(tile) {
  const index = tiles.indexOf(tile);
  const emptyIndex = tiles.findIndex(t => t.classList.contains("empty"));
  if (areAdjacent(index, emptyIndex, 4)) {
    [tiles[index], tiles[emptyIndex]] = [tiles[emptyIndex], tiles[index]];
    renderPuzzle();
    checkWin();
  }
}

function renderPuzzle() {
  puzzle.querySelectorAll(".tile").forEach(t => t.remove());
  tiles.forEach(tile => puzzle.appendChild(tile));
}

function shufflePuzzle(moves = 200) {
  winMessage.style.display = "none"; // hide win message on shuffle
  const cols = 4;
  for (let k = 0; k < moves; k++) {
    const emptyIndex = tiles.findIndex(t => t.classList.contains("empty"));
    const r = Math.floor(emptyIndex / cols), c = emptyIndex % cols;
    const neighbors = [];
    if (r > 0) neighbors.push(emptyIndex - cols);
    if (r < cols - 1) neighbors.push(emptyIndex + cols);
    if (c > 0) neighbors.push(emptyIndex - 1);
    if (c < cols - 1) neighbors.push(emptyIndex + 1);
    const choice = neighbors[Math.floor(Math.random() * neighbors.length)];
    [tiles[choice], tiles[emptyIndex]] = [tiles[emptyIndex], tiles[choice]];
  }
  renderPuzzle();
}

function checkWin() {
  const isSolved = tiles.every((tile, idx) => parseInt(tile.dataset.correct) === idx + 1);
  if (isSolved) {
    winMessage.style.display = "block";
  }
}

resetBtn.addEventListener("click", () => shufflePuzzle(200));

createPuzzle();
