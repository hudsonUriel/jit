/*
 * Class: Layouts.Icicle
 *
 * Implements the icicle tree layout.
 *
 * Implemented By:
 *
 * <Icicle>
 *
 */

Layouts.Icicle = new Class({
 /*
  * Method: compute
  *
  * Called by loadJSON to calculate all node positions.
  *
  * Parameters:
  *
  * posType - The nodes' position to compute. Either "start", "end" or
  *            "current". Defaults to "current".
  */
  compute: function(posType) {
    posType = posType || "current";

    var root = this.graph.getNode(this.root),
        config = this.config,
        size = this.canvas.getSize(),
        width = size.width,
        height = size.height,
        offset = config.offset;

    this.controller.onBeforeCompute(root);

    Graph.Util.computeLevels(this.graph, root.id, 0, "ignore");

    var treeDepth = 0;

    Graph.Util.eachLevel(root, 0, false, function (n, d) { if(d > treeDepth) treeDepth = d; });

    var start_node = this.graph.getNode(this.clickedNode && this.clickedNode.id || root.id);
    if(this.layout.horizontal()) {
      this.computeSubtree(start_node, -width/2, -height/2, width / (treeDepth+1), height, posType);
    } else {
      this.computeSubtree(start_node, -width/2, -height/2, width, height/ (treeDepth+1), posType);
    }
  },

  computeSubtree: function (root, x, y, width, height, posType) {
    root.getPos(posType).setc(x, y);
    root.setData('width', width);
    root.setData('height', height);

    var nodeLength, prevNodeLength = 0, totalDim = 0;
    var children = Graph.Util.getSubnodes(root, [1, 1]); // next level from this node

    if(!children.length)
      return;

    $.each(children, function(e) { totalDim += e.getData('dim'); });

    for(var i=0, l=children.length; i < l; i++) {
      if(this.layout.horizontal()) {
        nodeLength = height * children[i].getData('dim') / totalDim;
        this.computeSubtree(children[i], x+width, y, width, nodeLength, posType);
        y += nodeLength;
      } else {
        nodeLength = width * children[i].getData('dim') / totalDim;
        this.computeSubtree(children[i], x, y+height, nodeLength, height, posType);
        x += nodeLength;
      }
    }
  }
});

