precision mediump float;

uniform sampler2D tileTexture;

varying vec2 vUv;
uniform vec2 u_resolution;
uniform float u_time;

const float PI = 3.1415926535897932384626433832795;
const float TAU = PI * 2.;


float smoothMod(float x, float y, float e){
  float top = cos(PI * (x/y)) * sin(PI * (x/y));
  float bot = pow(sin(PI * (x/y)),2.);
  float at = atan(top/bot);
  return y * (1./2.) - (1./PI) * at ;
}

vec2 modPolar(vec2 p, float repetitions) {
    float angle = 2.*3.14/repetitions;
    float a = atan(p.y, p.x) + angle/2.;
    float r = length(p);
    //float c = floor(a/angle);
    a = smoothMod(a,angle,033323231231561.9) - angle/2.;
    //a = mix(a,)
    vec2 p2 = vec2(cos(a), sin(a))*r;
    return p2;
}

void coswarp(inout vec3 trip, float warpsScale ){

  float t = u_time;

  trip.xyz += warpsScale * .1 * cos(3. * trip.yzx + (t * .25));
  trip.xyz += warpsScale * .05 * cos(11. * trip.yzx + (t * .25));
  trip.xyz += warpsScale * .025 * cos(17. * trip.yzx + (t * .25));

}


void main() {
	vec2 uv = vUv * vec2( (sin(u_time *.15)) , tan(u_time*.05) );
  float t = (u_time * .5) + length(uv-.5);
	vec4 texture = texture2D(tileTexture, uv);
 // float decoded_texture = DecodeRangeV4(texture, 0., 1.);
//  vec3 color = EncodeExpV3(decoded_texture);

//    coswarp(color, 3.);
//     coswarp(color, 3.);
    gl_FragColor = texture;
    }
