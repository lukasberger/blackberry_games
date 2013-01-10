
// canvas
var canvas, stage;

var WIDTH = 768;
var HEIGHT = 1280;


// GRAPHICS
//[Background]
 
//[Title View]   
var main; //The Main Background
var game; // The Game Background

// Preloader
var preloader;
var assets;
var totalLoaded = 0;

var LoadingView = new createjs.Container();
var TitleView = new createjs.Container();
var GameView = new createjs.Container();
var Spaces = new createjs.Container();
var Numbers = new createjs.Container();
var NumberPad = new createjs.Container();
var PlayAgainView = new createjs.Container();

var populatedSpaces = [];
var clickableSpaces = [];
var lastClickedSpace;
var generatedNumbers = [];
var clickableNumbers = [];
var clickableNs = [];
var savedNumbers = [];

var numberGrid; var solvedGrid = {};

var logo, sublogo, resumeButton, startEasy, startMedium, startHard,
pencilButton, saveButton, exitButton, goBackButton, help;

var score, time;

var gameBeingPlayed;

var loadingLogo, loadingText;
var playAgain, hitArea;
var gameTicker;
var startingTime;

function init () {
    // create canvas
    canvas = document.createElement('canvas');
    canvas.width = WIDTH;
    canvas.height = HEIGHT;
    canvas.id = "canvas";
    document.body.appendChild(canvas);
    // set stage
    stage = new createjs.Stage(canvas);


    // assets to load
    assets = [
                {src:"assets/background.jpg", id:"main"},
                {src:"assets/gameBackground.jpg", id:"game"},
            ];

    // set loading screen
    addLoadingView();

    // Ticker
    createjs.Ticker.addListener(window);
    createjs.Ticker.setFPS(30);

    //preload 
    preloader = new createjs.PreloadJS();
    preloader.onProgress = handleProgress;
    preloader.onComplete = handleComplete;
    preloader.onFileLoad = handleFileLoad;
    preloader.loadManifest(assets);
}


function handleProgress(event) {
    loadingText.text = "Loading... "+Math.ceil(event.loaded*100)+"%";
}

function handleComplete(event) {
    //triggered when all loading is complete
    totalLoaded++;
    if(assets.length==totalLoaded) addTitleView();
}

function handleFileLoad(event) {
    //triggered when an individual file completes loading
        
    switch(event.type) {
        case createjs.PreloadJS.IMAGE:
            //image loaded
            var img = new Image();
            img.src = event.src;
            img.onload = handleComplete;
            window[event.id] = new createjs.Bitmap(img);
            break;
        case createjs.PreloadJS.SOUND:
            //sound loaded
            handleComplete();
            break;
    }
}

function addLoadingView () {

    loadingText = new createjs.Text("Loading... 0%", 'normal 70px Alex', '#000');
    loadingText.x = WIDTH/2 - loadingText.getMeasuredWidth()/2;
    loadingText.y = 661;
    loadingText.name = "loadingText";

    LoadingView.addChild(loadingText);
    stage.addChild(LoadingView);
}

