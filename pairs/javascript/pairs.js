// canvas
var canvas, stage;

var WIDTH = window.innerWidth;
var HEIGHT = window.innerHeight;

var ld = (WIDTH > 720 ? 24 : 0); //large display constant


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
var Cards = new createjs.Container();

var cardHolder, cardImageHolder;
var conX, conY, sizeX, sizeY, moveX, moveY, cardColor;
var lastCardNo, lastCardPos;

var logo, sublogo, resumeButton, startEasy, startMedium, startHard, exitButton, goBackButton;

var score, time, scoreCounter;
var ag;

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
                //{src:"assets/background.jpg", id:"main"},
                //{src:"assets/gameBackground.jpg", id:"game"},
            ];

    for (var i = 1; i < 29; i++) {
        assets.push({src:"assets/png/"+i+".png", id:"s"+i});
    }

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

    logo = new createjs.Text("Pairs", 'normal 180px appleberry', '#000');
    logo.x = WIDTH/2 - logo.getMeasuredWidth()/2;
    logo.y = 120;

    sublogo = new createjs.Text("classic", 'normal 50px appleberry', '#000');
    sublogo.x = 410 + ld;
    sublogo.y = 310;

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

    gameBeingPlayed = type;

    startingTime = createjs.Ticker.getTime();
    score = 0;

    time = new createjs.Text("Time: 00:00:00", 'normal 40px appleberry', '#000');
    time.x = 20+ld;
    time.y = 10;

    game = new createjs.Shape();
    game.graphics.beginFill("#f8f8f8").drawRect(0, 0, WIDTH, HEIGHT);
    game.x = 0;
    game.y = 0;

    goBackButton = new createjs.Text("Go back to menu", 'normal 70px appleberry', '#000');
    goBackButton.x = WIDTH/2 - goBackButton.getMeasuredWidth()/2;
    goBackButton.y = 1180;
    assignHitArea(goBackButton);

    GameView.x = WIDTH;
    GameView.removeAllChildren();
    GameView.addChild(game, time, scoreCounter, goBackButton, Cards);
    
    stage.addChild(GameView);
    createjs.Tween.get(GameView).to({x:0}, 400).call(function() {
        stage.removeChild(TitleView);
    });

    addCards(type);

    gameTicker = new Object;
    createjs.Ticker.addListener(gameTicker, false);
    gameTicker.tick = updateTime;

    // event listeners
    goBackButton.onPress = pushTitleView;
}

function addCards (type) {

    if(type==="easy") {
        generateCards(5, 6);
        conX = 20;
        conY = 70;
        sizeX = 130;
        sizeY = 160;
        moveX = 19;
        moveY = 35;
        cardColor = "#0098f0";
    }
    else if(type==="medium") {
        generateCards(6, 7);
        conX = 20;
        conY = 70;
        sizeX = 108;
        sizeY = 140;
        moveX = 8;
        moveY = 25;
        cardColor = "#cc3f10";
    }
    else if(type==="hard") {
        generateCards(7, 8);
        conX = 20;
        conY = 70;
        sizeX = 92;
        sizeY = 120;
        moveX = 1;
        moveY = 15;
        cardColor = "#96b800";
    }

    cardImageHolder = [];
    Cards.removeAllChildren();

    for (var i = cardHolder.length - 1; i >= 0; i--) {
        cardImageHolder[i] = [];

        for (var a = cardHolder[i].length - 1; a >= 0; a--) {
            cardImageHolder[i][a] = new createjs.Shape();
            cardImageHolder[i][a].graphics.beginFill(cardColor).drawRect(0, 0, sizeX, sizeY);
            cardImageHolder[i][a].x = conX + (sizeX + 5) * a + ld;
            cardImageHolder[i][a].y = conY + (sizeY + 5) * i;
            cardImageHolder[i][a].name = "c_"+i+"_"+a+"_"+cardHolder[i][a];

            Cards.addChild(cardImageHolder[i][a]);

            cardImageHolder[i][a].onPress = function () { flipCard(this.name); };
        }
    }

    GameView.addChild(Cards);

}

//+ Jonas Raoni Soares Silva
//@ http://jsfromhell.com/array/shuffle [v1.0]

