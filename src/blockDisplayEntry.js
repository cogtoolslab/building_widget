import _ from 'lodash';
var BlockUniverse = require('./js/blockUniverse.js');

window.blockUniverse = new BlockUniverse(config);

window.blockSetup = function(trialObj, showStimulus, showBuilding, selectionMode = false) {

  window.blockUniverse.setupEnvs(trialObj, showStimulus, showBuilding, selectionMode = selectionMode);

};
