var MainScene = pc.createScript('Main-Scene-Script');

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

    const topText = new pc.Entity('toptext');
    topText.addComponent('element', {
        pivot: new pc.Vec2(0.5, 0.5),
        anchor: new pc.Vec4(0.5, 1, 0.5, 1),
        type: pc.ELEMENTTYPE_TEXT,
        font: assets.bpFont.resource,
        fontSize: 52,
        text: "Tale Viewer",
        color: [0.01,0.01,0.01],
        alignment: [0.5,0.5],
    });
    uiGroup.addChild(topText);
    topText.setLocalPosition(0,-105,0);


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
            var remoteImages = [];
            
            for (let i = 1; i <= 6; i++) {
                //srcUrls.push(_supabaseUrl + '/storage/v1/object/public/main-pages/Page_1_Main_000' + i + '.webp');
                remoteImages.push(new pc.Asset("img_" + i, "texture", {
                    url: _supabaseUrl + '/storage/v1/object/public/main-pages/Page_1_Main_000' + i + '.webp'
                }));
            }
            var imageLoader = new pc.AssetListLoader(
                Object.values(remoteImages),
                app.assets
            );
            imageLoader.load(() => {
                console.log(app.assets);
            });
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
    //tapPos.translate(0,1,0);
}

MainScene.prototype.inputMove = function(event) {
    let screenX = app.touch ? event.touches[0].x : event.x;
    let screenY = app.touch ? event.touches[0].y : event.y;

    tapPos.setPosition(camera.camera.screenToWorld(screenX,screenY,1));
}

MainScene.prototype.inputUp = function(event) {
    
}


MainScene.prototype.update = function(dt) {

};

MainScene.prototype.swap = function(old) {

};

MainScene.prototype.resizeMobile = function() {

    let appHeight = document.getElementById('application').offsetHeight;
    let appWidth = document.getElementById('application').offsetWidth;

    let scale = camera.camera.orthoHeight * (appWidth / appHeight) * 2;

    plane.setLocalScale(scale,1,scale * 1.25066);
};