/*
    Real time normal mapping in p5.js
*/

let h2n;
let normalmap;
let sh;
let gfx;

function setup() {
    createCanvas(500, 500, WEBGL);
    pixelDensity(1);

    gfx = createGraphics(width, height);
    gfx.background(0);

    gfx.fill(200, 100);
    gfx.textSize(150);
    gfx.textAlign(CENTER, CENTER);
    gfx.text('p5.js', width / 2, height / 2);

    gfx.noStroke(200, 10);
    gfx.fill(50, 5);

    h2n = new HeightToNormal(width, height);

    sh = new p5.Shader(this._renderer, normalVert, normalFrag);
}

function draw() {

    normalmap = h2n.get(gfx);

    shader(sh);
    sh.setUniform('resolution', [width, height]);
    sh.setUniform('cursor', [mouseX, mouseY, 1]);
    sh.setUniform('normalmap', normalmap);
    sh.setUniform('specColor', [mouseX / width, mouseY / height, 0]);

    rect(-width / 2, -height / 2, width, height, 1, 1);
}

function mousePressed() {
    gfx.filter(BLUR, 1);
}

function mouseDragged() {
    for (let i = 10; i > 0; i--) {
        gfx.ellipse(mouseX, mouseY, i * 3);
    }
}