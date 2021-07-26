let normalFrag = `
#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 resolution;
uniform vec3 cursor;
uniform vec3 specColor;
uniform sampler2D normalmap;

void main(){
	vec2 uv = vec2(gl_FragCoord.xy) / resolution;
	uv.y = 1.0 - uv.y;

	vec2 p = vec2(gl_FragCoord);

	float mx = cursor.x - p.x;
	float my = resolution.y - cursor.y - p.y;
	float mz = resolution.x * 0.25;

	vec3 rayOfLight = normalize(vec3(mx, my, mz));
	vec3 normal = vec3(texture2D(normalmap, uv)) - 0.5;
	normal = normalize(normal);
	float nDotL = max(0.0, dot(rayOfLight, normal));
	
	vec3 reflection = normal * (2.0 * (nDotL)) - rayOfLight;
	float specIntensity = max(0.0, dot(reflection, vec3(0.0, 0.0, 1.0)));
	float specRaised = pow(specIntensity, 25.0);
	vec3 sColor = specRaised * specColor;

	vec3 col = vec3(nDotL * 0.5 + sColor);
	gl_FragColor = vec4(col, 1.0);
}`