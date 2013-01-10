// canvas
var canvas, stage;

var WIDTH = screen.width;
var HEIGHT = screen.height;

var ld = (WIDTH > 720 ? 24 : 0); //large display constant

 
//[Title View]   
var main; //The Main Background
var game; // The Game Background

// Ticker
var gameTicker = {};

// Preloader
var preloader;
var assets;
var totalLoaded = 0;

var LoadingView = new createjs.Container();
var TitleView = new createjs.Container();
var GameView = new createjs.Container();
var Spaces = new createjs.Container();
var PlayAgainView = new createjs.Container();

var locationsSpaces = [ [95,385], [310,385], [515,385],
                        [95,590], [310,590], [515,590],
                        [95,790], [310,790], [515,790] ];

var s0, s1, s2, s3, s4, s5, s6, s7, s8;
var imageBackup = [];

var circle, cross;
var populatedSpaces = [ 0, 0, 0,
                        0, 0, 0,
                        0, 0, 0 ];

var winningCombinations = [ [0,1,2],[3,4,5],[6,7,8],
                            [0,3,6],[1,4,7],[2,5,8],
                            [0,4,8],[6,4,2] ];


var counter0;
var counter0_0, counter0_1, counter0_2;
var counter1_0, counter1_1, counter0_2;

var logo, sublogo, startOne, startTwo, exitButton;
var gameOnePlayer1, gameOnePlayer2, gameTwoPlayer1, gameTwoPlayer1, goBackButton;
var playing;

var playerPlaying, cpuPlaying, whoStarted;
var playerScore1, playerScore2;

var gameBeingPlayed;

var loadingLogo, loadingText;
var playAgain, hitArea;

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
                {src:"assets/0.jpg", id:"s0"}, {src:"assets/1.jpg", id:"s1"},
                {src:"assets/2.jpg", id:"s2"}, {src:"assets/3.jpg", id:"s3"},
                {src:"assets/4.jpg", id:"s4"}, {src:"assets/5.jpg", id:"s5"},
                {src:"assets/6.jpg", id:"s6"}, {src:"assets/7.jpg", id:"s7"},
                {src:"assets/8.jpg", id:"s8"},
                {src:"assets/circle.png", id:"circle"},
                {src:"assets/cross.png", id:"cross"},
                {src:"assets/lineVertical.png", id:"lineVertical"},
                {src:"assets/lineHorizontal.png", id:"lineHorizontal"},
                {src:"assets/lineUpwards.png", id:"lineUpwards"},
                {src:"assets/lineDownwards.png", id:"lineDownwards"},
                {src:"assets/counter0.png", id:"counter0"},
                {src:"assets/counter1.png", id:"counter1"},
                {src:"assets/counter2.png", id:"counter2"},
                {src:"assets/counter3.png", id:"counter3"},
                {src:"assets/counter4.png", id:"counter4"},
                {src:"assets/counter5.png", id:"counter5"},
                {src:"assets/playing.png", id:"playing"}
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
    if(assets.length==totalLoaded) {
        addTitleView();
        var i = 0;

        for (i = 0; i < 9; i++) imageBackup[i] = window["s"+i].image;
        
        for (i = 0; i < 2; i++) {
            for (var a = 0; a < 3; a++) {
                window["counter"+i+"_"+a] = new createjs.Bitmap(counter0);
            }
        }
    }
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

    loadingText = new createjs.Text("Loading... 0%", 'normal 70px Mywriting', '#000');
    loadingText.x = WIDTH/2 - loadingText.getMeasuredWidth()/2;
    loadingText.y = 661;
    loadingText.name = "loadingText";

    LoadingView.addChild(loadingText);
    stage.addChild(LoadingView);
}

