class UndoRedoManager {
  constructor() {
    // undo stack is implicitly stored in window.blockUniverse
    this.redostack = [];
    
    this.events = {
      "redo": [],
      "undo": []
    };
  }

  redo() {
    if (this.redostack.length > 0) {
      const block = this.redostack.pop();
      window.blockUniverse.blocks.push(block);
      var blockTop = block.y_index + block.blockKind.h;
      var blockRight = block.x_index + block.blockKind.w;
      for (let y = block.y_index; y < blockTop; y++) {
        for (let x = block.x_index; x < blockRight; x++) {
          window.blockUniverse.discreteWorld[x][y] = false;
        }
      }
      this.events["redo"].forEach(f => f(this.getBlockData(block)));
    }
  }

  undo() {
    console.log('undo in undo');
    if (window.blockUniverse.blocks.length == 0) return;
    const block = window.blockUniverse.blocks.pop();
    var blockTop = block.y_index + block.blockKind.h;
    var blockRight = block.x_index + block.blockKind.w;
    for (let y = block.y_index; y < blockTop; y++) {
      for (let x = block.x_index; x < blockRight; x++) {
        window.blockUniverse.discreteWorld[x][y] = true;
      }
    }
    this.redostack.push(block);
    this.events["undo"].forEach(f => f(this.getBlockData(block)));
  }

  getBlockData(block) {
    return _.extend({},
      window.blockUniverse.getCommonData(),
      {
        block: block.getDiscreteBlock()
      });
  }

  addEventListener(name, handler) {
    this.events[name].push(handler);
  }

  removeEventListener(name, handler) {
    if (!this.events.hasOwnProperty(name)) return;
    const index = this.events[name].indexOf(handler);
    if (index != -1) {
      this.events[name].splice(index, 1)
    }
  }
};