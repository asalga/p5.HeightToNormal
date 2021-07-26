(function () {
    // let p5 = typeof window.p5 === typeof undefined ? require('p5') : window.p5;
    let p5 = window.p5;

    let vert = `
#ifdef GL_ES
	precision highp float;
	precision mediump int;
#endif

attribute vec3 aPosition;
attribute vec2 aTexCoord;
attribute vec4 aVertexColor;
attribute vec3 aNormal;

varying vec3 var_vertPos;
varying vec2 var_vertTexCoord;
varying vec4 var_vertCol;
varying vec3 var_vertNormal;

uniform mat4 uModelViewMatrix;
uniform mat4 uProjectionMatrix;
uniform mat3 uNormalMatrix;

void main() {
	gl_Position = uProjectionMatrix * uModelViewMatrix * vec4(aPosition, 1.0 );
	var_vertPos = aPosition;
	var_vertTexCoord = aTexCoord;
    var_vertCol = aVertexColor;
	var_vertNormal = aNormal;
}
`;

    let frag = `
#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 res;
uniform sampler2D tex;
uniform float level;
uniform float strength;

float sampleTex(sampler2D tex, vec2 uv){
    // texture space
    vec2 test = vec2(uv.x / float(res.x), uv.y / float(res.y));
    return texture2D(tex, test).r;
}

vec3 sobel(sampler2D tex, vec2 uv){

    vec3 s = vec3(texture2D(tex, uv));

    // image space
    float x = uv.x * float(res.x);
    float y = uv.y * float(res.y);

    float tl = sampleTex(tex, vec2(x - 1.0, y - 1.0));
    float ml = sampleTex(tex, vec2(x - 1.0, y + 0.0));
    float bl = sampleTex(tex, vec2(x - 1.0, y + 1.0));
    float tc = sampleTex(tex, vec2(x + 0.0, y - 1.0));

    float bc = sampleTex(tex, vec2(x + 0.0, y + 1.0));
    float tr = sampleTex(tex, vec2(x + 1.0, y - 1.0));
    float mr = sampleTex(tex, vec2(x + 1.0, y + 0.0));
    float br = sampleTex(tex, vec2(x + 1.0, y + 1.0));

    float dx = (tr + (2.0 * mr) + br) - (tl + (2.0 * ml) + bl);
    float dy = (bl + (2.0 * bc) + br) - (tl + (2.0 * tc) + tr);

    float z = (1.0 / strength) * (1.0 + pow(2.0, level));

    return vec3(dx, dy, z);
}

void main(){
	vec2 uv = vec2(gl_FragCoord.xy) / res;
	
	uv.y = 1.0 - uv.y;
    
    vec4 col = vec4(sobel(tex, uv), texture2D(tex, uv).a);
    vec3 n = vec3(col.r * 255.0, col.g * 255.0, col.b * 1.0);
    n = normalize(n);
    
    // remap -1..1 to 0..1
	gl_FragColor = vec4(n.rg * 0.5 + 0.5, n.b, col.a);
}`;

    p5.prototype.HeightToNormal = function (w, h) {

        let _p, renderer, sh;

        new p5(p => {
            p.setup = _ => {
                _p = p;
                renderer = _p.createCanvas(w, h, _p.WEBGL);
                _p.pixelDensity(1);

                // don't pollute the DOM
                renderer.canvas.style.display = 'none';

                sh = new p5.Shader(_p._renderer, vert, frag);
                _p.shader(sh);
                _p.ortho();
                _p.translate(-_p.width / 2, -_p.height / 2, 0);
            }
        });
        /*
            strength -  strength of the normal
                        values closer to 0 will make z component of vectors
                        have more influence pointing 'outwards'
                        typical values: 0.001 - 10
            level - typical values: 5 - 7
        */
        this.get = function (tex, strength = 2, level = 7) {
            sh.setUniform('tex', tex);
            sh.setUniform('res', [tex.width, tex.height]);
            sh.setUniform('strength', strength);
            sh.setUniform('level', level);
            _p.rect(0, 0, _p.width, _p.height, 1, 1);
            return renderer;
        }
    }
})();