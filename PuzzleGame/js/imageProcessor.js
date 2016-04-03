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
    var nCol = 2;
    var nRow = 2;
    var pieceWidth;
    var pieceHeight;
    var piecesArray = [];
    var hRatio;
    var vRatio;
    var ratio;
    var scaledPieceWidth;
    var scaledPieceHeight;

    var loadImage = function () {
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
        pieceWidth = Math.round(bitmap.image.width / nCol);
        pieceHeight = Math.round(bitmap.image.height / nRow);
    };

    /**
     * Breaking an image into pieces.
     * @param imageObj
     */
    var buildPuzzle = function (imageObj) {
        var l = nCol * nRow;
        var i, piece;
        var col = 0;
        var row = 0;
        scaledPieceWidth =   Math.round(canvas.width / nCol);
        scaledPieceHeight =  Math.round(canvas.height / nRow);
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
            if (col == nCol) {
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
            col++;
            if (col == nCol) {
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
    }

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
    }

    var startGame = function () {
        createjs.Ticker.addEventListener("tick", function () {
            stage.update();
        });
        createjs.Ticker.setFPS(60);
    }

    uploadButton.addEventListener("change", loadImage, false);

};
