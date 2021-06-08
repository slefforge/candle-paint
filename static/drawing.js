// starting tool and color
let tool = 'pencil';
let color = '#000000';

// assign canvas id
const canvas = document.getElementById('draw');
const ctx = canvas.getContext('2d');

// initialize position as 0,0
const pos = { x: 0, y: 0 };

// brush size slider
const slider = document.getElementById('brushSlider');
const output = document.getElementById('brushSizeDisplay');
output.innerHTML = slider.value;

slider.oninput = function updateSlider() {
  output.innerHTML = this.value;
};

function resize() {
  ctx.canvas.width = window.innerWidth;
  ctx.canvas.height = window.innerHeight;
}

// new position from mouse events
function setPosition(e) {
  const rect = canvas.getBoundingClientRect(); // abs. size of element
  const scaleX = canvas.width / rect.width; // relationship bitmap vs. element for X
  const scaleY = canvas.height / rect.height; // relationship bitmap vs. element for Y

  pos.x = (e.clientX - rect.left) * scaleX;
  pos.y = (e.clientY - rect.top) * scaleY;
}

function draw(e) {
  if (e.buttons !== 1) return; // if mouse is not clicked, do not go further
  if (tool !== 'pencil' && tool !== 'eraser') return; // if the correct tool isn't selected, do not go further
  if (tool === 'pencil' || tool === 'eraser') {
    ctx.beginPath(); // begin the drawing path
    ctx.lineWidth = document.getElementById('brushSlider').value; // width of line
    ctx.lineCap = 'round'; // rounded end cap

    if (tool === 'pencil') {
      ctx.strokeStyle = color; // hex color of line
    }

    if (tool === 'eraser') {
      ctx.strokeStyle = '#ffffff'; // hex color white
    }

    ctx.moveTo(pos.x, pos.y); // from position
    setPosition(e);
    ctx.lineTo(pos.x, pos.y); // to position
    ctx.stroke(); // draw it!
  }
}

function colorPixel(pixelPos, imgData) {
  imgData.data[pixelPos] = parseInt(color.substring(1, 3), 16);
  imgData.data[pixelPos + 1] = parseInt(color.substring(3, 5), 16);
  imgData.data[pixelPos + 2] = parseInt(color.substring(5, 7), 16);
  imgData.data[pixelPos + 3] = 255;
}

function matchStartColor(imgData, pixelPos, startR, startG, startB) { // doesn't work yet, read the explanation on the guide
  const r = imgData.data[pixelPos];
  const g = imgData.data[pixelPos + 1];
  const b = imgData.data[pixelPos + 2];
  return (r === startR && g === startG && b === startB);
}

function quickFill(x, y) { // uses this algorithm: http://www.williammalone.com/articles/html5-canvas-javascript-paint-bucket-tool/
  const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);

  imgData.data[0] = 0;
  ctx.putImageData(imgData, 0, 0);

  x = Math.trunc(x); // You might not need
  y = Math.trunc(y); // to do this

  const pixelStack = [[x, y]];
  let newPos;
  let pixelPos = (y * canvas.width + x) * 4;
  const startR = imgData.data[pixelPos];
  const startG = imgData.data[pixelPos + 1];
  const startB = imgData.data[pixelPos + 2];
  let reachLeft;
  let reachRight;

  // If the selected color matches the color of the selected pixel, do nothing
  if (startR === parseInt(color.substring(1, 3), 16) && startG === parseInt(color.substring(3, 5), 16) && startB === parseInt(color.substring(5, 7), 16)) {
    return;
  }

  while (pixelStack.length) {
    newPos = pixelStack.pop();
    x = newPos[0];
    y = newPos[1];

    pixelPos = (y * canvas.width + x) * 4; // gives position if you numbered each square one dimensionally (kind of like a k-map)
    while (y >= 0 && matchStartColor(imgData, pixelPos, startR, startG, startB)) { // going up
      y -= 1;
      pixelPos -= canvas.width * 4;
    }

    pixelPos += canvas.width * 4;
    y += 1;
    reachLeft = false;
    reachRight = false;

    while (y < canvas.height - 1 && matchStartColor(imgData, pixelPos, startR, startG, startB)) { // going down
      y += 1;
      colorPixel(pixelPos, imgData);
      if (x > 0) { // left seeding
        if (matchStartColor(imgData, pixelPos - 4, startR, startG, startB)) {
          if (!reachLeft) {
            pixelStack.push([x - 1, y]);
            reachLeft = true;
          }
        } else if (reachLeft) {
          reachLeft = false;
        }
      }

      if (x < canvas.width - 1) { // right seeding
        if (matchStartColor(imgData, pixelPos + 4, startR, startG, startB)) {
          if (!reachRight) {
            pixelStack.push([x + 1, y]);
            reachRight = true;
          }
        } else if (reachRight) {
          reachRight = false;
        }
      }
      pixelPos += canvas.width * 4;
    }
  }
  ctx.putImageData(imgData, 0, 0);
}

function click(e) {
  setPosition(e);
  if (tool === 'quickFill' && pos.x > 0 && pos.x < canvas.width) {
    quickFill(pos.x, pos.y);
  }
}

function clearCanvas() {
  ctx.fillStyle = 'white';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function selectTool(toolSelection) {
  tool = toolSelection;
  document.getElementById('currentTool').innerHTML = 'current tool: ' + tool;
}

function selectColor(colorSelection) {
  color = colorSelection;
  document.getElementById('currentColor').innerHTML = 'current color: ' + color;
}

function submit() {
  if (localStorage.getItem('galleryIndex') == null) {
    localStorage.setItem('galleryIndex', 0);
  }
  let galleryIndex = localStorage.getItem('galleryIndex');
  const dataURL = canvas.toDataURL('image/png');
  const imgData = dataURL.replace(/^data:image\/(png|jpg);base64,/, '');
  const imgDataID = 'imgData'.concat(galleryIndex); // concat converts variable to string
  galleryIndex = parseInt(galleryIndex, 10); // converting back to an int
  localStorage.setItem(imgDataID, imgData);
  clearCanvas();
  galleryIndex += 1;
  galleryIndex %= 5;
  localStorage.setItem('galleryIndex', galleryIndex);
}

// initialize canvas
resize();
clearCanvas();

// add window event listener to trigger when window is resized
window.addEventListener('resize', resize);

// add event listeners to trigger on different mouse events
document.addEventListener('mousemove', draw);
document.addEventListener('mousedown', click);
document.addEventListener('mouseenter', setPosition);
