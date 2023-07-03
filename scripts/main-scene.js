
let dlOffset = 1;
var beganLoad = false;

var isMobile = navigator.maxTouchPoints > 0;

if(isMobile){
    document.addEventListener("touchstart", e => { inputDown(e); });
    document.addEventListener("touchmove", e => { inputMove(e); });
    document.addEventListener("touchend", e => { inputUp(e); });
}else{
    document.addEventListener("mousedown", e => { inputDown(e); });
    document.addEventListener("mousemove", e => { inputMove(e); });
    document.addEventListener("mouseup", e => { inputUp(e); });
    console.log("assigned mouse events");
}
console.log(isMobile);

/*
MainScene.prototype.initialize = function() {

    if(app.touch) {
        app.touch.on(pc.EVENT_TOUCHSTART, this.inputDown, this);
        app.touch.on(pc.EVENT_TOUCHMOVE, this.inputMove, this);
        app.touch.on(pc.EVENT_TOUCHEND, this.inputUp, this);
        app.touch.on(pc.EVENT_TOUCHCANCEL, this.inputUp, this);

        this.on('destroy', function() {
            app.touch.off(pc.EVENT_TOUCHSTART, this.inputDown, this);
            app.touch.off(pc.EVENT_TOUCHMOVE, this.inputMove, this);
            app.touch.off(pc.EVENT_TOUCHEND, this.inputUp, this);
            app.touch.off(pc.EVENT_TOUCHCANCEL, this.inputUp, this);
        }, this);
    } else if (app.keyboard && app.mouse) {
        app.mouse.disableContextMenu();
        app.mouse.on(pc.EVENT_MOUSEDOWN, this.inputDown, this);
        app.mouse.on(pc.EVENT_MOUSEMOVE, this.inputMove, this);
        app.mouse.on(pc.EVENT_MOUSEUP, this.inputUp, this);
    }
};
*/

function inputDown(event) {
    inputting = true;

    event.preventDefault();

    let screenX = isMobile ? event.changedTouches[0].clientX : event.x;
    let screenY = isMobile ? event.changedTouches[0].clientY : event.y;

    tapPosVal = [screenX, screenY];

    if(!beganLoad){
        loadImageURLs();
        beganLoad = true;
    }
}

function inputMove(event) {
    if(!inputting)
        return;

    event.preventDefault();

    let screenX = isMobile ? event.changedTouches[0].clientX : event.x;
    let screenY = isMobile ? event.changedTouches[0].clientY : event.y;

    //topText.element.text = "tap: " + tapPosVal + "\nhold: " + holdPosVal;

    //currViewerID = Math.abs(Math.trunc((tapPosVal.x * vSens) - (holdPosVal.x * vSens)) % 15);
    //currViewerID = Math.abs((previousViewerID + Math.trunc((tapPosVal.x * vSens) - (holdPosVal.x * vSens))) % 15);
    holdPosVal = [screenX, screenY];
    currViewerID = Math.abs(mod(previousViewerID + Math.trunc((tapPosVal[0] * vSens) - (holdPosVal[0] * vSens)), 160));
    

    if(loadedPage)
        viewer();
}

function inputUp(event) {
    previousViewerID = currViewerID;
    inputting = false;

    if(loadedPage)
        console.log(imageList.length);
}



function viewer() {
    /*
    //topText.element.text = "ids: " + currViewerID;

    let offsetID = app.assets.find("img_1","texture").id;
    //topText.element.text = "offset: " + (offsetID - currViewerID);

    plane.render.material.colorMap = app.assets.get(offsetID - currViewerID).resource;
    plane.render.material.update();
    console.log('updating page');
    */

    //let end = currViewerID.toString().padStart(4,'0');
    //document.getElementById('splash-img').src = 'https://cfzcrwfmlxquedvdajiw.supabase.co/storage/v1/object/public/main-pages/Page_1_Main_'+ end +'.webp';
    //setTimeout(viewer, 1000);

    //let canv = document.getElementById('myCanvas');
    
    let canv = document.getElementById('myCanvas', { willReadFrequently: true });
    let ctx = canv.getContext("2d");
    //ctx.beginPath();
    //ctx.arc(95, 50, 40, 0, 2 * Math.PI);
    //ctx.stroke();
    
    let img = imageList[currViewerID][0];
    var hRatio = canv.width / img.width;
    var vRatio = canv.height / img.height;
    var ratio  = Math.min ( hRatio, vRatio );
    ctx.drawImage(img, 0,0, img.width, img.height, 0,0,img.width*ratio, img.height*ratio);
    
    let canv_2 = document.getElementById('blurCanvas', { willReadFrequently: true });
    let ctx_2 = canv_2.getContext("2d");

    ctx_2.drawImage(img, 0,0, img.width, img.height, 0,0,img.width*ratio, img.height*ratio);

    //ctx.drawImage(imageList[0],1,1);
    //console.log(imageList[0]);

};

function mod(n, m) {
    return ((n % m) + m) % m;
}

function loadRemoteImages() {
    topText.element.text = "Loading Remote Images";

    var remoteImages = [];
            
    for (let i = 1; i <= 40; i+=4) {
        let end = i.toString().padStart(4,'0');
        console.log(end);
        remoteImages.push(new pc.Asset("img_" + i, "texture", {
            url: _supabaseUrl + '/storage/v1/object/public/main-pages/Page_1_Main_' + end + '.webp'
        }));
    }
    var imageLoader = new pc.AssetListLoader(
        Object.values(remoteImages),
        app.assets
    );
    imageLoader.load(() => {
        loadedPage = true;
        plane.render.material.colorMap = app.assets.find("img_1","texture").resource;
        plane.render.material.update();

        console.log(app.assets);
    });
}

function loadImageURLs(){
    document.getElementById('myCanvas').style.display = 'block';
    document.getElementById('blurCanvas').style.display = 'block';

    for (let i = 1; i <= 160; i+=1) { //160
        let end = i.toString().padStart(4,'0');
        fetch(_supabaseUrl + '/storage/v1/object/public/main-pages/750/Page_1_Main_' + end + '.webp')
            .then(res => res.blob())
            .then(blob => {
                const file = new File([blob], i.toString(), {type: blob.type});
                
                var newImage = createImageBitmap(file).then(img => {
                    imageList.push([img, i]);
                    bmpOrder.push(i);
                    
                    console.log(i);

                    if(imageList.length == 160)
                        allImagesReady();
                });
            })
    }
    console.log("Finished Loading");
}

function allImagesReady(){
    document.getElementById('myCanvas').style.width = "100vw";
    document.getElementById('myCanvas').style.height = "auto";

    document.getElementById('blurCanvas').style.width = "100vw";
    document.getElementById('blurCanvas').style.height = "auto"; //125.06vw

    //imageList.sort(function(a,b){return parseInt(a.name)-parseInt(b.name)});
    /*
    imageList.sort((a, b) => {
        console.log(a[1]);
        return bmpOrder.indexOf(a[1]) - bmpOrder.indexOf(b[1]);
    });
    */
    imageList.sort((a, b) => {
        if(a[1] > b[1])
            return 1;
        if(a[1] < b[1])
            return -1;
        return 0;
    });
    
    console.log(imageList[0]);
    loadedPage = true;
    viewer();
    
    //dlOffset++;
    //loadButton.button.active = true;
}
