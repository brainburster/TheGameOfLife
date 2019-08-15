class Bitmap {
  constructor(w, h) {
    this.w = w;
    this.h = h;
    this.rowLength = ((w - 1) >> 5) + 1;
    this.data = new Array();
    for (let i = 0; i < this.rowLength; i++) {
      this.data.push(new Uint32Array(h));
    }
  }
  setData(x, y, v) {
    if (x < 0 || x >= this.w || y < 0 || y >= this.h) {
      //throw Error("超出范围");
      return 0;
    }
    const row = x >>> 5;
    x &= 0b11111;
    const flag = 1 << x;
    if (v) {
      this.data[row][y] |= flag;
    } else {
      this.data[row][y] &= ~flag;
    }
  }
  getData(x, y) {
    if (x < 0 || x >= this.w || y < 0 || y >= this.h) {
      //throw Error("超出范围");
      return 0;
    }
    const row = x >>> 5;
    x = x % 32;
    const flag = 1 << x;
    return (this.data[row][y] & flag) ? 1 : 0;
  }
  clear() {
    this.data.forEach((v) => {
      v.fill(0);
    });
  }
  equal(bitmap) {
    if (this.w !== bitmap.w || this.h !== bitmap.h) {
      return false;
    }
    return this.data.every((v, x) => v.every((u, y) => u === bitmap.data[x][y]));
  }
  copy() {
    const bitmap = new Bitmap(this.w, this.h);
    for (let i = 0; i < this.rowLength; i++) {
      bitmap.data[i] = new Uint32Array(this.data[i])
    }
    return bitmap;
  }
}

//热寂效果
const colors = ["#666", "#777", "#877", "#977", "#A66", "#B66", "#C77", "#D77", "#E88", "#F88"];
colors.reverse();

const cellSizes = [20, 10, 5, 3, 2, 1];
const bitMapWs = [40, 80, 160, 266, 400, 800];
const bitMapHs = [30, 60, 120, 200, 300, 600];

const defaultMap = [
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0],
  [0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0],
  [0, 0, 0, 0, 1, 1, 0, 0, 0, 1, 1, 0],
  [0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0],
  [0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0],
  [0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 1, 1, 0, 1, 1, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 1, 1, 0, 1, 0, 1, 1, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0],
];

const tools = {
  "铅笔": {
    onmousedown: (game, x, y, r) => {
      for (let i = -r; i <= r; i++) {
        for (let j = -r; j <= r; j++) {
          game.data.setData(x + i, y + j, 1);
        }
      }
    }
  },
  "橡皮": {
    onmousedown: (game, x, y, r) => {
      for (let i = -r; i <= r; i++) {
        for (let j = -r; j <= r; j++) {
          game.data.setData(x + i, y + j, 0);
        }
      }
    }
  },
  "飞行器": {
    maps: [
      [
        [0, 0, 1],
        [1, 0, 1],
        [0, 1, 1],
      ],
      [
        [0, 1, 0],
        [1, 0, 0],
        [1, 1, 1],
      ],
      [
        [1, 1, 0],
        [1, 0, 1],
        [1, 0, 0],
      ],
      [
        [1, 1, 1],
        [0, 0, 1],
        [0, 1, 0],
      ],
      [
        [1, 0, 0, 1, 0],
        [0, 0, 0, 0, 1],
        [1, 0, 0, 0, 1],
        [0, 1, 1, 1, 1]
      ]
    ],
    onclick: (game, x, y, r) => {
      const map = tools["飞行器"].maps[r];
      for (let j = 0; j < map.length; j++) {
        for (let i = 0; i < map[j].length; i++) {
          game.data.setData(x + i - (map[j].length >>> 1), y + j - (map.length >>> 1), map[j][i]);
        }
      }
    }
  },
  "振荡器": {
    maps: [
      [
        [0, 0, 0],
        [1, 1, 1],
        [0, 0, 0],
      ],
      [
        [0, 0, 1, 1],
        [0, 0, 0, 1],
        [1, 0, 0, 0],
        [1, 1, 0, 0],
      ],
      [
        [0, 0, 0, 0],
        [0, 1, 1, 1],
        [1, 1, 1, 0],
        [0, 0, 0, 0],
      ],
      [
        [0, 0, 1, 1, 1, 0, 0, 0, 1, 1, 1, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 1],
        [0, 0, 1, 1, 1, 0, 0, 0, 1, 1, 1, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 1, 1, 1, 0, 0, 0, 1, 1, 1, 0, 0],
        [1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 1],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 1, 1, 1, 0, 0, 0, 1, 1, 1, 0, 0],
      ],
      defaultMap,
    ],
    onclick: (game, x, y, r) => {
      const map = tools["振荡器"].maps[r];
      for (let j = 0; j < map.length; j++) {
        for (let i = 0; i < map[j].length; i++) {
          game.data.setData(x + i - (map[j].length >>> 1), y + j - (map.length >>> 1), map[j][i]);
        }
      }
    }
  }
}