function addTitleView () {
    // add first screen
    //console.log("Add Title View");

    logo = new createjs.Text("Sudoku", 'normal 180px Alex', '#000');
    logo.x = WIDTH/2 - logo.getMeasuredWidth()/2;
    logo.y = 120;

    sublogo = new createjs.Text("classic", 'normal 70px Alex', '#000');
    sublogo.x = 470;
    sublogo.y = 263;

    startEasy = new createjs.Text("Easy", 'normal 70px Alex', '#000');
    startEasy.x = 184;
    startEasy.y = 625;
    startEasy.name = "startEasy";
    assignHitArea(startEasy);

    startMedium = new createjs.Text("Medium", 'normal 70px Alex', '#000');
    startMedium.x = 184;
    startMedium.y = 780;
    startMedium.name  = "startMedium";
    assignHitArea(startMedium);

    startHard = new createjs.Text("Hard", 'normal 70px Alex', '#000');
    startHard.x = 184;
    startHard.y = 935;
    startHard.name = "startHard";
    assignHitArea(startHard);

    exitButton = new createjs.Text("Exit", 'normal 70px Alex', '#000');
    exitButton.x = 184;
    exitButton.y = 1140;
    exitButton.name = "exitButton";
    assignHitArea(exitButton);

    TitleView.addChild(main, logo, sublogo, startEasy, startMedium, startHard, exitButton);
    stage.removeChild(LoadingView);
    stage.addChild(TitleView);

    if(localStorage.getItem("saved") === "true") {
        resumeButton = new createjs.Text("Resume saved game", 'normal 70px Alex', '#000');
        resumeButton.x = 184;
        resumeButton.y = 470;
        resumeButton.name = "resumeButton";
        assignHitArea(resumeButton);
        TitleView.addChild(resumeButton);

        resumeButton.onPress = pushGameResume;
    }


        TitleView.x = -WIDTH;
        createjs.Tween.get(TitleView).to({x:0}, 400).call(function() {
            stage.removeChild(GameView);
        });
    // event listeners
    startEasy.onPress = pushGameEasy;
    startMedium.onPress = pushGameMedium;
    startHard.onPress = pushGameHard;
    exitButton.onPress = exitGame;
        
}

function pushGameEasy () {
    //console.log("push game for easy");
    addGameView("easy");
    createjs.Tween.get(TitleView).to({x:-WIDTH}, 400);
}

function pushGameMedium () {
    //console.log("push game for medium");
    addGameView("medium");
    createjs.Tween.get(TitleView).to({x:-WIDTH}, 400);
}

function pushGameHard () {
    //console.log("push game for hard");
    addGameView("hard");
    createjs.Tween.get(TitleView).to({x:-WIDTH}, 400);
}

function pushGameResume () {
    //console.log("Resume previous game state");
    addGameView("resume");
    createjs.Tween.get(TitleView).to({x:-WIDTH}, 400);      
}

function pushPlayAgain () {
    //console.log("push play again?");
    addPlayAgainView();
}

function exitGame () {
    //console.log("exits the game");
    //createjs.Tween.get(TitleView).to({x:-WIDTH}).call(addGameView);
    blackberry.app.exit();
}

function pushTitleView () {
    //console.log("back to title!");
    addTitleView(true);
    createjs.Tween.get(GameView).to({x:WIDTH}, 400);
    createjs.Tween.get(PlayAgainView).to({x:WIDTH}, 400);


}

function addGameView (type) {
    //console.log("Add game");

    var resuming = false;
    gameBeingPlayed = type;

    if(type === "resume") {
        resuming = true; // indicate that we are resuming
        loadGameState();
        startingTime += createjs.Ticker.getTime();
    }else {
        localStorage.setItem("saved", false);
        startingTime = createjs.Ticker.getTime();
    }

    lastClickedSpace = null;

    time = new createjs.Text("Time 00:00:00", 'normal 40px Alex', '#000');
    time.x = 80;
    time.y = 50;

    pencilButton = new createjs.Text("Pencil", 'normal 70px Alex', '#000');
    pencilButton.x = 500;
    pencilButton.y = 850;

    help = new createjs.Text("You can select more than one number and remove unwanted numbers by pressing them again.", "normal 35px Alex");
    help.x = 430;
    help.y = 950;
    help.lineWidth = 310;

    saveButton = new createjs.Text("Save game", 'normal 70px Alex', '#000');
    saveButton.y = 840;
    assignHitArea(saveButton);
    saveButton.x = 450;

    goBackButton = new createjs.Text("Go back to menu", 'normal 70px Alex', '#000');
    goBackButton.x = WIDTH/2 - goBackButton.getMeasuredWidth()/2;
    goBackButton.y = 1180;
    assignHitArea(goBackButton);

    addNumberPad();

    GameView.x = WIDTH;
    GameView.removeAllChildren();
    GameView.addChild(game, time, help, saveButton, goBackButton, Spaces, NumberPad);
    
    stage.addChild(GameView);
    createjs.Tween.get(GameView).to({x:0}, 400).call(function() {
        stage.removeChild(TitleView);
    });

    if(!resuming) {
        numberGrid = CU.Sudoku.generate();
        solvedGrid = numberGrid.toArray();

        if(type === "easy") CU.Sudoku.cull(numberGrid, 40);
        else if (type === "medium") CU.Sudoku.cull(numberGrid, 53);
        else CU.Sudoku.cull(numberGrid, 65);

    }

    populateSpaces(!resuming);
    addGeneratedNumbers();

    gameTicker = {};
    createjs.Ticker.addListener(gameTicker, false);
    gameTicker.tick = updateTime;

    // event listeners
    pencilButton.onPress = function() { pencil = true; };
    saveButton.onPress = saveGameState;
    goBackButton.onPress = pushTitleView;
    addSpacesListeners();
}

