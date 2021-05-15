var tool = "pencil"
color = "#000000"

// assign canvas id
var canvas = document.getElementById("draw")

var ctx = canvas.getContext("2d")
resize()

function resize() {
	ctx.canvas.width = window.innerWidth
	ctx.canvas.height = window.innerHeight
}

// initialize position as 0,0
var pos = { x: 0, y: 0 }

function click(e) {
	setPosition(e)
	if (tool == "fill") {
		floodFill(pos.x, pos.y, ctx.getImageData(pos.x,pos.y,1,1).data)
	}
	if (tool == "fill2") {
		floodFill2()
	}
}

// new position from mouse events
function setPosition(e) {
	var rect = canvas.getBoundingClientRect(), // abs. size of element
		scaleX = canvas.width / rect.width,    // relationship bitmap vs. element for X
		scaleY = canvas.height / rect.height;  // relationship bitmap vs. element for Y

	pos.x = (e.clientX-rect.left) * scaleX
 	pos.y = (e.clientY-rect.top) * scaleY
}

function draw(e) {
	if (e.buttons !== 1) return // if mouse is not clicked, do not go further
	if (tool != "pencil" && tool != "eraser") return // if the correct tool isn't selected, do not go further

	if (tool == "pencil") {
		if (document.getElementById("hex").value) {
			color = document.getElementById("hex").value
		}
	}

	if (tool == "pencil" || tool == "eraser") {
		
 		ctx.beginPath() // begin the drawing path

  		ctx.lineWidth = document.getElementById("brushSlider").value // width of line
		ctx.lineCap = "round" // rounded end cap
	
		if (tool == "pencil") {
  			ctx.strokeStyle = color // hex color of line
		}

		if (tool == "eraser") {
			ctx.strokeStyle = "#ffffff" // hex color white
		}
  		ctx.moveTo(pos.x, pos.y) // from position
  		setPosition(e)
  		ctx.lineTo(pos.x, pos.y) // to position

  		ctx.stroke() // draw it!
	}
}

function clearCanvas() {
	ctx.clearRect(ctx.canvas.style.left, ctx.canvas.style.top, ctx.canvas.width, ctx.canvas.height)
}

function colorsEqual(data1, data2) {

	return(data1[0] == data2[0] && data1[1] == data2[1] && data1[2] == data2[2] && data1[3] == data2[3])
}

function floodFill(x, y, originalColor) {
	// defining the color to be filled
	color = document.getElementById("hex").value
	var imageData = ctx.createImageData(1,1)
	var data = imageData.data
	data[0] = parseInt(color.substring(1,3), 16)
	data[1] = parseInt(color.substring(3,5), 16)
	data[2] = parseInt(color.substring(5,7), 16)
	data[3] = 255

	// create stack
	var stack = []
	stack.push([x,y])


	while (stack.length != 0) {
		var coords = stack.pop()
		ctx.putImageData(imageData, coords[0], coords[1]) //fill pixel
		
		//check if in bounds
		if (coords[0] > 0 && coords[0] < ctx.canvas.width && coords[1] > 0 && coords[1] < ctx.canvas.height) {

			//check to make sure color doesn't match fill color and does match background color
			if (!colorsEqual(ctx.getImageData(coords[0]-1, coords[1], 1, 1), data) && colorsEqual(ctx.getImageData(coords[0]-1, coords[1], 1, 1).data, originalColor)) {
				stack.push([coords[0]-1,coords[1]])
			}
			if (!colorsEqual(ctx.getImageData(coords[0]+1, coords[1], 1, 1), data) && colorsEqual(ctx.getImageData(coords[0]+1, coords[1], 1, 1).data, originalColor)) {
				stack.push([coords[0]+1,coords[1]])
			}
			if (!colorsEqual(ctx.getImageData(coords[0], coords[1]-1, 1, 1), data) && colorsEqual(ctx.getImageData(coords[0], coords[1]-1, 1, 1).data, originalColor)) {
				stack.push([coords[0],coords[1]-1])
			}
			if (!colorsEqual(ctx.getImageData(coords[0], coords[1]+1, 1, 1), data) && colorsEqual(ctx.getImageData(coords[0], coords[1]+1, 1, 1).data, originalColor)) {
				stack.push([coords[0],coords[1]+1])
			}
		}

	}
}

function quickFill() {

}

function select(tool_selection) {
	tool = tool_selection
	document.getElementById("currentTool").innerHTML = "current tool: " + tool
}

// brush size slider
var slider = document.getElementById("brushSlider")
var output = document.getElementById("brushSizeDisplay")
output.innerHTML = slider.value;

slider.oninput = function() {
  output.innerHTML = this.value;
}

function submit() {
	if (localStorage.getItem('galleryIndex') == null) {
		localStorage.setItem('galleryIndex', 0)
	}
	console.log("test")
	var g_idx = localStorage.getItem('galleryIndex')
    var dataURL = canvas.toDataURL("image/png")
    imgData = dataURL.replace(/^data:image\/(png|jpg);base64,/, "")
	var imgDataID = "imgData".concat(g_idx.toString())
	localStorage.setItem(imgDataID, imgData)
	clearCanvas()
	g_idx++
	g_idx = g_idx % 5
	localStorage.setItem('galleryIndex', g_idx)
}

// add window event listener to trigger when window is resized
window.addEventListener("resize", resize)

// add event listeners to trigger on different mouse events
document.addEventListener("mousemove", draw)
document.addEventListener("mousedown", click)
document.addEventListener("mouseenter", setPosition)
