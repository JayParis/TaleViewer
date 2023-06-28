precision highp float;
varying vec2 vUv0;

uniform sampler2D uDiffuseMap;

void main(void)
{
	const float Pi = 6.28318530718; // Pi*2
    
    const float Directions = 16.0; // BLUR DIRECTIONS (Default 16.0 - More is better but slower)
    const float Quality = 4.0; // BLUR QUALITY (Default 4.0 - More is better but slower)
   
    //float Radius = mix(0.0, 0.025, vUv0.y); //0.025
    float Radius = 0.025; //0.025

    
    vec4 Color = vec4(0);
    
    for(float d = 0.0; d<Pi; d += Pi/Directions)
    {
		for(float i = 1.0 / Quality; i <= 1.001; i += 1.0 / Quality)
        {
			Color += texture2D(uDiffuseMap, vUv0 + vec2(cos(d),sin(d))*Radius*i);		
        }
    }
    
    Color /= Quality * Directions + 1.0;

	gl_FragColor = vec4(Color.xyz, 1.0);
}

