function resize() {
    bannerImg.width = window.innerWidth/1.5
    bannerImg.height = window.innerHeight/1.5
}
function resizeAll() {
    var i
    for(i = 0; i < bannerImgArr.length; i++) {
        bannerImgArr[i].width = window.innerWidth/1.5
        bannerImgArr[i].height = window.innerHeight/1.5
    }
}
function loadDrawing(imgDataID, elementID) {
    var dataImage = localStorage.getItem(imgDataID)
    bannerImg = document.getElementById(elementID)
    bannerImgArr.push(bannerImg)
    resize()
    bannerImg.src = "data:image/png;base64," + dataImage
}

bannerImgArr = []
loadDrawing('imgData0', 'drawing0')
loadDrawing('imgData1', 'drawing1')
loadDrawing('imgData2', 'drawing2')
loadDrawing('imgData3', 'drawing3')
loadDrawing('imgData4', 'drawing4')

// add window event listener to trigger when window is resized
window.addEventListener("resize", resizeAll)