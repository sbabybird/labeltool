export function BgLayer(render) {
  var info = "Drag and drop files here";
  this.draw = function() {
    render.ctx.save();
    render.ctx.fillStyle = "#eeeeee";
    render.ctx.fillRect(0, 0, render.width, render.height);
    render.ctx.strokeStyle = "#dddddd";
    for (var i = 0; i < render.width; i += 10) {
      render.ctx.beginPath();
      render.ctx.moveTo(i, 0);
      render.ctx.lineTo(i, render.height);
      render.ctx.stroke();
    }
    for (var j = 0; j < render.height; j += 10) {
      render.ctx.beginPath();
      render.ctx.moveTo(0, j);
      render.ctx.lineTo(render.width, j);
      render.ctx.stroke();
    }
    render.ctx.fillStyle = "#0f0f0f";
    render.ctx.font = "30px Arial";
    render.ctx.textAlign = "center";
    render.ctx.textBaseline = "middle";
    render.ctx.fillText(info, render.width / 2, render.height / 2);
    render.ctx.restore();
  };
}

export function ImgLayer(render, url, imgLoaded) {
  var img = new Image();
  img.src = url;
  img.onload = function() {
    render.xoffset = Math.floor((render.width - img.width) / 2);
    render.yoffset = Math.floor((render.height - img.height) / 2);
    render.ctx.drawImage(img, 0, 0);
    imgLoaded();
  };

  this.draw = function() {
    render.ctx.save();
    render.ctx.translate(render.xoffset, render.yoffset);
    render.ctx.drawImage(img, 0, 0);
    render.ctx.restore();
  };

  this.getWidth = function() {
    return img.width;
  };

  this.getHeight = function() {
    return img.height;
  };
}

export function LabelLayer(render) {
  var labelObjects = new Array();

  this.add = function(label) {
    labelObjects.push(label);
  };

  this.draw = function() {
    for (var i = 0; i < labelObjects.length; i++) {
      labelObjects[i].draw(render);
    }
  };

  this.clean = function() {
    labelObjects.length = 0;
  };
}

export function Canvas(canvas) {
  var toolPool = {};
  var curToolName = "";
  var bgLayer;
  var imgLayer;
  var labelLayer;

  var render = {};
  render.ctx = canvas.getContext("2d");
  render.width = canvas.width;
  render.height = canvas.height;
  render.xoffset = 0;
  render.yoffset = 0;
  render.scale = 1.0;

  canvas.addEventListener("wheel", (event) => {
    event.preventDefault();

    // 获取鼠标在 Canvas 上的坐标
    const mouseX = event.clientX - canvas.getBoundingClientRect().left;
    const mouseY = event.clientY - canvas.getBoundingClientRect().top;

    // 根据滚轮方向调整缩放比例
    if (event.deltaY < 0) {
      render.scale *= 1.1; // 放大
    } else {
      render.scale *= 0.9; // 缩小
    }

    // 重新绘制内容
    render.ctx.setTransform(1, 0, 0, 1, 0, 0); // 重置变换
    render.ctx.translate(mouseX, mouseY); // 移动画布到鼠标位置
    render.ctx.scale(render.scale, render.scale); // 缩放画布
    render.ctx.translate(-mouseX, -mouseY); // 移动画布回原位
    this.draw();
  });

  this.clean = function() {
    labelLayer.clean();
  };

  this.setTool = function(name, tool) {
    toolPool[name] = tool;
  };

  this.setCurTool = function(name) {
    if (toolPool[curToolName]) {
      toolPool[curToolName].end();
    }
    curToolName = name;
    if (toolPool[curToolName]) {
      toolPool[curToolName].start();
    }
  };

  this.setBgLayer = function(layer) {
    bgLayer = layer;
  };

  this.setImgLayer = function(layer) {
    imgLayer = layer;
  };

  this.setLabelLayer = function(layer) {
    labelLayer = layer;
  };

  this.getImgLayer = function() {
    return imgLayer;
  };

  this.getLabelLayer = function() {
    return labelLayer;
  };

  this.draw = function() {
    render.ctx.save();
    render.ctx.translate(0.5, 0.5);
    if (bgLayer) bgLayer.draw();
    render.ctx.translate(-0.5, -0.5);
    if (imgLayer) imgLayer.draw();
    render.ctx.translate(0.5, 0.5);
    if (labelLayer) labelLayer.draw();
    render.ctx.restore();
  };

  this.onMouseDown = function(e) {
    if (toolPool[curToolName]) toolPool[curToolName].onMouseDown(e);
  };

  this.onMouseUp = function(e) {
    if (toolPool[curToolName]) toolPool[curToolName].onMouseUp(e);
  };

  this.onMouseMove = function(e) {
    if (toolPool[curToolName]) toolPool[curToolName].onMouseMove(e);
  };

  this.onKeyDown = function(e) {
    if (toolPool[curToolName]) toolPool[curToolName].onKeyDown(e);
  };

  this.onKeyUp = function(e) {
    if (toolPool[curToolName]) toolPool[curToolName].onKeyUp(e);
  };

  this.getRender = function() {
    return render;
  };

  this.toDataURL = function() {
    // 由于初始化时为了使图片剧中，整体将render进行偏移了x和y
    // 然后最后输出时，重置画布大小，并将偏移值归零
    // 为了输出整幅图片，所以等于重置了漫游工具的值
    // 输出图片之后，再恢复现场
    var ow = canvas.width;
    var oh = canvas.height;
    var ox = render.xoffset;
    var oy = render.yoffset;
    render.width = canvas.width = imgLayer.getWidth();
    render.height = canvas.height = imgLayer.getHeight();
    render.xoffset = 0;
    render.yoffset = 0;
    this.draw();
    var data = canvas.toDataURL();
    render.width = canvas.width = ow;
    render.height = canvas.height = oh;
    render.xoffset = ox;
    render.yoffset = oy;
    this.draw();
    return data;
  };

  this.client2img = function(p) {
    return { x: p.x - render.xoffset, y: p.y - render.yoffset };
  };

  this.img2client = function(p) {
    return { x: p.x + render.xoffset, y: p.y + render.yoffset };
  };

  this.setCursor = function(name) {
    canvas.style.cursor = name;
  };

  this.snapPoint = function(p) {
    var ps = this.client2img(p);
    var ow = imgLayer.getWidth() - 1;
    var oh = imgLayer.getHeight() - 1;
    if ((ps.x >= 0 && ps.x < 10) || (ps.x < 0 && ps.x > -10)) ps.x = 0;
    if ((ps.y >= 0 && ps.y < 10) || (ps.y < 0 && ps.y > -10)) ps.y = 0;
    if ((ps.x <= ow && ps.x > ow - 10) || (ps.x > ow && ps.x < ow + 10))
      ps.x = ow;
    if ((ps.y <= oh && ps.y > oh - 10) || (ps.y > oh && ps.y < oh + 10))
      ps.y = oh;
    p = this.img2client(ps);
    return p;
  };
}