shuffle = function(o){ //v1.0
    for(var j, x, i = o.length; i; j = parseInt(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
    return o;
};


function generateCards (x, y) {
    cardHolder = [];
    var tempHolder = [];

    for (var i = 0; i < x*y; i++) {
        tempHolder[i] = i%(x*y/2);
    }

    shuffle(tempHolder);

    for (i = 0; i < y; i++) {
        cardHolder[i] = tempHolder.splice(0, x);
    }
}

function flipCard (card) {
    var cY = card.substr(4, 1);
    var cX = card.substr(2, 1);
    var c = card.substr(6);

    var num = parseInt(c, 10) + 1;
    var img = 's'+num;

    cardImageHolder[cX][cY].graphics.clear().beginBitmapFill(window[img].image, 'no-repeat').drawRect(0, 0, sizeX, sizeY);
    cardImageHolder[cX][cY].x += moveX;
    cardImageHolder[cX][cY].y += moveY;

    // check if there is a card flipped
    if( lastCardNo !== null && !( lastCardPos[0] == cX && lastCardPos[1] == cY ) ) {
        // is it the same?
        if ( lastCardNo == c ) {
            removeListeners();

            createjs.Tween.get(cardImageHolder[cX][cY]).wait(1000).to({alpha:0}, 400);
            createjs.Tween.get(cardImageHolder[lastCardPos[0]][lastCardPos[1]]).wait(1000).to({alpha:0}, 400).call( function() {
                score += 1;
                lastCardNo = null;
                lastCardPos = null;
                if( checkGameState() ) addPlayAgainView();
                else addListeners();

            } );


        } else {
            removeListeners();

            createjs.Tween.get(cardImageHolder[lastCardPos[0]][lastCardPos[1]]).wait(1500).call( function() {

                cardImageHolder[lastCardPos[0]][lastCardPos[1]].x -= moveX;
                cardImageHolder[lastCardPos[0]][lastCardPos[1]].y -= moveY;

                cardImageHolder[cX][cY].graphics.clear().beginFill(cardColor)
                    .drawRect(0, 0, sizeX, sizeY);
                cardImageHolder[lastCardPos[0]][lastCardPos[1]].graphics.clear()
                    .beginFill(cardColor).drawRect(0, 0, sizeX, sizeY);

                cardImageHolder[cX][cY].x -= moveX;
                cardImageHolder[cX][cY].y -= moveY;
                lastCardNo = null;
                lastCardPos = null;
                addListeners();

            } );
        }
    } else {
            removeCardListener(cX, cY);
            lastCardNo = c;
            lastCardPos = [cX, cY];
    }
}

function removeCardListener (x, y) {
    cardImageHolder[x][y].onPress = function () { };
}

function addCardListener (x, y) {
    cardImageHolder[x][y].onPress = function () { flipCard(this.name); };
}


function removeListeners () {
    var donothing = function () {};

    for (var i = cardHolder.length - 1; i >= 0; i--) {
        for (var a = cardHolder[i].length - 1; a >= 0; a--) {
            cardImageHolder[i][a].onPress = donothing;
        }
    }
}

function addListeners () {
    for (var i = cardHolder.length - 1; i >= 0; i--) {
        for (var a = cardHolder[i].length - 1; a >= 0; a--) {
            cardImageHolder[i][a].onPress = function () { flipCard(this.name); };
        }
    }
}

function removeAllListeners () {
    createjs.Ticker.removeListener(gameTicker);
    var donothing = function () {};
    // number pad
    for (var i = Cards.children.length - 1; i >= 0; i--) {
        Cards.children[i].onPress = donothing;
    }
    for (i = 0; i < 3; i++) {
        for (var a = 0; a < 3; a++) {
            clickableNumbers[i][a].onPress = donothing;
        }
    }
}


function refreshGameView (type) {
    //console.log("Add game");

    gameBeingPlayed = type;

    startingTime = createjs.Ticker.getTime();
    score = 0;

    time = new createjs.Text("Time: 00:00:00", 'normal 40px appleberry', '#000');
    time.x = 20+ld;
    time.y = 10;

    goBackButton = new createjs.Text("Go back to menu", 'normal 70px appleberry', '#000');
    goBackButton.x = WIDTH/2 - goBackButton.getMeasuredWidth()/2;
    goBackButton.y = 1180;
    assignHitArea(goBackButton);

    GameView.x = WIDTH;
    GameView.removeAllChildren();
    GameView.addChild(game, time, scoreCounter, goBackButton, Cards);
    
    stage.addChild(GameView);
    createjs.Tween.get(GameView).to({x:0}, 400).call(function() {
        stage.removeChild(PlayAgainView);
    });

    addCards(type);

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

function addPlayAgainView (type) {
    //console.log("Want to play again?");
    
    /*winningMessage = new createjs.Text((playerPlaying ? gamePlayer2.text : gamePlayer1.text)+" won, congratulations!", "normal 70px appleberry", "#000");
    winningMessage.x = 184;
    winningMessage.y = 500;*/
    var whiteBg = new createjs.Shape();
    whiteBg.graphics.beginFill("#f8f8f8").drawRect(0, 60, WIDTH, 1100);
    whiteBg.alpha = 0.7;

    var youWon = new createjs.Text("Congratulations!", "normal 70px appleberry", "#000");
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

function populateCards () {
    Cards.removeAllChildren();
    Numbers.removeAllChildren();

    populatedCards = [];

    for (var i = 0; i < 9; i++) {
        populatedCards[i] = [];
        if(notresuming) savedNumbers[i] = [];
        for (var a = 0; a < 9; a++) {
            populatedCards[i][a] = numberGrid.rows[i][a];
            if(notresuming) savedNumbers[i][a] = [];
        }
    }
}

function addCardsListeners () {
    funcs = [];

    for (var i = Cards.children.length - 1; i >= 0; i--) {
        Cards.children[i].onPress = function () {trySpace(this.name); };
    }
}

function checkGameState () {

    var end = 0;

    if(gameBeingPlayed == "easy") end = 15;
    else if (gameBeingPlayed == "medium") end = 21;
    else if (gameBeingPlayed == "hard") end = 28;

    return (score === end);

}