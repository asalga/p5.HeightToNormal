!function(){let e=window.p5;e.prototype.HeightToNormal=function(t,n){let r,o,a;new e((l=>{l.setup=v=>{r=l,o=r.createCanvas(t,n,r.WEBGL),o.canvas.style.display="none",a=new e.Shader(r._renderer,"\n#ifdef GL_ES\n\tprecision highp float;\n\tprecision mediump int;\n#endif\n\nattribute vec3 aPosition;\nattribute vec2 aTexCoord;\nattribute vec4 aVertexColor;\nattribute vec3 aNormal;\n\nvarying vec3 var_vertPos;\nvarying vec2 var_vertTexCoord;\nvarying vec4 var_vertCol;\nvarying vec3 var_vertNormal;\n\nuniform mat4 uModelViewMatrix;\nuniform mat4 uProjectionMatrix;\nuniform mat3 uNormalMatrix;\n\nvoid main() {\n\tgl_Position = uProjectionMatrix * uModelViewMatrix * vec4(aPosition, 1.0 );\n\tvar_vertPos = aPosition;\n\tvar_vertTexCoord = aTexCoord;\n    var_vertCol = aVertexColor;\n\tvar_vertNormal = aNormal;\n}\n","\n#ifdef GL_ES\nprecision mediump float;\n#endif\n\nuniform vec2 res;\nuniform sampler2D tex;\nuniform float level;\nuniform float strength;\n\nfloat sampleTex(sampler2D tex, vec2 uv){\n    // texture space\n    vec2 test = vec2(uv.x / float(res.x), uv.y / float(res.y));\n    return texture2D(tex, test).r;\n}\n\nvec3 sobel(sampler2D tex, vec2 uv){\n\n    vec3 s = vec3(texture2D(tex, uv));\n\n    // image space\n    float x = uv.x * float(res.x);\n    float y = uv.y * float(res.y);\n\n    float tl = sampleTex(tex, vec2(x - 1.0, y - 1.0));\n    float ml = sampleTex(tex, vec2(x - 1.0, y + 0.0));\n    float bl = sampleTex(tex, vec2(x - 1.0, y + 1.0));\n    float tc = sampleTex(tex, vec2(x + 0.0, y - 1.0));\n\n    float bc = sampleTex(tex, vec2(x + 0.0, y + 1.0));\n    float tr = sampleTex(tex, vec2(x + 1.0, y - 1.0));\n    float mr = sampleTex(tex, vec2(x + 1.0, y + 0.0));\n    float br = sampleTex(tex, vec2(x + 1.0, y + 1.0));\n\n    float dx = (tr + (2.0 * mr) + br) - (tl + (2.0 * ml) + bl);\n    float dy = (bl + (2.0 * bc) + br) - (tl + (2.0 * tc) + tr);\n\n    float z = (1.0 / strength) * (1.0 + pow(2.0, level));\n\n    return vec3(dx, dy, z);\n}\n\nvoid main(){\n\tvec2 uv = vec2(gl_FragCoord.xy) / res;\n\t\n\tuv.y = 1.0 - uv.y;\n    \n    vec4 col = vec4(sobel(tex, uv), texture2D(tex, uv).a);\n    vec3 n = vec3(col.r * 255.0, col.g * 255.0, col.b * 1.0);\n    n = normalize(n);\n    \n    // remap -1..1 to 0..1\n\tgl_FragColor = vec4(n.rg * 0.5 + 0.5, n.b, col.a);\n}"),r.shader(a),r.ortho(),r.translate(-r.width/2,-r.height/2,0)}})),this.get=function(e,t=2,n=7){return a.setUniform("tex",e),a.setUniform("res",[e.width,e.height]),a.setUniform("strength",t),a.setUniform("level",n),r.rect(0,0,r.width,r.height,1,1),o}}}();