function addTitleView () {
    // add first screen
    main.x = -48+ 2*ld;

    logo = new createjs.Text("Tic-tac-toe", 'normal 140px Mywriting', '#000');
    logo.x = WIDTH/2 - logo.getMeasuredWidth()/2;
    logo.y = 135;

    sublogo = new createjs.Text("classic", 'normal 60px Mywriting', '#000');
    sublogo.x = 520;
    sublogo.y = 265;

    startOne = new createjs.Text("One player", 'normal 70px Mywriting', '#000');
    startOne.x = 184;
    startOne.y = 661;
    startOne.name = "startOne";
    assignHitArea(startOne);

    startTwo = new createjs.Text("Two players", 'normal 70px Mywriting', '#000');
    startTwo.x = 184;
    startTwo.y = 806;
    startTwo.name  = "startTwo";
    assignHitArea(startTwo);

    exitButton = new createjs.Text("Exit", 'normal 70px Mywriting', '#000');
    exitButton.x = 184;
    exitButton.y = 1015;
    exitButton.name = "exitButton";
    assignHitArea(exitButton);

    TitleView.addChild(main, logo, sublogo, startOne, startTwo, exitButton);
    stage.removeChild(LoadingView);
    stage.addChild(TitleView);

    TitleView.x = -WIDTH;
    createjs.Tween.get(TitleView).to({x:0}, 400).call(function() {
        stage.removeChild(GameView);
    });
    
    // event listeners
    startOne.onPress = pushGameOne;
    startTwo.onPress = pushGameTwo;
    exitButton.onPress = exitGame;
        
}

function pushGameOne () {
    //console.log("push game for one player");
    gameBeingPlayed = 0;
    addGameView(true, "Player", "Opponent");
    createjs.Tween.get(TitleView).to({x:-WIDTH}, 400);
}

function pushGameTwo () {
    //console.log("push game for two players");
    gameBeingPlayed = 1;
    addGameView(false, "Player 1", "Player 2");
    createjs.Tween.get(TitleView).to({x:-WIDTH}, 400)
}

function pushPlayAgain () {
    //console.log("push play again?");
    addPlayAgainView();
}

function exitGame () {
    //console.log("exits the game");
    blackberry.app.exit();
}

function pushTitleView () {
    //console.log("back to title!");
    addTitleView(true);
    createjs.Tween.get(GameView).to({x:WIDTH}, 400)
    createjs.Tween.get(PlayAgainView).to({x:WIDTH}, 400)

}

function addGameView (forOne, player1, player2) {
    //console.log("Add game");

    game.x = -48 + 2*ld;

    playerPlaying = 0;
    cpuPlaying = 0;
    whoStarted = 0;
    playerScore1 = 0;
    playerScore2 = 0;
    populateSpaces();

    playing.x = 45;
    playing.y = 35;

    gamePlayer1 = new createjs.Text(player1, 'normal 60px Mywriting', '#ff0000');
    gamePlayer1.x = (forOne ? 130 : 110);
    gamePlayer1.y = 60;
    
    gamePlayer2 = new createjs.Text(player2, 'normal 60px Mywriting', '#0000ff');
    gamePlayer2.x = (forOne ? 430 : 440);
    gamePlayer2.y = 60;

    goBackButton = new createjs.Text("Go back to menu", 'normal 70px Mywriting', '#000');
    goBackButton.x = WIDTH/2 - goBackButton.getMeasuredWidth()/2;
    goBackButton.y = 1130;
    assignHitArea(goBackButton);

    for (var i = 0; i < 2; i++) {
        for (var a = 0; a < 3; a++) {
            window["counter"+i+"_"+a].x = 100 + a * 90 + i * 300;
            window["counter"+i+"_"+a].y = 155;
            window["counter"+i+"_"+a].image = counter0.image;
        }
    }

    GameView.x = WIDTH;
    GameView.addChild(game, gamePlayer1, gamePlayer2,
        counter0_0, counter0_1, counter0_2,
        counter1_0, counter1_1, counter1_2,
        goBackButton, Spaces, playing);
    
    stage.addChild(GameView);
    createjs.Tween.get(GameView).to({x:0}, 400).call(function() {
        stage.removeChild(TitleView);
    });

    // event listeners
    goBackButton.onPress = pushTitleView;
    addSpacesListeners();
}


function refreshGameView () {

    createjs.Tween.get(GameView.children[GameView.children.length-1]).to({alpha:0}, 400);
    createjs.Tween.get(Spaces).to({alpha:0}, 400).call(function () {
        populateSpaces();
    });

    playing.x = 385;
    playing.y = 35;
    whoStarted = !whoStarted;
    playerPlaying = whoStarted;
    cpuPlaying = (gameBeingPlayed ? 0 : whoStarted);
    whosPlaying();
    if(cpuPlaying) { window.setTimeout( function() { cpuPlaying = 0; trySpace('s'+cpuMove()); }, 1000); }

    createjs.Tween.get(PlayAgainView).to({alpha:0}, 400);

    // event listeners
    addSpacesListeners();
}

