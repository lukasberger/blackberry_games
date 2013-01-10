// canvas
var canvas, stage;

var WIDTH = window.innerWidth;
var HEIGHT = window.innerHeight;

var ld = (WIDTH > 720 ? 34 : 0); //large display constant


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
var PlayAgainView = new createjs.Container();
var Mines = new createjs.Container();

var mineHolder, mineImageHolder;
var conX, conY, sizeX, sizeY, moveX, moveY, mineColor;
var lastmineNo, lastminePos;

var logo, sublogo, resumeButton, startEasy, startMedium, startHard, exitButton, goBackButton;

var score, time, scoreCounter;
var ag; var clearedFields, clearedEmpties;

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
                {src:"assets/mine.png", id:"mine"}
                //{src:"assets/gameBackground.jpg", id:"game"},
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
        

            var img = new Image();
            img.src = event.src;
            img.onload = handleComplete;
            if(typeof event.id == 'number') {
                image.width = 128;
                image.height = 128;
            }
            window[event.id] = new createjs.Bitmap(img);
    
}

function addLoadingView () {

    loadingText = new createjs.Text("Loading... 0%", 'normal 70px appleberry', '#000');
    loadingText.x = WIDTH/2 - loadingText.getMeasuredWidth()/2;
    loadingText.y = 661;
    loadingText.name = "loadingText";

    LoadingView.addChild(loadingText);
    stage.addChild(LoadingView);
}