function removeAllListeners () {
    createjs.Ticker.removeListener(gameTicker);
    var donothing = function() {};
    // number pad
    for (var i = Spaces.children.length - 1; i >= 0; i--) {
        Spaces.children[i].onPress = donothing;
    }
    for (i = 0; i < 3; i++) {
        for (var a = 0; a < 3; a++) {
            clickableNumbers[i][a].onPress = donothing;
        }
    }
}


function refreshGameView (type) {
    populateSpaces();

    localStorage.setItem("saved", false);
    
    lastClickedSpace = null;

    startingTime = createjs.Ticker.getTime();

    time = new createjs.Text("Time 00:00:00", 'normal 40px Alex', '#000');
    time.x = 80;
    time.y = 50;

    help = new createjs.Text("You can select more than one number and remove unwanted numbers by pressing them again.", "normal 35px Alex");
    help.x = 430;
    help.y = 950;
    help.lineWidth = 310;

    saveButton = new createjs.Text("Save game", 'normal 70px Alex', '#000');
    saveButton.y = 840;
    assignHitArea(saveButton);
    saveButton.x = 450;

    goBackButton = new createjs.Text("Go back to menu", 'normal 70px Alex', '#000');
    goBackButton.x = WIDTH/2 - goBackButton.getMeasuredWidth()/2;
    goBackButton.y = 1180;
    assignHitArea(goBackButton);

    addNumberPad();

    GameView.x = 0;
    GameView.removeAllChildren();
    GameView.addChild(game, time, help, saveButton, goBackButton, Spaces, NumberPad);
    
    stage.addChild(GameView);
    stage.removeChild(PlayAgainView);

        numberGrid = CU.Sudoku.generate();
        solvedGrid = numberGrid.toArray();

        if(type === "easy") CU.Sudoku.cull(numberGrid, 40);
        else if (type === "medium") CU.Sudoku.cull(numberGrid, 53);
        else CU.Sudoku.cull(numberGrid, 65);


    populateSpaces(false);
    addGeneratedNumbers();

    gameTicker = {};
    createjs.Ticker.addListener(gameTicker, false);
    gameTicker.tick = updateTime;

    // event listeners
    saveButton.onPress = saveGameState;
    goBackButton.onPress = pushTitleView;
    addSpacesListeners();

}

function addGeneratedNumbers () {

    for (var i = 0; i < 9; i++) {
        generatedNumbers[i] = [];
        clickableSpaces[i] = [];
        for (var a = 0; a < 9; a++) {
            if( populatedSpaces[i][a] !== 0 ) {
                generatedNumbers[i][a] = new createjs.Text(populatedSpaces[i][a], "bold 40px Verdana", "#000");
                generatedNumbers[i][a].x = 95 + 72 * a + Math.floor(a/3) * 2;
                generatedNumbers[i][a].y = 135 + 72 * i + Math.floor(i/3) * 2;
                Numbers.addChild(generatedNumbers[i][a]);
            } else {
                generatedNumbers[i][a] = new createjs.Text("", "normal 40px Verdana", "#000");
                generatedNumbers[i][a].x = 73 + 72 * a + Math.floor(a/3) * 2;
                generatedNumbers[i][a].y = 123 + 72 * i + Math.floor(i/3) * 2;
                Numbers.addChild(generatedNumbers[i][a]);

                clickableSpaces[i][a] = new createjs.Shape();
                clickableSpaces[i][a].graphics.beginFill("#fff").drawRect(0, 0, 70, 70);

                clickableSpaces[i][a].x = 73 + 72 * a + Math.floor(a/3) * 2;
                clickableSpaces[i][a].y = 123 + 72 * i + Math.floor(i/3) * 2;

                Spaces.addChild(clickableSpaces[i][a]);

                clickableSpaces[i][a].name = [i,a];

                redrawNumber([i,a]);

            }
        }
    }

    Numbers.alpha = 0;
    GameView.addChild(Numbers);
    createjs.Tween.get(Numbers).to({alpha:1}, 400);

}

