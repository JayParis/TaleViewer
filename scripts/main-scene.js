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
    testMat.color.set(0.76,1,0.915);
    testMat.colorMap = assets.testTexture.resource;
    plane.render.material = testMat;//model mat


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
    
    //app.on('update', dt => plane.rotate(10 * dt, 20 * dt, 10 * dt));

    //Device resize and orientation listeners
    //window.addEventListener('resize', () => this.resizeMethod());
    //window.addEventListener('orientationchange', () => this.resizeMethod());

    this.resizeMobile();
};

MainScene.prototype.update = function(dt) {

};

MainScene.prototype.swap = function(old) {

};

MainScene.prototype.resizeMobile = function() {

    let appHeight = document.getElementById('application').offsetHeight;
    let appWidth = document.getElementById('application').offsetWidth;

    let scale = camera.camera.orthoHeight * (appWidth / appHeight) * 2;

    plane.setLocalScale(scale,1,scale);
    //plane.setLocalScale(2,1,2);

    console.log("ResizeMobile: " + camera.camera.orthoHeight);
};