class GameOfLife {
  constructor() {
    this.canvas = document.getElementById("main_canvas");
    this.canvas.width = 800;
    this.canvas.height = 600;
    this.context = this.canvas.getContext("2d");
    this.context.fillStyle = "gray";
    this.context.strokeStyle = "black";

    const mapSizeRange = document.getElementById("map-size");

    this.cellSize = cellSizes[mapSizeRange.valueAsNumber];
    this.data = new Bitmap(bitMapWs[mapSizeRange.valueAsNumber], bitMapHs[mapSizeRange.valueAsNumber]);
    this.dataOld = this.data.copy();
    this.history = [];
    this.history.push(this.dataOld);
    this.pause = true;
    //定义枚举
    this.direction = {
      DIRECTION_ALL: 0,
      DIRECTION_LEFT: 1,
      DIRECTION_RIGHT: 2,
      DIRECTION_UP: 3,
      DIRECTION_DWON: 4,
      DIRECTION_LEFT_UP: 5,
      DIRECTION_LEFT_DWON: 6,
      DIRECTION_RIGHT_UP: 7,
      DIRECTION_RIGHT_DWON: 8
    }

    const selectTool = document.getElementById("tool");
    selectTool.oninput = () => {

    }

    const brushSizeRange = document.getElementById("brush-size");

    this.canvas.onclick = (e) => {
      const x = Math.floor(e.offsetX / this.cellSize);
      const y = Math.floor(e.offsetY / this.cellSize);
      tools[selectTool.value].onclick && tools[selectTool.value].onclick(this, x, y, brushSizeRange.valueAsNumber >>> 1);
    }

    this.canvas.onmousedown = (e) => {
      const x = Math.floor(e.offsetX / this.cellSize);
      const y = Math.floor(e.offsetY / this.cellSize);
      tools[selectTool.value].onmousedown && tools[selectTool.value].onmousedown(this, x, y, brushSizeRange.valueAsNumber >>> 1);
    }

    this.canvas.onmousemove = (e) => {
      if (e.buttons !== 1) {
        return;
      }
      const x = Math.floor(e.offsetX / this.cellSize);
      const y = Math.floor(e.offsetY / this.cellSize);
      tools[selectTool.value].onmousedown && tools[selectTool.value].onmousedown(this, x, y, brushSizeRange.valueAsNumber >>> 1);
    }

    this.canvas.ontouchmove = (e) => {
      for (let i = 0; i < e.targetTouches.length; i++) {
        const touch = e.targetTouches[i];
        let x = touch.clientX - this.canvas.offsetLeft;
        let y = touch.clientY - this.canvas.offsetTop;
        x = Math.floor(x / this.cellSize);
        y = Math.floor(y / this.cellSize);
        tools[selectTool.value].onmousedown && tools[selectTool.value].onmousedown(this, x, y, brushSizeRange.valueAsNumber >>> 1);
      }
      e.preventDefault();
    }

    window.onkeydown = (e) => {
      switch (e.key) {
        case "z":
          if (this.history.length > 1) {
            this.data = this.history.pop();
          }
          break;
        default:
          break;
      }
    }

    const undoBtn = document.createElement("button");
    undoBtn.innerHTML = `撤销一次`;
    undoBtn.onclick = () => {
      if (this.pause) {
        const tmp = this.data;
        this.data = this.dataOld;
        this.dataOld = tmp;
      }
    }
    document.getElementById("buttons").appendChild(undoBtn);

    const debugBtn = document.createElement("button");
    debugBtn.innerHTML = "单步调试";
    debugBtn.onclick = () => {
      this.pause = false;
      this.update();
      this.pause = true;
      this.draw();
    }
    document.getElementById("buttons").appendChild(debugBtn);

    const pauseBtn = document.getElementById("pause");
    pauseBtn.innerHTML = "点击，以开始";
    pauseBtn.onclick = () => {
      this.pause = !this.pause;
      if (this.pause) {
        pauseBtn.innerHTML = "点击，以开始";
      } else {
        pauseBtn.innerHTML = "暂停，以绘制地图";
      }
    }

    mapSizeRange.oninput = () => {
      this.resize(mapSizeRange.valueAsNumber);
      this.setMap(defaultMap);
      pauseBtn.innerHTML = "点击，以开始";
    }

    const randomBtn = document.createElement("button");
    randomBtn.innerHTML = "随机汤";
    randomBtn.onclick = () => {
      for (let i = 0; i < this.data.w; i++) {
        for (let j = 0; j < this.data.h; j++) {
          let value = Math.random() > 0.33 ? 0 : 1;
          this.data.setData(i, j, value);
        }
      }
      this.dataOld = this.data.copy();
      this.history.length = 0;
    }
    document.getElementById("buttons").appendChild(randomBtn);
    const restartBtn = document.createElement("button");
    restartBtn.innerHTML = "重开";
    restartBtn.onclick = () => {
      window.location.reload();
    }
    document.getElementById("buttons").appendChild(restartBtn);

    const clearBtn = document.createElement("button");
    clearBtn.innerHTML = "清屏";
    clearBtn.onclick = () => {
      this.data.clear();
      this.dataOld.clear();
      this.history.length = 0;
    }
    document.getElementById("buttons").appendChild(clearBtn);

    const GPUBtn = document.createElement("button");
    GPUBtn.innerHTML = "GPU版本..";
    GPUBtn.onclick = () => {
      window.open("https://brainburster.github.io/GameOfLife/gameOfLifeGpu");
    }
    document.getElementById("buttons").appendChild(GPUBtn);

    const speedRange = document.getElementById("speed");
    speedRange.oninput = () => {
      this.speed = 200 - speedRange.valueAsNumber;
    }
    this.speed = 200 - speedRange.valueAsNumber;

    this.bHeatDeath = true;
    const checkboxHD = document.getElementById("heat-death")
    checkboxHD.oninput = () => {
      this.bHeatDeath = checkboxHD.checked;
    };

    this.selectB = document.getElementById("b");
    this.selectS1 = document.getElementById("s1");
    this.selectS2 = document.getElementById("s2");

    this.sb = 3;
    this.ss1 = 2;
    this.ss2 = 3;

    this.selectB.oninput = () => {
      this.sb = this.selectB.selectedIndex;
    }
    this.selectS1.oninput = () => {
      this.ss1 = this.selectS1.selectedIndex;
    }
    this.selectS2.oninput = () => {
      this.ss2 = this.selectS2.selectedIndex;
    }

    this.canvas.style.cursor = "pointer";
    debugBtn.style.cursor = "pointer";
    randomBtn.style.cursor = "pointer";
    clearBtn.style.cursor = "pointer";
    GPUBtn.style.cursor = "pointer";
    restartBtn.style.cursor = "pointer";
    pauseBtn.style.cursor = "pointer";
  }

