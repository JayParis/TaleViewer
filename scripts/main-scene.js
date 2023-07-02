var MainScene = pc.createScript('Main-Scene-Script');

let dlOffset = 1;

MainScene.attributes.add('speed', { 
    type: 'number', default: 10 
});

MainScene.prototype.initialize = function() {
    
    plane.addComponent('render', {
        type: 'plane'
    });
    app.root.addChild(plane);
    plane.setEulerAngles(90,0,0);
    
    var testMat = new pc.BasicMaterial();
    //testMat.color.set(0.76,1,0.915);
    testMat.colorMap = assets.testTexture.resource;
    plane.render.material = testMat;//model mat
    
    /*

    var shaderDefinition = {
        attributes: {
            aPosition: pc.SEMANTIC_POSITION,
            aUv0: pc.SEMANTIC_TEXCOORD0
        },
        vshader: assets.vs.resource,
        fshader: assets.fs.resource
    };
    
    var newShader = new pc.Shader(device, shaderDefinition);
    //console.log(plane.render.meshInstances[0].material);
    plane.render.meshInstances[0].material = new pc.Material();
    plane.render.meshInstances[0].material.blendType = pc.BLEND_NORMAL;
    plane.render.meshInstances[0].material.shader = newShader;
    plane.render.meshInstances[0].material.setParameter('uDiffuseMap', assets.testTexture.resource);

    */

    topText.addComponent('element', {
        pivot: new pc.Vec2(0.5, 0.5),
        anchor: new pc.Vec4(0.5, 1, 0.5, 1),
        type: pc.ELEMENTTYPE_TEXT,
        font: assets.bpFont.resource,
        fontSize: 22,
        text: "Tale Viewer",
        color: [0.01,0.01,0.01],
        alignment: [0.5,0.5],
    });
    uiGroup.addChild(topText);
    topText.setLocalPosition(0,-105,0);


    loadButton.addComponent('element', {
        type: pc.ELEMENTTYPE_IMAGE,
        anchor: new pc.Vec4(1.0, 0.0, 1.0, 0.0),
        width: 225,
        height: 100,
        //margin: new pc.Vec4(0.0, 0.0, 0.0, 0.0),
        pivot: new pc.Vec2(0.5, 0.5), 
        useInput: true,
    });
    uiGroup.addChild(loadButton);
    loadButton.setLocalPosition(-145,145,0);
    loadButton.addComponent('button', {
        imageEntity: loadButton,
    });
    loadButton.button.on('click', function(evt){
        console.log("Button pressed");
        //loadRemoteImages();
        loadImageURLs();
        loadButton.button.active = false;
    });



    const light = new pc.Entity('light');
    light.addComponent('light');
    app.root.addChild(light);
    light.setEulerAngles(45, 0, 0);
    
    //app.on('update', dt => plane.rotate(50 * dt, 60 * dt, 70 * dt));

    //Device resize and orientation listeners
    window.addEventListener('resize', () => this.resizeMobile());
    window.addEventListener('orientationchange', () => this.resizeMobile());

    this.resizeMobile();

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

    const onKeyDown = function (e) {
        if (e.key === pc.KEY_F) {
            console.log("Loading Remote Images");
            //loadRemoteImages();
            
            //loadImageURLs();
            
            //loadedPage = false;
        }
        if (e.key === pc.KEY_T) {
            allImagesReady();
        }
        if(e.key === pc.KEY_1){
            plane.render.material.colorMap = app.assets.find("img_1","texture").resource;
			plane.render.material.update();
        }
        if(e.key === pc.KEY_2){
            plane.render.material.colorMap = app.assets.find("img_2","texture").resource;
			plane.render.material.update();
        }
        if(e.key === pc.KEY_3){
            plane.render.material.colorMap = app.assets.find("img_3","texture").resource;
			plane.render.material.update();
        }
        if(e.key === pc.KEY_4){
            plane.render.material.colorMap = app.assets.find("img_4","texture").resource;
			plane.render.material.update();
        }
        if(e.key === pc.KEY_5){
            plane.render.material.colorMap = app.assets.find("img_5","texture").resource;
			plane.render.material.update();
        }
        if(e.key === pc.KEY_6){
            plane.render.material.colorMap = app.assets.find("img_6","texture").resource;
			plane.render.material.update();
        }
        e.event.preventDefault(); // Use original browser event to prevent browser action.
    };
    app.keyboard.on("keydown", onKeyDown, this);
    
};

