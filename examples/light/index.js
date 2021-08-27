/*
    Real time normal mapping in p5.js
*/

let h2n;
let heightmap;
let normalmap;
let sh;

function preload() {
    heightmap = loadImage('heightmap-face.png');
}

function setup() {
    createCanvas(heightmap.width, heightmap.height, WEBGL);
    pixelDensity(1);

    h2n = new HeightToNormal(heightmap.width, heightmap.height);
    normalmap = h2n.get(heightmap);

    sh = new p5.Shader(this._renderer, normalVert, normalFrag);
}

function draw() {
    shader(sh);
    sh.setUniform('resolution', [width, height]);
    sh.setUniform('cursor', [mouseX, mouseY, 1]);
    sh.setUniform('normalmap', normalmap);
    sh.setUniform('specColor', [mouseX / width, mouseY / height, 0]);

    rect(-width / 2, -height / 2, width, height, 1, 1);
}