  resize(n) {
    this.cellSize = cellSizes[n];
    this.data = new Bitmap(bitMapWs[n], bitMapHs[n]);
    this.dataOld = this.data.copy();
    this.history.length = 0;
    this.history.push(this.dataOld);
    this.pause = true;
  }

  setMap(map) {
    for (let i = 0; i < map.length; i++) {
      for (let j = 0; j < map[i].length; j++) {
        this.data.setData(i, j, map[i][j]);
      }
    }
    //创建虚假而永恒的历史
    this.history.push(this.data);
    this.history.push(this.data);
    this.history.push(this.data);
    this.history.push(this.data);
    this.history.push(this.data);
    this.history.push(this.data);
    this.history.push(this.data);
  }

  saveData() {
    this.dataOld = this.data.copy();
    this.history.push(this.dataOld);
    if (this.history.length > 8) {
      this.history.shift();
    }
  }

  drawCell(x, y, color = "gray") {
    this.context.fillStyle = color;
    this.context.fillRect(x * this.cellSize, y * this.cellSize, this.cellSize, this.cellSize);
    if (this.cellSize < 4) {
      return;
    }
    if (this.cellSize < 9) {
      this.context.fillStyle = "darkgray";
    } else {
      this.context.fillStyle = "black";
    }
    this.context.strokeRect(x * this.cellSize, y * this.cellSize, this.cellSize, this.cellSize);
  }