MainScene.prototype.inputDown = function(event) {
    let screenX = app.touch ? event.touches[0].x : event.x;
    let screenY = app.touch ? event.touches[0].y : event.y;

    tapPosVal = camera.camera.screenToWorld(screenX,screenY,1);
    tapPos.setPosition(tapPosVal);
    holdPos.setPosition(tapPos);

    inputting = true;
}

MainScene.prototype.inputMove = function(event) {
    if(!inputting)
        return;

    let screenX = app.touch ? event.touches[0].x : event.x;
    let screenY = app.touch ? event.touches[0].y : event.y;

    holdPosVal = camera.camera.screenToWorld(screenX,screenY,1);
    holdPos.setPosition(holdPosVal);

    //topText.element.text = "tap: " + tapPosVal + "\nhold: " + holdPosVal;

    //currViewerID = Math.abs(Math.trunc((tapPosVal.x * vSens) - (holdPosVal.x * vSens)) % 15);
    //currViewerID = Math.abs((previousViewerID + Math.trunc((tapPosVal.x * vSens) - (holdPosVal.x * vSens))) % 15);
    currViewerID = Math.abs(mod(previousViewerID + Math.trunc((tapPosVal.x * vSens) - (holdPosVal.x * vSens)), 40));
    
    if(loadedPage)
        viewer();

}

MainScene.prototype.inputUp = function(event) {
    previousViewerID = currViewerID;
    inputting = false;

    if(loadedPage){
        console.log(imageList[0]);
    }
}


MainScene.prototype.update = function(dt) {

};

MainScene.prototype.swap = function(old) {

};

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
    
    let img = imageList[currViewerID];
    var hRatio = canv.width / img.width;
    var vRatio = canv.height / img.height;
    var ratio  = Math.min ( hRatio, vRatio );
    ctx.drawImage(img, 0,0, img.width, img.height, 0,0,img.width*ratio, img.height*ratio);

    //ctx.drawImage(imageList[0],1,1);
    //console.log(imageList[0]);

};

MainScene.prototype.resizeMobile = function() {

    let appHeight = document.getElementById('application').offsetHeight;
    let appWidth = document.getElementById('application').offsetWidth;

    let scale = camera.camera.orthoHeight * (appWidth / appHeight) * 2;

    plane.setLocalScale(scale,1,scale * 1.25066);
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

    for (let i = dlOffset; i <= 160; i+=1) { //160
        let end = i.toString().padStart(4,'0');
        fetch(_supabaseUrl + '/storage/v1/object/public/main-pages/750/Page_1_Main_' + end + '.webp')
            .then(res => res.blob())
            .then(blob => {
                const file = new File([blob], i.toString(), {type: blob.type});
                console.log(file);
                
                var newImage = createImageBitmap(file).then(img => {
                    imageList.push(img);
                    if(imageList.length == 160)
                        allImagesReady();
                });
                
            })
    }
    loadedPage = true;
    console.log("Finished Loading");
}

function allImagesReady(){
    document.getElementById('myCanvas').style.width = "100vw";
    document.getElementById('myCanvas').style.height = "auto";

    //imageList.sort(function(a,b){return parseInt(a.name)-parseInt(b.name)});
    imageList.sort((a, b) => {
        return a.name - b.name;
    });
    console.log(imageList[0]);
    
    //dlOffset++;
    //loadButton.button.active = true;
}
