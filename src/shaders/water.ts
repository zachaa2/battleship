import k from '../kaplayCtx'

export default function loadWaterShader() {
    k.loadShader(
        'water',
        null,
        `
uniform float u_time;
uniform float u_scale;
uniform float u_speed;
uniform float u_pixelSize;
uniform vec2 u_resolution;

// ------------------------------------
// Hash / value noise
// ------------------------------------

float hash21(vec2 p) {
    return fract(
        sin(dot(p, vec2(127.1, 311.7)))
        * 43758.5453
    );
}

float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);

    f = f * f * (3.0 - 2.0 * f);

    float a = hash21(i);
    float b = hash21(i + vec2(1.0, 0.0));
    float c = hash21(i + vec2(0.0, 1.0));
    float d = hash21(i + vec2(1.0, 1.0));

    return mix(
        mix(a, b, f.x),
        mix(c, d, f.x),
        f.y
    );
}

// ------------------------------------
// Fractal Brownian Motion
// ------------------------------------

float fbm(vec2 p) {
    float value = 0.0;
    float amplitude = 0.5;

    for (int i = 0; i < 4; i++) {
        value += amplitude * noise(p);

        p = p * 2.02 + vec2(17.1, 9.2);
        amplitude *= 0.5;
    }

    return value / 0.9375;
}

// ------------------------------------
// Subtle Voronoi irregularity
// ------------------------------------

float voronoi(vec2 p) {
    vec2 cell = floor(p);
    vec2 local = fract(p);

    float nearest = 100.0;

    for (int y = -1; y <= 1; y++) {
        for (int x = -1; x <= 1; x++) {
            vec2 offset = vec2(float(x), float(y));
            vec2 id = cell + offset;

            vec2 point = offset + vec2(
                hash21(id),
                hash21(id + 37.4)
            );

            vec2 delta = point - local;

            nearest = min(
                nearest,
                dot(delta, delta)
            );
        }
    }

    return sqrt(nearest);
}

// ------------------------------------
// Fragment shader
// ------------------------------------

vec4 frag(
    vec2 pos,
    vec2 uv,
    vec4 color,
    sampler2D tex
) {
    float t = u_time * u_speed;

    // Pixel grid
    vec2 pixelCoord = (
        floor(gl_FragCoord.xy / u_pixelSize)
        + 0.5
    ) * u_pixelSize;

    vec2 p = (
        pixelCoord / u_resolution.y
    ) * u_scale;

    // --------------------------------
    // 1. Gentle overall water drift
    // --------------------------------

    vec2 drift = vec2(
        -t * 0.07,
         t * 0.025
    );

    vec2 q = p + drift;

    // --------------------------------
    // 2. Two independently moving
    //    distortion fields
    // --------------------------------

    float warpX = fbm(
        q * 0.55
        + vec2(t * 0.30, -t * 0.13)
        + vec2(2.7, 8.1)
    );

    float warpY = fbm(
        q * 0.55
        + vec2(-t * 0.17, t * 0.26)
        + vec2(9.2, 1.4)
    );

    vec2 warp = vec2(
        warpX - 0.5,
        warpY - 0.5
    );

    // Moving distortion changes the
    // shape of the water over time.
    vec2 w = q + warp * 1.25;

    // --------------------------------
    // 3. Secondary flowing distortion
    // --------------------------------

    float secondaryWarp = fbm(
        w * 0.85
        + vec2(-t * 0.12, t * 0.19)
        + vec2(4.3, 7.8)
    );

    w += vec2(
        secondaryWarp - 0.5,
        -(secondaryWarp - 0.5)
    ) * 0.35;

    // --------------------------------
    // 4. Voronoi adds irregularity
    //    without visible cell borders
    // --------------------------------

    float cells = voronoi(
        w * 1.35 + vec2(5.3, 2.1)
    );

    float distortion = (cells - 0.5) * 0.18;

    // --------------------------------
    // 5. Evolving wave noise
    // --------------------------------

    float waveNoise = fbm(
        w * 0.85
        + vec2(t * 0.11, -t * 0.16)
        + vec2(3.7, 7.2)
    );

    // --------------------------------
    // 6. Traveling wave crests
    // --------------------------------

    float wave1 = sin(
        w.x * 2.8
        + w.y * 0.85
        + waveNoise * 4.0
        + distortion
        - t * 1.15
    );

    float wave2 = sin(
        w.x * 1.45
        - w.y * 2.35
        + waveNoise * 3.2
        - distortion
        + t * 0.85
    );

    float crest1 = smoothstep(
        0.89, 0.97, wave1
    );

    float crest2 = smoothstep(
        0.94, 0.99, wave2
    );

    // --------------------------------
    // 7. Independently moving breakup
    //    makes reflections appear
    //    and disappear
    // --------------------------------

    float breakup = fbm(
        w * 1.45
        + vec2(-t * 0.19, t * 0.12)
        + vec2(12.3, 4.6)
    );

    float mask = smoothstep(
        0.37,
        0.73,
        breakup + distortion * 0.3
    );

    float highlights = (
        crest1 * 0.75
        + crest2 * 0.30
    ) * mask;

    highlights = clamp(
        highlights,
        0.0,
        1.0
    );

    // --------------------------------
    // 8. Slowly morphing background
    // --------------------------------

    float backgroundNoise = fbm(
        q * 0.75
        + warp * 0.85
        + vec2(t * 0.09, -t * 0.06)
    );

    float detailNoise = fbm(
        w * 1.65
        + vec2(-t * 0.08, t * 0.10)
        + vec2(6.1, 3.4)
    );

    float variation = clamp(
        backgroundNoise * 0.8
        + detailNoise * 0.2,
        0.0,
        1.0
    );

    variation = 0.5 + (variation - 0.5) * 0.7;

    // --------------------------------
    // 9. Water palette
    // --------------------------------

    vec3 darkWater = vec3(0.020, 0.090, 0.165);
    vec3 midWater = vec3(0.030, 0.120, 0.200);
    vec3 lightWater = vec3(0.045, 0.150, 0.235);

    vec3 highlightColor = vec3(0.42, 0.62, 0.70);

    vec3 water = mix(
        darkWater,
        midWater,
        smoothstep(0.24, 0.65, variation)
    );

    water = mix(
        water,
        lightWater,
        smoothstep(0.55, 0.85, variation) * 0.2
    );

    // --------------------------------
    // 10. Animated reflections
    // --------------------------------

    water = mix(
        water,
        highlightColor,
        highlights * 0.48
    );

    return vec4(water, 1.0);
}
`
    )
}
