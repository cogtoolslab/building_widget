window.onload = function() {

    let trial = {
        stimulus : [
            { "x": 0, "y": 0, "width": 2, "height": 1 },
            { "x": 0, "y": 1, "width": 1, "height": 2 },
            { "x": 0, "y": 3, "width": 1, "height": 2 },
            { "x": 0, "y": 5, "width": 2, "height": 1 }],
        // endCondition: 'perfect-reconstruction-translation',
        offset: 5,
    };

    var showStimulus = false;
    var showBuilding = true;

    window.blockSetup(trial, showStimulus, showBuilding, selectionMode = true);

    let bu = window.blockUniverse;



};