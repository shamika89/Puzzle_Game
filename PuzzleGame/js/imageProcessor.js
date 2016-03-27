/**
 * User: Shamika
 * Date: 3/02/16
 * Time: 10:59 PM
 */


var init = function () {
    initGame();
};

var initGame = function () {
    var canvas = document.getElementById("canvas");
    var stage = new createjs.Stage(canvas);
    var ctx = canvas.getContext("2d");
    var uploadButton = document.getElementById("fileUpload");
    var nCol = 4;
    var nRow = 4;
    var pieceWidth;
    var pieceHeight;
    var piecesArray = [];
    var hRatio;
    var vRatio;
    var ratio;

    var loadImage = function() {
        refresh();
        if (this.files && this.files[0]) {
            var fileReader = new FileReader();
            fileReader.onload = function (e) {
                var bitmap = new createjs.Bitmap(e.target.result);
                bitmap.image.src = e.target.result;
                bitmap.image.onload = function () {
                    scaleImage(bitmap);
                    startGame();
                    //stage.addChild(bitmap);
                    buildPuzzle(bitmap.image.src);
                    shufflePuzzle();
                    stage.update();
                };
            };
            fileReader.readAsDataURL(this.files[0]);
        };

    };

    var scaleImage = function(bitmap) {
        hRatio = canvas.width / bitmap.image.width;
        vRatio = canvas.height / bitmap.image.height;
        ratio = Math.min(hRatio, vRatio);
        canvas.width = bitmap.image.width * ratio;
        canvas.height = bitmap.image.height * ratio;
        stage.width = canvas.width;
        stage.height = canvas.height;
        bitmap.scaleX = stage.width/ bitmap.image.width;
        bitmap.scaleY = stage.height/bitmap.image.height;
        pieceWidth = Math.round(canvas.width / nCol);
        pieceHeight = Math.round(canvas.height / nRow);
    };

    var buildPuzzle = function(imageObj) {
        var l = nCol * nRow;
        var i, piece;
        var col = 0;
        var row = 0;
        for (i = 0; i < l; i++) {
            piece = new createjs.Bitmap(imageObj);
            piece.sourceRect = new createjs.Rectangle(col * pieceWidth, row * pieceHeight, pieceWidth, pieceHeight);
            piece.homePoint = {x: col * pieceWidth,
                y: row * pieceHeight};
            piece.x = piece.homePoint.x;
            piece.y = piece.homePoint.y;
            stage.addChild(piece);
            piecesArray[i] = piece;
            col++;
            if (col == nCol) {
                col = 0;
                row++;
            }
        }
    };

    var shufflePuzzle = function() {
        var i, piece, randomIndex;
        var col = 0;
        var row = 0;
        var p = [];
        p = p.concat(piecesArray);
        var l = p.length;
        for (i = 0; i < l; i++) {
            randomIndex = Math.floor(Math.random() * p.length);
            piece = p[randomIndex];
            p.splice[randomIndex, 1];
            createjs.Tween.get(piece).to({x: col * pieceWidth, y: row * pieceHeight});
            col++;
            if (col == nCol) {
                col = 0;
                row++;
            }
        }
    };

    var refresh = function(){
        stage.removeAllChildren();
        stage.update();
        canvas.width = 500;
        canvas.height = 500;
        stage.width = canvas.width;
        stage.height = canvas.height;
    }

    function startGame() {
        createjs.Ticker.addEventListener("tick", function () {
            stage.update();
        });
        createjs.Ticker.setFPS(60);
    }

    uploadButton.addEventListener("change", loadImage, false);

};