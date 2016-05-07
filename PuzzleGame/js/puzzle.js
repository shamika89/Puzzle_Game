/**
 * User: Shamika
 * Date: 3/02/16
 * Time: 10:59 PM
 */


var init = function () {
    initGame();
};

var gameSettings = {
    level: 1,
    piecesX: 2,
    piecesY: 2
};

var initGame = function () {
    var canvas = document.getElementById("canvas");
    var stage = new createjs.Stage(canvas);
    var ctx = canvas.getContext("2d");
    var uploadButton = document.getElementById("fileUpload");
    var pieceWidth;
    var pieceHeight;
    var piecesArray = [];
    var hRatio;
    var vRatio;
    var ratio;
    var scaledPieceWidth;
    var scaledPieceHeight;
	var selectedPieces = [];
    var bitmap;
    var startTime;
	var numberOfSwaps = 0;

    var loadImage = function () {
        refresh();
        if (this.files && this.files[0]) {
            var fileReader = new FileReader();
            fileReader.onload = function (e) {
                bitmap = new createjs.Bitmap(e.target.result);
                bitmap.image.onload = function () {
                    scaleImage(bitmap);
                    loadThumbnail(bitmap);
					startGame();
                    buildPuzzle(bitmap.image.src);
                    shufflePuzzle();
                    drawGridLines();
                    stage.update();
                    startTime = Math.floor(Date.now() / 1000);
                    setInterval(updateTime, 1000);
                };
                bitmap.image.src = e.target.result;
            };
            fileReader.readAsDataURL(this.files[0]);
        };
		document.getElementById("playArea").style.display = "block";
        document.getElementById("timer").style.display = "block";
    };

	var loadThumbnail = function (bitmap) {
        var canvasThumbnail = document.getElementById("canvasThumbnail");
        var stageThumbnail = new createjs.Stage(canvasThumbnail);
        var hRatioThumbnail = canvasThumbnail.width / bitmap.image.width;
        var vRatioThumbnail = canvasThumbnail.height / bitmap.image.height;
        var ratioThumbnail = Math.min(hRatioThumbnail, vRatioThumbnail);
        canvasThumbnail.width = bitmap.image.width * ratioThumbnail;
        canvasThumbnail.height = bitmap.image.height * ratioThumbnail;
        stageThumbnail.width = canvasThumbnail.width;
        stageThumbnail.height = canvasThumbnail.height;
        bitmap.scaleX = stageThumbnail.width / bitmap.image.width;
        bitmap.scaleY = stageThumbnail.height / bitmap.image.height;
        stageThumbnail.addChild(bitmap);
        stageThumbnail.update();
    };
	
	/**
     * Scaling the image on the canvas.
     */
    var scaleImage = function (bitmap) {
        hRatio = canvas.width / bitmap.image.width;
        vRatio = canvas.height / bitmap.image.height;
        ratio = Math.min(hRatio, vRatio);
        canvas.width = bitmap.image.width * ratio;
        canvas.height = bitmap.image.height * ratio;
        stage.width = canvas.width;
        stage.height = canvas.height;
        bitmap.scaleX = stage.width/ bitmap.image.width;
        bitmap.scaleY = stage.height/bitmap.image.height;
        pieceWidth = Math.round(bitmap.image.width / gameSettings.piecesX);
        pieceHeight = Math.round(bitmap.image.height / gameSettings.piecesY);
    };

    /**
     * Breaking an image into pieces.
     * @param imageObj
     */
    var buildPuzzle = function (imageObj) {
        var l = gameSettings.piecesX * gameSettings.piecesY;
        var i, piece;
        var col = 0;
        var row = 0;
        scaledPieceWidth =   Math.round(canvas.width / gameSettings.piecesX);
        scaledPieceHeight =  Math.round(canvas.height / gameSettings.piecesY);
        for (i = 0; i < l; i++) {
            piece = new createjs.Bitmap(imageObj);
            piece.sourceRect = new createjs.Rectangle(col * pieceWidth, row * pieceHeight, pieceWidth, pieceHeight);
            piece.scaleX = scaledPieceWidth / pieceWidth;
            piece.scaleY = scaledPieceHeight / pieceHeight;
            piece.homePoint = {x: col * scaledPieceWidth,
                y: row * scaledPieceHeight};
            piece.x = piece.homePoint.x;
            piece.y = piece.homePoint.y;
            stage.addChild(piece);
            piecesArray[i] = piece;
            col++;
            if (col == gameSettings.piecesX) {
                col = 0;
                row++;
            }
        }
    };

    /**
     * Shuffling the image pieces
     */
    var shufflePuzzle = function () {
        var i, piece, randomIndex;
        var col = 0;
        var row = 0;
        var p = [];
        p = p.concat(piecesArray);
        shuffleArray(p);
        var l = p.length;
        for (i = 0; i < l; i++) {
            piece = p[i];
            createjs.Tween.get(piece).to({x: col * scaledPieceWidth, y: row * scaledPieceHeight});
			piece.addEventListener("click", onPieceClick);
            col++;
            if (col == gameSettings.piecesX) {
                col = 0;
                row++;
            }
        }
    };

    /**
     * Shuffling the given array.
     * @param a
     */
    var shuffleArray = function (a) {
        var j, x, i;
        for (i = a.length; i; i -= 1) {
            j = Math.floor(Math.random() * i);
            x = a[i - 1];
            a[i - 1] = a[j];
            a[j] = x;
        }
    };

    /**
     * Refreshing the canvas.
     */
    var refresh = function (){
        stage.removeAllChildren();
        stage.update();
        canvas.width = 500;
        canvas.height = 500;
        stage.width = canvas.width;
        stage.height = canvas.height;
		resetNumberOfSwaps();
    };

    var startGame = function () {
        createjs.Ticker.addEventListener("tick", function () {
            stage.update();
        });
        createjs.Ticker.setFPS(60);
    };
	
	/**
     * This function is called when the user performs mouse click on an image.
     */
	var onPieceClick = function (e) {
        if (selectedPieces.length == 2) {
            return;
        }
        var piece = e.target;
        piece.alpha = 0.5;
        selectedPieces.push(piece);
        if (selectedPieces.length == 2) {
            swapPieces();
        }
    };
	
	/**
     * Swapping two selected image pieces.
     */
	var swapPieces = function () {
        var piece1 = selectedPieces[0];
        var piece2 = selectedPieces[1];
        createjs.Tween.get(piece1).wait(300).to({x: piece2.x, y: piece2.y});
        createjs.Tween.get(piece2).wait(300).to({x: piece1.x, y: piece1.y}).call(function () {
            setTimeout(evaluatePuzzle, 200);
        });
        piece1.alpha = 1;
        piece2.alpha = 1;
		numberOfSwaps ++;
		document.getElementById("swaps").innerHTML = numberOfSwaps;;
    };

	/**
     * Game win condition.
     */
	var evaluatePuzzle = function () {
        var win = true;
        var piece;

        for (var i = 0; i < piecesArray.length; i++) {
            piece = piecesArray[i];

            if (piece.x == piece.homePoint.x && piece.y == piece.homePoint.y) {
                piece.removeEventListener("click", onPieceClick);
            }
            if (piece.x != piece.homePoint.x || piece.y != piece.homePoint.y) {
                win = false;
            }
        }
		
		selectedPieces.length = 0;
		/**
		*Loads the next level if the user completes the current level.
		**/
        if (win) {
            var msg = "Level " + gameSettings.level + " Completed !!!" + "\n" + "Go to the next level";
			if(gameSettings.level == 8){
                alert('Congratulations !!! You Won');
				restart();
            }
			else{
				if (confirm(msg) == true) {
					loadNextLevel();
					resetTimer();
				} else {
					restart();
				}
			}          
        }
    };
	
	/**
     * Drawing grid lines to differentiate image pieces .
     */
	var drawGridLines = function () {
        // Draw horizontal lines
        for (var r = 0; r <= canvas.height; r += scaledPieceHeight) {
            var sr = new createjs.Shape();
            var gr = sr.graphics.beginStroke("black");
            gr.moveTo(0, r);
            gr.lineTo(canvas.width, r);
            stage.addChild(sr);
        }

        // Draw vertical lines
        for (var r = 0; r <= canvas.width; r += scaledPieceWidth) {
            var sr = new createjs.Shape();
            var gr = sr.graphics.beginStroke("black");
            gr.moveTo(r, 0);
            gr.lineTo(r, canvas.height);
            stage.addChild(sr);
        }
    };
	
	/**
     * Updating elapse time for the game.
     */
	var updateTime = function () {
        var now = Math.floor(Date.now() / 1000);
        var diff = now - startTime;
        var hours = checkTime(Math.floor((diff / 3600)));
        var minutes = checkTime(Math.floor(diff / 60));
        var seconds = checkTime(Math.floor(diff % 60));
        document.getElementById("hours").innerHTML = hours;
        document.getElementById("minutes").innerHTML = minutes;
        document.getElementById("seconds").innerHTML = seconds;
    };
	
	/**
     * Resetting Timer.
     */
	var resetTimer = function() {
        startTime = Math.floor(Date.now() / 1000);
    };

    var checkTime= function(val) {
        return val > 9 ? val : "0" + val;
    };
	
	/**
     * Loading next level.
     */
	var loadNextLevel = function () {
        gameSettings.level = gameSettings.level + 1;
        gameSettings.piecesX = gameSettings.piecesX + 1;
        gameSettings.piecesY = gameSettings.piecesY + 1;
        uploadButton.removeEventListener("change", loadImage);
        piecesArray.length = 0;
        clearInterval(updateTime());
        refresh();
        scaleImage(bitmap);
        startGame();
        buildPuzzle(bitmap.image.src);
        shufflePuzzle();
        drawGridLines();
        stage.update();
		resetNumberOfSwaps();
		document.getElementById("swaps").innerHTML = numberOfSwaps;
    };
	
	/**
     * Reset Number of swaps.
     */
    var resetNumberOfSwaps = function () {
        numberOfSwaps = 0;
        document.getElementById('swaps').value = 0;
    };
	
	/**
     * Loading preview.
     */
	var loadPreview = function(){ 
		document.getElementById("savedPreview").style.display = "block";	
        document.getElementById("savedPreview").style.visibility = "visible";
		setTimeout(unloadPreview, 3000);
    };
	
	/**
     * Unloading Preview.
     */
	var unloadPreview = function(){
        document.getElementById("savedPreview").style.visibility = "hidden";
    };
	
	/**
     * Restart the game.
     */
    var restart = function(){
        window.location.reload();
    };
	
    uploadButton.addEventListener("change", loadImage, false);
	document.getElementById("preview").addEventListener("click", loadPreview, false);
    document.getElementById("startOver").addEventListener("click", restart, false);
};