function assignHitArea (obj) {
    var hit = new createjs.Shape();
    hit.graphics.beginFill("#000").drawRect(0, 0, obj.getMeasuredWidth()*1.1, obj.getMeasuredHeight()*1.1);
    obj.hitArea = hit;
    obj.x = WIDTH/2 - obj.getMeasuredWidth()/2;
}

function addPlayAgainView (type) {
    //console.log("Want to play again?");
    
    /*winningMessage = new createjs.Text((playerPlaying ? gamePlayer2.text : gamePlayer1.text)+" won, congratulations!", "normal 70px Alex", "#000");
    winningMessage.x = 184;
    winningMessage.y = 500;*/
    var whiteBg = new createjs.Shape();
    whiteBg.graphics.beginFill("#fff").drawRect(50, 800, 700, 350);

    var youWon = new createjs.Text("Congratulations, you won!", "normal 70px Alex", "#000");
    youWon.x = WIDTH/2 - youWon.getMeasuredWidth()/2;
    youWon.y = 840;
    youWon.name = "youWon";

    playAgain = new createjs.Text("Play again", "normal 70px Alex", "#000");
    playAgain.x = WIDTH/2 - playAgain.getMeasuredWidth()/2;
    playAgain.y = 960;
    playAgain.name = "playAgain";

    assignHitArea(playAgain);

    PlayAgainView.alpha = 0;
    PlayAgainView.x = 0;
    PlayAgainView.y = 0;
    PlayAgainView.addChild(whiteBg, youWon, playAgain);
    
    stage.addChild(PlayAgainView);
    createjs.Tween.get(PlayAgainView).to({alpha:1}, 400);

    createjs.Ticker.removeListener(gameTicker);

    localStorage.setItem('saved', false);

    // event listeners
    playAgain.onPress = function () { refreshGameView(gameBeingPlayed); };
}

function tick () {
    stage.update();
}

function updateTime () {
    var date = secondsToTime((createjs.Ticker.getTime()-startingTime)/1000);

    time.text = "Time: "+date.h+":"+date.m+":"+date.s;
}

function secondsToTime(secs)
{
    var hours = Math.floor(secs / (60 * 60));
   
    var divisor_for_minutes = secs % (60 * 60);
    var minutes = Math.floor(divisor_for_minutes / 60);
 
    var divisor_for_seconds = divisor_for_minutes % 60;
    var seconds = Math.floor(divisor_for_seconds);

    seconds = (seconds < 10 ? "0"+seconds : seconds);
    minutes = (minutes < 10 ? "0"+minutes : minutes);
    hours = (hours < 10 ? "0"+hours : hours);

    var obj = {
        "h": hours,
        "m": minutes,
        "s": seconds
    };
    return obj;
}

function populateSpaces (notresuming) {
    Spaces.removeAllChildren();
    Numbers.removeAllChildren();

    populatedSpaces = [];

    for (var i = 0; i < 9; i++) {
        populatedSpaces[i] = [];
        if(notresuming) savedNumbers[i] = [];
        for (var a = 0; a < 9; a++) {
            populatedSpaces[i][a] = numberGrid.rows[i][a];
            if(notresuming) savedNumbers[i][a] = [];
        }
    }
}

function addSpacesListeners () {
    funcs = [];

    for (var i = Spaces.children.length - 1; i >= 0; i--) {
        Spaces.children[i].onPress = function () { trySpace(this.name); };
    }
}