function addTitleView () {
    // add first screen
    //console.log("Add Title View");
    main = new createjs.Shape();
    main.graphics.beginFill("#f8f8f8").drawRect(0, 0, WIDTH, HEIGHT);
    main.x = 0;
    main.y = 0;

    logo = new createjs.Text("Mines", 'normal 140px appleberry', '#000');
    logo.x = WIDTH/2 - logo.getMeasuredWidth()/2;
    logo.y = 120;

    sublogo = new createjs.Text("classic", 'normal 50px appleberry', '#000');
    sublogo.x = 360 + ld;
    sublogo.y = 243;

    startEasy = new createjs.Text("Easy", 'normal 70px appleberry', '#000');
    startEasy.x = 184;
    startEasy.y = 625;
    startEasy.name = "startEasy";
    assignHitArea(startEasy);

    startMedium = new createjs.Text("Medium", 'normal 70px appleberry', '#000');
    startMedium.x = 184;
    startMedium.y = 780;
    startMedium.name  = "startMedium";
    assignHitArea(startMedium);

    startHard = new createjs.Text("Hard", 'normal 70px appleberry', '#000');
    startHard.x = 184;
    startHard.y = 935;
    startHard.name = "startHard";
    assignHitArea(startHard);

    exitButton = new createjs.Text("Exit", 'normal 70px appleberry', '#000');
    exitButton.x = 184;
    exitButton.y = 1140;
    exitButton.name = "exitButton";
    assignHitArea(exitButton);

    TitleView.addChild(main, logo, sublogo, startEasy, startMedium, startHard, exitButton);
    stage.removeChild(LoadingView);
    stage.addChild(TitleView);


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

function pushPlayAgain (won) {
    //console.log("push play again?");
    addPlayAgainView(won);
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

    gameBeingPlayed = type;
    clearedFields = 0;

    startingTime = createjs.Ticker.getTime();
    score = 0;

    time = new createjs.Text("Time: 00:00:00", 'normal 40px appleberry', '#000');
    time.x = 20+ld;
    time.y = 10;
/*
    scoreCounter = new createjs.Text("Score: 0", 'normal 40px appleberry', '#000');
    scoreCounter.x = WIDTH - 50 - scoreCounter.getMeasuredWidth();
    scoreCounter.y = 10;*/

    game = new createjs.Shape();
    game.graphics.beginFill("#f8f8f8").drawRect(0, 0, WIDTH, HEIGHT);
    game.x = 0;
    game.y = 0;

    goBackButton = new createjs.Text("Go back to menu", 'normal 70px appleberry', '#000');
    goBackButton.x = WIDTH/2 - goBackButton.getMeasuredWidth()/2;
    goBackButton.y = 1180;
    assignHitArea(goBackButton);

    /*for (var i = 0; i < 2; i++) {
        for (var a = 0; a < 3; a++) {
            window["counter"+i+"_"+a].x = 100 + a * 90 + i * 300;
            window["counter"+i+"_"+a].y = 155;
            window["counter"+i+"_"+a].image = counter0.image;
        };
    };*/

    GameView.x = WIDTH;
    GameView.removeAllChildren();
    GameView.addChild(game, time, scoreCounter, goBackButton, Mines);
    
    stage.addChild(GameView);
    createjs.Tween.get(GameView).to({x:0}, 400).call(function() {
        stage.removeChild(TitleView);
    });

    addMines(type);

    gameTicker = {};
    createjs.Ticker.addListener(gameTicker, false);
    gameTicker.tick = updateTime;

    // event listeners
    goBackButton.onPress = pushTitleView;
}

function addMines (type) {

    if(type==="easy") {
        generateMines(5, 8);
        conX = 20;
        conY = 70;
        sizeX = 130;
        sizeY = 130;
        moveX = 19;
        moveY = 35;
        mineColor = "#0098f0";
    }
    else if(type==="medium") {
        generateMines(6, 10);
        conX = 26;
        conY = 70;
        sizeX = 106;
        sizeY = 106;
        moveX = 8;
        moveY = 25;
        mineColor = "#cc3f10";
    }
    else if(type==="hard") {
        generateMines(7, 11);
        conX = 20;
        conY = 70;
        sizeX = 92;
        sizeY = 92;
        moveX = 1;
        moveY = 15;
        mineColor = "#96b800";
    }

    mineImageHolder = [];
    Mines.removeAllChildren();

    for (var i = mineHolder.length - 1; i >= 0; i--) {
        mineImageHolder[i] = [];

        for (var a = mineHolder[i].length - 1; a >= 0; a--) {

            mineImageHolder[i][a] = new createjs.Shape();
            mineImageHolder[i][a].graphics.beginFill(mineColor).drawRect(0, 0, sizeX, sizeY);
            mineImageHolder[i][a].x = conX + (sizeX + 2) * a + ld;
            mineImageHolder[i][a].y = conY + (sizeY + 2) * i;
            mineImageHolder[i][a].name = "c_"+i+"_"+a+"_"+mineHolder[i][a];

            Mines.addChild(mineImageHolder[i][a]);

            mineImageHolder[i][a].onPress = function () { flipmine(this.name); };
        }
    }

    GameView.addChild(Mines);

}

//+ Jonas Raoni Soares Silva
//@ http://jsfromhell.com/array/shuffle [v1.0]

shuffle = function(o){ //v1.0
    for(var j, x, i = o.length; i; j = parseInt(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
    return o;
};


function generateMines (x, y) {
    mineHolder = [];
    var tempHolder = [];

    // generate mine positions
    for (var i = 0; i < x*y; i++) {
        if ( i < x*y/6 ) tempHolder[i] = 9; // 9 has mine
        else tempHolder[i] = 0;
    }

    shuffle(tempHolder);

    for (i = 0; i < y; i++) {
        mineHolder[i] = tempHolder.splice(0, x);
    }

    countAdjacentMines();
}

function countAdjacentMines () {

    for (var i = mineHolder.length - 1; i >= 0; i--) {
        for (var a = mineHolder[i].length - 1; a >= 0; a--) {
            var adjacent = 0;
            var m = mineHolder;
            
            if ( m[i][a] !== 9 ) {
                if ( i + 1 < m.length                           &&  m[i+1][a] === 9 ) adjacent += 1;    //console.log(m[i+1][a]);
                if ( i + 1 < m.length       && a  + 1 < m[0].length     &&  m[i+1][a+1] === 9 ) adjacent += 1;  //console.log(m[i+1][a+1]);
                if (                           a  + 1 < m[0].length     &&  m[i][a+1] === 9 ) adjacent += 1;    //console.log(m[i][a+1]);
                if ( i > 0                  && a  + 1 < m[0].length     &&  m[i-1][a+1] === 9 ) adjacent += 1;  //console.log(m[i-1][a+1]);
                if ( i > 0                                      &&  m[i-1][a] === 9 ) adjacent += 1;    //console.log(m[i-1][a]);
                if ( i > 0                  && a > 0            &&  m[i-1][a-1] === 9 ) adjacent += 1;  //console.log(m[i-1][a-1]);
                if (                           a > 0            &&  m[i][a-1] === 9 ) adjacent += 1;    //console.log(m[i][a-1]);
                if ( i + 1 < m.length       && a > 0            &&  m[i+1][a-1] === 9 ) adjacent += 1;  //console.log(m[i+1][a-1]);

                mineHolder[i][a] = adjacent;

            }
         
         }
    }
}

function flipmine (mine) {

    var stA = mine.split("_");

    var cX = parseInt(stA[1], 10);
    var cY = parseInt(stA[2], 10);
    var c = parseInt(stA[3], 10);

    var num = parseInt(c, 10) + 1;
    var img = 's'+num;

    var pX = 0;

    if ( c == 9 ) {
        mineImageHolder[cX][cY].graphics.clear().beginBitmapFill(window['mine'].image, 'no-repeat').drawRect(0, 0, sizeX, sizeY);
        pX = 10;
        allBlowUp();

    } else if ( c === 0 ) {
        clearAdjacentEmpty(cX, cY);
    } else if ( typeof mineImageHolder[cX][cY].graphics !== 'undefined' ) {
        mineImageHolder[cX][cY].graphics.clear();
        Mines.removeChild(mineImageHolder[cX][cY]);
        mineImageHolder[cX][cY] = null;
        mineImageHolder[cX][cY] = new createjs.Text( mineHolder[cX][cY] , "bold 60px Verdana", getColor(mineHolder[cX][cY]));
        Mines.addChild(mineImageHolder[cX][cY]);
        clearedFields += 1;
        pX = 30;
        if(clearedFields === Math.floor( mineHolder.length * mineHolder[0].length / 6 * 5)) pushPlayAgain(true);
    } else {
        pX = 30;
    }

    // console.log(cX+" "+cY+" move to " + ( conX + (sizeX + 2) * cY + ld + moveX + pX));
    mineImageHolder[cX][cY].x = conX + (sizeX + 2) * cY + ld + moveX + pX;
    mineImageHolder[cX][cY].y = conY + (sizeY + 2) * cX + moveY;

    //mineImageHolder[cX][cY].graphics.clear().beginFill("#000").drawRect(0, 0, sizeX, sizeY);
    //createjs.Tween.get(mineImageHolder[cX][cY]).to({alpha: 0}, 400);

    // check if there is a mine flipped
}

function getColor (num) {
    num = parseInt(num, 10);

    switch (num) {
        case 1: return "#1EA2F2";
        case 2: return "#2ABF5E";
        case 3: return "#F2B510";
        case 4: return "#8B378C";
        case 5: return "#F2163E";
    }
}

function clearAdjacentEmpty (i, a) {
    
    i = parseInt(i, 10);
    a = parseInt(a, 10);

    var m = mineHolder;

    if (m[i][a] === 0) {

        clearedFields += 1;

        mineImageHolder[i][a].alpha = 0;

        var arraya = [  {i:1,a:0},
                        {i:-1,a:0},
                        {i:0,a:1},
                        {i:0,a:-1} ];

        for (var g = arraya.length - 1; g >= 0; g--) {
            var newI = i + arraya[g].i;
            var newA = a + arraya[g].a;

            if ( newI >= 0 && newI < mineHolder.length &&
                 newA >= 0 && newA < mineHolder[0].length && mineImageHolder[newI][newA].alpha !== 0) clearAdjacentEmpty(newI, newA);

        }
    } else if (m[i][a] !== 9 && m[i][a] >= 0 && m[i][a] < m.length) {
        flipmine("c_"+i+"_"+a+"_"+m[i][a]);
    }
}

function allBlowUp () {
    for (var i = mineHolder.length - 1; i >= 0; i--) {
        for (var a = mineHolder[i].length - 1; a >= 0; a--) {
            if(mineHolder[i][a] === 9) {
                mineImageHolder[i][a].graphics.clear().beginBitmapFill(window['mine'].image, "no-repeat").drawRect(0, 0, sizeX, sizeY);
                mineImageHolder[i][a].x = conX + (sizeX + 2) * a + ld + moveX + 5;
                mineImageHolder[i][a].y = conY + (sizeY + 2) * i + moveY;
            }
        }
    }
    removeListeners();
    pushPlayAgain(false); // false => didn't win
}

function removeListeners () {
    createjs.Ticker.removeListener(gameTicker);
    for (var i = mineHolder.length - 1; i >= 0; i--) {
        for (var a = mineHolder[i].length - 1; a >= 0; a--) {
            mineImageHolder[i][a].onPress = function () {};
        }
    }
}

function addListeners () {
    for (var i = mineHolder.length - 1; i >= 0; i--) {
        for (var a = mineHolder[i].length - 1; a >= 0; a--) {
            mineImageHolder[i][a].onPress = function () { flipmine(this.name); };
        }
    }
}

function refreshGameView (type) {
    //console.log("Add game");

    gameBeingPlayed = type;
    clearedFields = 0;

    startingTime = createjs.Ticker.getTime();
    score = 0;

    time = new createjs.Text("Time: 00:00:00", 'normal 40px appleberry', '#000');
    time.x = 20+ld;
    time.y = 10;
/*
    scoreCounter = new createjs.Text("Score: 0", 'normal 40px appleberry', '#000');
    scoreCounter.x = WIDTH - 50 - scoreCounter.getMeasuredWidth();
    scoreCounter.y = 10;*/

    game = new createjs.Shape();
    game.graphics.beginFill("#f8f8f8").drawRect(0, 0, WIDTH, HEIGHT);
    game.x = 0;
    game.y = 0;

    goBackButton = new createjs.Text("Go back to menu", 'normal 70px appleberry', '#000');
    goBackButton.x = WIDTH/2 - goBackButton.getMeasuredWidth()/2;
    goBackButton.y = 1180;
    assignHitArea(goBackButton);

    /*for (var i = 0; i < 2; i++) {
        for (var a = 0; a < 3; a++) {
            window["counter"+i+"_"+a].x = 100 + a * 90 + i * 300;
            window["counter"+i+"_"+a].y = 155;
            window["counter"+i+"_"+a].image = counter0.image;
        };
    };*/

    GameView.x = WIDTH;
    GameView.removeAllChildren();
    GameView.addChild(game, time, scoreCounter, goBackButton, Mines);
    
    stage.addChild(GameView);
    createjs.Tween.get(GameView).to({x:0}, 400).call(function() {
        stage.removeChild(PlayAgainView);
    });

    addMines(type);

    gameTicker = {};
    createjs.Ticker.addListener(gameTicker, false);
    gameTicker.tick = updateTime;

    // event listeners
    goBackButton.onPress = pushTitleView;
}

function assignHitArea (obj) {
    var hit = new createjs.Shape();
    hit.graphics.beginFill("#000").drawRect(0, 0, obj.getMeasuredWidth()*1.1, obj.getMeasuredHeight()*1.1);
    obj.hitArea = hit;
    obj.x = WIDTH/2 - obj.getMeasuredWidth()/2;
}

function addPlayAgainView (won) {
    //console.log("Want to play again?");
    
    /*winningMessage = new createjs.Text((playerPlaying ? gamePlayer2.text : gamePlayer1.text)+" won, congratulations!", "normal 70px appleberry", "#000");
    winningMessage.x = 184;
    winningMessage.y = 500;*/
    var whiteBg = new createjs.Shape();
    whiteBg.graphics.beginFill("#f8f8f8").drawRect(0, 60, WIDTH, 1100);
    whiteBg.alpha = 0.7;

    var txt;

    if(won) txt = "Congratulations!";
    else txt = "You lost!";

    var youWon = new createjs.Text(txt, "normal 70px appleberry", "#000");
    youWon.x = WIDTH/2 - youWon.getMeasuredWidth()/2;
    youWon.y = 640;
    youWon.name = "youWon";

    playAgain = new createjs.Text("Play again", "normal 70px appleberry", "#000");
    playAgain.x = WIDTH/2 - playAgain.getMeasuredWidth()/2;
    playAgain.y = 1000;
    playAgain.name = "playAgain";

    assignHitArea(playAgain);

    PlayAgainView.alpha = 0;
    PlayAgainView.x = 0;
    PlayAgainView.y = 0;
    PlayAgainView.removeAllChildren();
    PlayAgainView.addChild(whiteBg, youWon, playAgain);
    
    stage.addChild(PlayAgainView);
    createjs.Tween.get(PlayAgainView).to({alpha:1}, 400);

    createjs.Ticker.removeListener(gameTicker);

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

function addMinesListeners () {
    funcs = [];

    for (var i = Mines.children.length - 1; i >= 0; i--) {
        Mines.children[i].onPress = function () {trySpace(this.name); };
    }
} 

function checkGameState () {
    var end = 0;

    if(gameBeingPlayed == "easy") end = 15;
    else if (gameBeingPlayed == "medium") end = 21;
    else if (gameBeingPlayed == "hard") end = 28;

    return (score === end);

}