import _ from 'lodash';
var BlockUniverse = require('./js/blockUniverse.js');

window.blockUniverse = new BlockUniverse(config);

window.blockSetup = function(trialObj, showStimulus, showBuilding, callback = () => {}, selectionMode = false) {

  window.blockUniverse.setupEnvs(trialObj, showStimulus, showBuilding, callback = callback, selectionMode = selectionMode);

};
