// var config = require('./display_config.js');
var Block = require('./block.js');
class BlockKind {

  constructor(w, h, blockColor, blockName = '', internalStrokeColor) {
    // BlockKinds are a type of block- of which several might be placed
    // in the environment. To be concretely instantiated, a Block must
    // be created that inherets its properties from a BlockKind
    // BlockKind also holds the information for displaying the menu item
    // associated with that blockKind.  BlockKind width and height
    // should be given in small integers. They are scaled in the block
    // class.
    this.x = undefined;
    this.y = undefined;
    this.w = w;
    this.h = h;
    this.blockColor = blockColor;
    this.blockName = blockName;
    this.internalStrokeColor = internalStrokeColor;
  }

  // show block scaled according to given ratio, in a given location
  showMenuItem(env, x, y, disabled) {
    this.x = x;
    this.y = y;
    env.push();
    env.rectMode(env.CENTER);
    //env.fill(this.blockColor);
    if (disabled){
      env.fill(config.disabledColor);
    }
    else {
      env.fill(this.blockColor);
    }

    //move to correct location
    env.translate(x, y);

    // draw fill
    env.noStroke();
    env.rect(0, 0, this.w * config.sF, this.h * config.sF);
    
    // draw internal squares
    if (config.chocolateBlocks) {
      this.drawChocolateBlocks(env);
    }

    // draw outer rectangle
    env.noFill();
    env.stroke(config.strokeColor);
    env.strokeWeight(3);
    env.rect(0, 0, this.w * config.sF, this.h * config.sF);

    env.pop();
  }

  drawChocolateBlocks(env) {

    env.strokeWeight(3);
    env.stroke(this.internalStrokeColor);

    // draws unit squares on each block
    var nRow = this.w;
    var nCol = this.h;
    var i = -nRow / 2 + 0.5;
    while (i < nRow / 2) {
      var j = -nCol / 2 + 0.5;
      while (j < nCol / 2) { // draw one square
        env.translate(config.sF * i, config.sF * j);
        env.rect(0, 0, config.sF, config.sF);
        env.translate(-config.sF * i, -config.sF * j);
        j++;
      }
      i++;
    }
  }

  showGhost(env, mouseX, mouseY, rotated, discreteWorld,
    disabledBlockPlacement = false, snapToGrid = true) {
    if ((mouseX > (config.sF * (this.w / 2))) &&
      (mouseX < config.canvasWidth - (config.sF * (this.w / 2)))) {

      if (snapToGrid) {
        var stim_scale = config.stim_scale;
        var snappedX;
        var x_index;
        
        var [mouseX, mouseY, x_index, y_index] = this.snapToGrid(mouseX, mouseY, discreteWorld);
      }

      env.push();
      env.translate(mouseX, mouseY);
      env.rectMode(env.CENTER);
      env.stroke(config.ghostStroke);
      //env.stroke([28,54,62,100]);
      env.strokeWeight(3);
      var ghostColor = [this.blockColor[0], this.blockColor[1], this.blockColor[2], 50]
      env.fill(ghostColor);
      if (rotated) {
        env.rect(0, 0, this.h * config.sF, this.w * config.sF);
      } else {
        env.rect(0, 0, this.w * config.sF, this.h * config.sF);
      }
      if (config.chocolateBlocks) {
        //this.drawChocolateBlocks(env);
      }
      env.pop();
    }
  }

  createSnappedBlock(preciseMouseX, preciseMouseY, discreteWorld, testing_placement) {

    var [snappedX, snappedY, x_index, y_index] = this.snapToGrid(preciseMouseX, preciseMouseY, discreteWorld)
    // index is the location in discrete world (i.e. the whole grid)
    return new Block(this, snappedX, snappedY, false,
      testing_placement = testing_placement, x_index = x_index, y_index = y_index);
  }


  snapToGrid(mouseX, mouseY, discreteWorld, snapY=true) {

    // snaps X location of dropped block to grid
    var snappedX;
    var x_index;
    var y_index;
    var stim_scale = config.stim_scale;

    x_index = x_index

    if (this.w % 2 == 1) {
      snappedX = (mouseX + stim_scale / 2) % (stim_scale) < (stim_scale / 2) ? 
                              mouseX - (mouseX % (stim_scale / 2)) : 
                              mouseX - (mouseX % (stim_scale)) + (stim_scale / 2);

      x_index = (snappedX / stim_scale) - (snappedX % stim_scale) + stim_scale/2 - 0.5;
    } else {
      snappedX = mouseX % (stim_scale) < (stim_scale / 2) ?
                              mouseX - mouseX % (stim_scale) : 
                              mouseX - mouseX % (stim_scale) + stim_scale;
      x_index = ((snappedX / stim_scale) - (snappedX % stim_scale) - this.w / 2);
    };

    if (!snapY) {
      return [snappedX, snappedY, x_index, y_index];

    } else {
      // check rows from mouse y, down
      var y = Math.round(config.top - (this.h / 2) -
                         ((mouseY + (config.stim_scale / 2)) / config.stim_scale)) + 1;
      let rowFree = true;

      for (let x = x_index; x < (x_index + this.w); x++) { // check if row directly beneath block are all free at height y
        rowFree = rowFree && discreteWorld[x][y];
      }

      if (!rowFree){ // if can't place directly here, try from top
        y = config.discreteEnvHeight;
        rowFree = true;
      }
      
      while (rowFree && y>=0) { // move down until row free
        y -= 1;
        var blockEnd = x_index + this.w;
        for (let x = x_index; x < blockEnd; x++) { // check if row directly beneath block are all free at height y
          // console.log('dw_w:',discreteWorld.length,
          //              'dw_h:',discreteWorld[0].length,
          //              'x:', x,
          //              'y:', y);
          rowFree = y==-1 ? false : rowFree && discreteWorld[x][y];
        }

      }
      y_index = y + 1;

      // ADD SNAP TO Y
      var snappedY = ((config.envCanvasHeight - config.floorHeight) - (stim_scale * (this.h / 2))
        - (stim_scale * (y_index)));

      return [snappedX, snappedY, x_index, y_index];
    };

  };
};


module.exports = BlockKind;
