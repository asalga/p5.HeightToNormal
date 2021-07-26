# p5.HeightToNormal
Convert a height map to a normal map

<img src="img.png" width="200"/>

## Usage
```js
 new p5(p => {
    let gfx, h2n;

    p.setup = _ => {
        p.createCanvas(500, 500);
        p.background(0);

        gfx = p.createGraphics(p.width, p.height);
        h2n = new p.HeightToNormal(p.width, p.height);
    }

    p.draw = _ => {
        gfx.push();
        gfx.strokeWeight(3);
        gfx.stroke(100);
        gfx.fill(255);
        gfx.ellipse(p.mouseX, p.mouseY, 150);
        gfx.pop();

        /*
            last two arguments are optional
            strength -  Strength of the normal. Values closer 
                        to 0 will make z component of vectors
                        have more influence pointing 'outwards'.
                        Typical values: 0.001 - 10
                        Default value is 2.

            level - Typical values: 5 - 7.
                    Larger values will make the z component of the normal 
                    vector have a stronger influence.
                    Default value is 7.
        */
        let normalMap = h2n.get(gfx, 2, 7);
        p.image(normalMap, 0, 0);
    }

    p.mousePressed = _ => {
        gfx.filter(p.BLUR, 1);
    }
});
```

# Development
$ npm run start

# Build
$ npm run build