function trySpace (i) {
    //console.log("check if space "+i+" is populated");
    clearNumbers();
    loadNumbersFor(i);
    var cs = clickableSpaces[i[0]][i[1]];
    var ls = lastClickedSpace;

    if (lastClickedSpace !== null) clickableSpaces[ls[0]][ls[1]].graphics
        .clear().beginFill("#fff").drawRect(0, 0, 70, 70);
    cs.graphics.clear().beginFill("#caeaf5").drawRect(0, 0, 70, 70);
    lastClickedSpace = i;

}

function selectNumber (i) {
    //console.log("add number "+i);

    var cs = clickableNumbers[i[0]][i[1]];
    var cn = clickableNs[i[0]][i[1]];
    var ls = lastClickedSpace;
    if(ls !== null) {
        var sn = savedNumbers[ls[0]][ls[1]];
        var gn = generatedNumbers[ls[0]][ls[1]];

        if(sn.indexOf(cn.text) < 0) {
            sn.push(cn.text);
            cs.graphics.clear().beginFill("#caeaf5").drawRect(0, 0, 100, 100);
        }
        else {
            sn.splice(sn.indexOf(cn.text), 1);
            cs.graphics.clear().beginFill("#fff").drawRect(0, 0, 100, 100);
        }

        
        if (sn.length > 1) {
            gn.font = "normal 20px Verdana";
            gn.text = sn.join(" ");
            gn.lineWidth = 70;
            gn.x = 80 + 72 * ls[1] + Math.floor(ls[1]/3) * 2;
            gn.y = 126 + 72 * ls[0] + Math.floor(ls[0]/3) * 2;
        }else {
            gn.font = "normal 40px Verdana";
            gn.text = sn[0];
            gn.x = 95 + 72 * ls[1] + Math.floor(ls[1]/3) * 2;
            gn.y = 135 + 72 * ls[0] + Math.floor(ls[0]/3) * 2;
        }

        if( checkGameState() ) {
            removeAllListeners();
            addPlayAgainView();
        }

    }

}

function redrawNumber (i) {
    //console.log("redraw number "+i);

    var ls = i;
    var sn = savedNumbers[ls[0]][ls[1]];
    var gn = generatedNumbers[ls[0]][ls[1]];
    
    if (sn.length > 1) {
        gn.font = "normal 20px Verdana";
        gn.text = sn.join(" ");
        gn.lineWidth = 70;
        gn.x = 80 + 72 * ls[1] + Math.floor(ls[1]/3) * 2;
        gn.y = 126 + 72 * ls[0] + Math.floor(ls[0]/3) * 2;
    }else {
        gn.font = "normal 40px Verdana";
        gn.text = sn[0];
        gn.x = 95 + 72 * ls[1] + Math.floor(ls[1]/3) * 2;
        gn.y = 135 + 72 * ls[0] + Math.floor(ls[0]/3) * 2;
    }
}

function clearNumbers () {
    for (var i = 0; i < 3; i++) {
        for (var a = 0; a < 3; a++) {
            clickableNumbers[i][a].graphics.clear().beginFill("#fff").drawRect(0, 0, 100, 100);
        }
    }
}

function loadNumbersFor (i) {

    var sn = savedNumbers[i[0]][i[1]];

    for (var a = 0; a < 3; a++) {
        for (var b = 0; b < 3; b++) {
            if(sn.indexOf(clickableNs[a][b].text) >= 0) clickableNumbers[a][b].graphics.clear().beginFill("#caeaf5").drawRect(0, 0, 100, 100);
        }
    }


}

