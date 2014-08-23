$(function() {
  var canvas = $('#canvas').get(0);
  canvas.width = $(window).width();
  canvas.height = $(window).height();

  var c = new Canvas(canvas);

  $(canvas).mousedown(c.onMouseDown);
  $(canvas).mouseup(c.onMouseUp);
  $(canvas).mousemove(c.onMouseMove);

  c.setBgLayer(new BgLayer(c.getRender()));
  c.setImgLayer(new ImgLayer(c.getRender(), 'image/demo.jpg'));
  c.setLabelLayer(new LabelLayer(c.getRender()));

  c.setTool('drawRect', new ToolDrawRect(c));
  c.setTool('pan', new ToolPan(c));
  c.setTool('ruler', new ToolRuler(c));

  $(window).keydown(function(e) {
    switch(e.keyCode) {
      case 49: c.setCurTool('drawRect');
               break;
      case 50: c.setCurTool('pan');
               break;
      case 51: c.setCurTool('ruler');
               break;
      case 52: saveImg(c);
      default: break;
    }
  });

  c.draw();
});

function saveImg(src) {
  var url = src.toDataURL();
  var a = $("<a href='"+url+"' target='_blank'>Save</a>").get(0);
  var e = document.createEvent('MouseEvents');
  e.initEvent('click', true, true);
  a.dispatchEvent(e);
  console.log(url);
};
