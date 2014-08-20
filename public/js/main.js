$(function() {
  var c = new Canvas('canvas');
  c.setBgLayer(new BgLayer(c.getRender()));
  c.setImgLayer(new ImgLayer(c.getRender(), 'image/demo.jpg'));
  c.setLabelLayer(new LabelLayer(c.getRender()));
  c.setTool('drawRect', new ToolDrawRect(c));
  c.setTool('pan', new ToolPan(c));
  $(window).keydown(function(e) {
    //console.log(e);
    switch(e.keyCode) {
      case 49: c.setCurTool('drawRect');
               break;
      case 50: c.setCurTool('pan');
               break;
      default: break;
    }
  });
  c.draw();
});