function addNumberPad () {
    var padbg = new createjs.Shape();
    padbg.graphics.beginFill("#000").drawRect(0, 0, 312, 312);
    NumberPad.addChild(padbg);

    var counter = 1;

    for (var i = 0; i < 3; i++) {
        clickableNumbers[i] = [];
        clickableNs[i] = [];

        for (var a = 0; a < 3; a++) {
            clickableNumbers[i][a] = new createjs.Shape();
            clickableNumbers[i][a].graphics.beginFill("#fff").drawRect(0, 0, 100, 100);
            clickableNumbers[i][a].x = 4+102*a;
            clickableNumbers[i][a].y = 4+102*i;

            clickableNs[i][a] = new createjs.Text(counter, "normal 60px Verdana", "#000");
            clickableNs[i][a].x = 35+102*a;
            clickableNs[i][a].y = 20+102*i;

            NumberPad.addChild(clickableNumbers[i][a]);
            NumberPad.addChild(clickableNs[i][a]);

            clickableNumbers[i][a].name = [i, a];
            clickableNumbers[i][a].onPress = function() { selectNumber(this.name); };

            counter += 1;
        }
    }


    NumberPad.x = 70;
    NumberPad.y = 830;

}

function saveGameState () {
    // saves the current game state in local storage
    var time = createjs.Ticker.getTime() - startingTime; // time elapsed since the beginning
    var numbers = numberGrid.toArray(); // the array of generated numbers
    var solved = solvedGrid;  // array containing the solved grid
    var tried = JSON.stringify(savedNumbers); // array containing the numbers the player played

    localStorage.setItem("saved", true); // indicates that the user has a saved game
    localStorage.setItem("time", time); // time in ms
    localStorage.setItem("numbers", numbers);
    localStorage.setItem("solved", solved);
    localStorage.setItem("tried", tried);

    pushMessage("Game saved");
}

function loadGameState () {
    // loads a game state from local storage
    startingTime = -localStorage.getItem("time"); // subtracts time elapsed from the starting time
    numberGrid = CU.Sudoku.generate(); CU.Sudoku.cull(numberGrid, 81);
    numberGrid.fromArray(localStorage.getItem("numbers").split(",")); // reloads the generated grid with empty spaces
    solvedGrid = localStorage.getItem("solved").split(",");  // array containing the solved grid
    savedNumbers = JSON.parse(localStorage.getItem("tried")); // array containing the numbers the player played
    
}

function pushMessage (text) {

    var message = new createjs.Text(text, "normal 60px Alex");
    message.x = WIDTH + 100;
    message.y = 30;
    message.name = "message";

    GameView.addChild(message);

    createjs.Tween.get(message).to({x:500}, 500).call(function() {
        createjs.Tween.get(message).wait(2000).to({x:WIDTH+100}, 500).call(function() {
            GameView.removeChild(message);
        });
    });


}

function gridFromArray (cells) {

        if(cells.length != 81)
            throw new Error('Array length is not 81');
            
        for(var i = 0; i < 81; i++)
        {
            var row = Math.floor(i / 9);
            var col = i - (row * 9);
            
            this.rows[row][col] = cells[i];
        }
        
        return this;
}

function checkGameState () {

    var correctRows = 0;
    var correctColumns = 0;
    var sum;

    // check if all rows add up to 45
    for (var i = populatedSpaces.length - 1; i >= 0; i--) {
        // check one row
        sum = 0;
        for (var a = populatedSpaces[i].length - 1; a >= 0; a--) {
            // if the pregenerated cell is empty and user doesn't have more numbers saved in the cell
            if ( populatedSpaces[i][a] === 0 && savedNumbers[i][a].length === 1)
                sum += parseInt( savedNumbers[i][a][0], 10 );
            else
                sum += parseInt( populatedSpaces[i][a], 10 );
        }
        if ( sum == 45 ) correctRows += 1;
    }

    // check if all columns add up to 45
    for (i = populatedSpaces.length - 1; i >= 0; i--) {
        // check one row
        sum = 0;
        for (var a = populatedSpaces[i].length - 1; a >= 0; a--) {
            // if the pregenerated cell is empty and user doesn't have more numbers saved in the cell
            if ( populatedSpaces[a][i] == 0 && savedNumbers[a][i].length === 1)
                sum += parseInt( savedNumbers[a][i][0], 10 );
            else
                sum += parseInt( populatedSpaces[a][i], 10 );
        }
        if ( sum === 45 ) correctColumns += 1;
    }

    return ( correctColumns == 9 && correctRows == 9 );

}

function updateScore () {


}