  getCountAdjacency(x, y, direction = 0) {
    if (direction === this.direction.DIRECTION_ALL) {
      let sum = 0;
      for (let i = 1; i < 9; i++) {
        sum += this.getCountAdjacency(x, y, i) || 0;
      }
      return sum;
    }

    switch (direction) {
      case this.direction.DIRECTION_LEFT:
        x -= 1;
        break;
      case this.direction.DIRECTION_RIGHT:
        x += 1;
        break;
      case this.direction.DIRECTION_UP:
        y -= 1;
        break;
      case this.direction.DIRECTION_DWON:
        y += 1;
        break;
      case this.direction.DIRECTION_LEFT_UP:
        x -= 1;
        y -= 1;
        break;
      case this.direction.DIRECTION_LEFT_DWON:
        x -= 1;
        y += 1;
        break;
      case this.direction.DIRECTION_RIGHT_UP:
        x += 1;
        y -= 1;
        break;
      case this.direction.DIRECTION_RIGHT_DWON:
        x += 1;
        y += 1;
        break;
      default:
        break;
    }
    return this.dataOld.getData(x, y);
  }

  update() {
    if (this.pause) {
      return;
    }

    this.saveData();
    for (let i = 0; i < this.data.w; i++) {
      for (let j = 0; j < this.data.h; j++) {
        let adj = this.getCountAdjacency(i, j);
        if (adj === this.sb) { //b3
          //出生
          this.data.setData(i, j, 1);
        } else if (adj === this.ss1 || adj === this.ss2) { //s23
          //不变
        } else {
          //死亡
          this.data.setData(i, j, 0);
        }
      }
    }
  }

  draw() {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    for (let i = 0; i < this.data.w; i++) {
      for (let j = 0; j < this.data.h; j++) {
        if (this.data.getData(i, j)) {
          if (this.bHeatDeath) {
            const count = this.history.reduce((a, b) => a + b.getData(i, j), 0);
            this.drawCell(i, j, colors[count]);
          } else {
            this.drawCell(i, j, "gray");
          }
        }
      }
    }
  }

  run() {
    let previous = (new Date()).getTime();
    let lag = 0.0;

    const gameloop = () => {
      const current = (new Date()).getTime();
      const elapsed = current - previous;
      previous = current;
      lag += elapsed;

      while (lag >= this.speed) {
        this.update();
        lag -= this.speed;
      }
      this.draw();
      requestAnimationFrame(gameloop);
    };

    gameloop();
  }
}