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
    var ctx = canvas.getContext("2d");
    var uploadButton = document.getElementById("fileUpload");
    var hRatio;
    var vRatio;
    var ratio;

    var readImage = function () {
		canvas.width = 500;
        canvas.height = 500;
        if (this.files && this.files[0]) {
            var fileReader = new FileReader();
            fileReader.onload = function (e) {
                var img = new Image();
                img.onload = function () {
                    ctx.clearRect(0, 0, canvas.width, canvas.height);
					scaleImage(img);
                };
                img.src = e.target.result;

            };
            fileReader.readAsDataURL(this.files[0]);
        }
        ;

    };

    var scaleImage = function scaleImage(img) {
        hRatio = canvas.width / img.width;
        vRatio = canvas.height / img.height;
        ratio = Math.min(hRatio, vRatio);
        canvas.width = img.width * ratio;
        canvas.height = img.height * ratio;
        ctx.drawImage(img, 0, 0, img.width, img.height, 0, 0, img.width * ratio, img.height * ratio);
    };

    uploadButton.addEventListener("change", readImage, false);

};