function refreshGameOne () {
    refreshGameView();
}

function refreshGameTwo () {
    refreshGameView();
}

function assignHitArea (obj) {

    var hit = new createjs.Shape();
    hit.graphics.beginFill("#000").drawRect(0, 0, obj.getMeasuredWidth()*1.1, obj.getMeasuredHeight()*1.1);
    obj.hitArea = hit;
    obj.x = WIDTH/2 - obj.getMeasuredWidth()/2;
}

function addPlayAgainView () {

    playAgain = new createjs.Text("Play again", "normal 70px Mywriting", "#000");
    playAgain.x = WIDTH/2 - playAgain.getMeasuredWidth()/2;
    playAgain.y = 1020;
    playAgain.name = "startOne";

    assignHitArea(playAgain);

    PlayAgainView.alpha = 0;
    PlayAgainView.x = 0;
    PlayAgainView.y = 0;
    PlayAgainView.addChild(playAgain);
    
    stage.addChild(PlayAgainView);
    createjs.Tween.get(PlayAgainView).to({alpha:1}, 400);

    // remove event listeners
    for (var i = Spaces.children.length - 1; i >= 0; i--) {
        Spaces.children[i].onPress = function () {};
    }
    // event listeners
    playAgain.onPress = (gameBeingPlayed? refreshGameTwo : refreshGameOne);
}

function tick () {
    stage.update();
}

function trial (a) {
    if (a === 1) return "b";
    if (a === 3) return "a";
}

function cpuMove () {
    var pp = populatedSpaces;
    var es = []; // empty spaces
    var littleError = Math.floor((Math.random()*15)+1);
    var cont = 1;
    var ret;
    var i = 0;

    //if (littleError === 1) return es[(Math.floor((Math.random()*(es.length-1))))];
    // get empty spaces
    for (i = pp.length - 1; i >= 0; i--) {
        if( pp[i] === 0 ) es.push(i);
    }
    // if there is only one space take do random
    if (es.length === 8) { ret = es[(Math.floor((Math.random()*(es.length-1))))]; }
    // first try filling empty spaces one by one by computer
    // and check whether the computer will win
    if (cont === 1)
    for (i = es.length - 1; i >= 0; i--) {
        pp[es[i]] = 2;
        if( cpuCheckWinning(pp) ) { cont = 0; ret = es[i];}
        pp[es[i]] = 0;
    }
    // next check if player would win anywhere
    if (cont === 1)
    for (i = es.length - 1; i >= 0; i--) {
        pp[es[i]] = 1;
        if( cpuCheckWinning(pp) ) { cont = 0; ret = es[i];}
        pp[es[i]] = 0;
    }
    // next check if the cpu can play anywhere to have 2 in a row next round
    if (cont === 1)
    for (i = es.length - 1; i >= 0; i--) {
        for (var a = es.length - 1; a >= 0; a--) {
            pp[es[a]] = 2; pp[es[i]] = 2;

        if( cpuCheckWinning(pp) ) { cont = 0; ret =  es[i];}
        pp[es[a]] = 0; pp[es[i]] = 0;

        }
    }
    // next check if the player would have 2 in a row next round
    if (cont === 1) {
        for (i = es.length - 1; i >= 0; i--) {
            for (var a = es.length - 1; a >= 0; a--) {
                pp[es[a]] = 1; pp[es[i]] = 1;

                if ( cpuCheckWinning(pp) )  { cont = 0; ret = es[i];}
                pp[es[a]] = 0; pp[es[i]] = 0;
            }
        }
    }

    if (cont === 1) { ret = es[(Math.floor((Math.random()*(es.length-1))))]; }
    return ret;

}

function cpuCheckWinning (ps) {
    for (var i = winningCombinations.length - 1; i >= 0; i--) {
        ar = winningCombinations[i];
        if (ps[ar[0]] !== 0 && ps[ar[0]] === ps[ar[1]] && ps[ar[1]] === ps[ar[2]]) return true;
    }
    return false;
}

function populateSpaces () {
    Spaces.removeAllChildren();
    populatedSpaces = [ 0, 0, 0,
                        0, 0, 0,
                        0, 0, 0 ];

    for (var i = 0; i < 9; i++) {
        window['s'+i].x = locationsSpaces[i][0];
        window['s'+i].y = locationsSpaces[i][1];
        window['s'+i].name = "s"+i;
        window['s'+i].image = imageBackup[i];
        Spaces.addChild(window['s'+i]);
    }

    createjs.Tween.get(Spaces).to({alpha:1}, 100);
}

function addSpacesListeners () {
    funcs = [];

    for (var i = Spaces.children.length - 1; i >= 0; i--) {
        Spaces.children[i].onPress = function () { trySpace(this.name); };
    }
}

function trySpace (i) {
    i = i.substr(1);
    //console.log("check if space "+i+" is populated");

    if(!cpuPlaying && populatedSpaces[i] === 0) {
        Spaces.children[i].image = (playerPlaying ? cross.image : circle.image);
        populatedSpaces[i] = (playerPlaying ? 1 : 0) + 1;
        
        if(!checkGameState()) {
            playerPlaying = (playerPlaying ? 0 : 1);
            whosPlaying();

            if(playerPlaying && !gameBeingPlayed) {
                cpuPlaying = 1;
                window.setTimeout(function() { cpuPlaying = 0; trySpace('s'+cpuMove()); }, 1000);
            }
        } else GameView.removeChild('playing');
    }
}

function checkGameState () {

    for (var i = winningCombinations.length - 1; i >= 0; i--) {
        ar = winningCombinations[i];
        if (populatedSpaces[ar[0]] !== 0 &&
            populatedSpaces[ar[0]] === populatedSpaces[ar[1]] &&
            populatedSpaces[ar[1]] === populatedSpaces[ar[2]]) {

            switch(i) {
                case 0: case 1: case 2:
                    lineHorizontal.x = 75;
                    lineHorizontal.y = 450 + i * 200;
                    lineHorizontal.alpha = 1;
                    GameView.addChild(lineHorizontal);
                    //console.log("horizontal");
                    break;
                case 3: case 4: case 5:
                    lineVertical.x = 150 + (i - 3) * 215;
                    lineVertical.y = 370;
                    lineVertical.alpha = 1;
                    GameView.addChild(lineVertical);
                    //console.log("vertical");
                    break;
                case 6:
                    lineDownwards.x = 80;
                    lineDownwards.y = 350;
                    lineDownwards.alpha = 1;
                    GameView.addChild(lineDownwards);
                    //console.log("downwards");
                    break;
                case 7:
                    lineUpwards.x = 80;
                    lineUpwards.y = 350;
                    lineUpwards.alpha = 1;
                    GameView.addChild(lineUpwards);
                    //console.log("upwards");
                    break;
            }

            if (playerPlaying) playerScore2 += 1;
            else playerScore1 += 1;

            updateScore();
            pushPlayAgain();
            return true;
        }
    }

    filledSpaces = 0;

    for (i = populatedSpaces.length - 1; i >= 0; i--) {
        if (populatedSpaces[i] !== 0) filledSpaces += 1;
    }

    if (filledSpaces === 9) pushPlayAgain();

}

function updateScore () {
    score = (playerPlaying ? playerScore2 : playerScore1);

    if (score < 6) {
        window["counter"+playerPlaying+"_0"].image = window["counter"+score].image;
    } else if (score < 11) {
        window["counter"+playerPlaying+"_1"].image = window["counter"+(score-5)].image;
    } else if (score < 16) {
        window["counter"+playerPlaying+"_2"].image = window["counter"+(score-10)].image;
    }

}

function whosPlaying () {
    playing.x = (playerPlaying ? 385 : 45);
    playing.alpha = 1;
}

/*
circles and crosses

[95,385], [310,385], [515,385]
[95,590], [310,590], [515,590]
[95,790], [310,790], [515,790]

counter
[100, 155]


lines
[80, 350] down and up

playingCircle
[385, 35] right
[45, 35]  left */