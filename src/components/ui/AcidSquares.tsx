import React, { useEffect, useRef } from 'react';
import { Renderer, Program, Mesh, Triangle, Color } from 'ogl';

interface AcidSquaresProps {
  color1?: string;
  color2?: string;
  color3?: string;
  detail?: 'low' | 'medium' | 'high';
  speed?: number;
  waveDepth?: number;
  zoom?: number;
  density?: number;
  glow?: number;
  exposure?: number;
  spread?: number;
  stepSize?: number;
  colorShift?: number;
  contrast?: number;
  brightness?: number;
  opacity?: number;
  mouseInteraction?: boolean;
  mouseStrength?: number;
  mouseRadius?: number;
  blur?: number;
  grain?: boolean;
  grainIntensity?: number;
  className?: string;
  style?: React.CSSProperties;
}

export const AcidSquares: React.FC<AcidSquaresProps> = ({
  color1 = "#5227FF",
  color2 = "#A855F7",
  color3 = "#FFFFFF",
  detail = "medium",
  speed = 0.7,
  waveDepth = 1.0,
  zoom = 1.3,
  density = 10,
  glow = 1.0,
  exposure = 2700,
  spread = 0.3,
  stepSize = 0.002,
  colorShift = 0.0,
  contrast = 1.0,
  brightness = 1.0,
  opacity = 1.0,
  mouseInteraction = true,
  mouseStrength = 0.1,
  mouseRadius = 0.35,
  blur = 0,
  grain = true,
  grainIntensity = 0.05,
  className = "",
  style,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const mousePos = useRef({ x: 0.5, y: 0.5 });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const renderer = new Renderer({
      alpha: true,
      antialias: true,
      dpr: Math.min(window.devicePixelRatio || 1, 2),
    });

    const gl = renderer.gl;
    const canvas = gl.canvas;
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.display = 'block';
    canvas.style.position = 'absolute';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.pointerEvents = 'none';

    container.appendChild(canvas);

    const geometry = new Triangle(gl);

    const vertexShader = /* glsl */ `
      attribute vec2 uv;
      attribute vec2 position;
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = vec4(position, 0.0, 1.0);
      }
    `;

    const fragmentShader = /* glsl */ `
      precision highp float;
      uniform float uTime;
      uniform vec2 uResolution;
      uniform vec2 uMouse;
      uniform vec3 uColor1;
      uniform vec3 uColor2;
      uniform vec3 uColor3;
      uniform float uSpeed;
      uniform float uWaveDepth;
      uniform float uZoom;
      uniform float uDensity;
      uniform float uGlow;
      uniform float uSpread;
      uniform float uStepSize;
      uniform float uColorShift;
      uniform float uContrast;
      uniform float uBrightness;
      uniform float uOpacity;
      uniform float uMouseStrength;
      uniform float uMouseRadius;
      uniform bool uMouseInteraction;
      uniform bool uGrain;
      uniform float uGrainIntensity;
      varying vec2 vUv;

      float random(vec2 st) {
        return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
      }

      void main() {
        vec2 st = (vUv - 0.5) * uZoom;
        st.x *= uResolution.x / uResolution.y;

        if (uMouseInteraction) {
          vec2 mouseSt = (uMouse - 0.5) * uZoom;
          mouseSt.x *= uResolution.x / uResolution.y;
          float dist = length(st - mouseSt);
          if (dist < uMouseRadius) {
            float force = (1.0 - dist / uMouseRadius) * uMouseStrength;
            st += normalize(st - mouseSt + vec2(0.0001)) * force;
          }
        }

        float t = uTime * uSpeed;
        vec2 grid = floor(st * uDensity);
        vec2 pos = fract(st * uDensity);

        float wave = sin(dot(grid, vec2(0.5, 0.8)) + t * uWaveDepth) * 0.5 + 0.5;
        
        vec3 color = mix(uColor1, uColor2, wave * uSpread);
        color = mix(color, uColor3, pow(wave, uGlow + 1.0) * (0.3 + uColorShift));

        float edge = min(min(pos.x, 1.0 - pos.x), min(pos.y, 1.0 - pos.y));
        float squarePattern = smoothstep(uStepSize, uStepSize + 0.05, edge);

        color *= (squarePattern * 0.5 + 0.5);
        color = (color - 0.5) * uContrast + 0.5 + (uBrightness - 1.0);

        if (uGrain) {
          float noise = (random(vUv + uTime) - 0.5) * uGrainIntensity;
          color += noise;
        }

        gl_FragColor = vec4(color, uOpacity);
      }
    `;

    const program = new Program(gl, {
      vertex: vertexShader,
      fragment: fragmentShader,
      uniforms: {
        uTime: { value: 0 },
        uResolution: { value: [container.clientWidth, container.clientHeight] },
        uMouse: { value: [0.5, 0.5] },
        uColor1: { value: new Color(color1) },
        uColor2: { value: new Color(color2) },
        uColor3: { value: new Color(color3) },
        uSpeed: { value: speed },
        uWaveDepth: { value: waveDepth },
        uZoom: { value: zoom },
        uDensity: { value: density },
        uGlow: { value: glow },
        uSpread: { value: spread },
        uStepSize: { value: stepSize },
        uColorShift: { value: colorShift },
        uContrast: { value: contrast },
        uBrightness: { value: brightness },
        uOpacity: { value: opacity },
        uMouseStrength: { value: mouseStrength },
        uMouseRadius: { value: mouseRadius },
        uMouseInteraction: { value: mouseInteraction },
        uGrain: { value: grain },
        uGrainIntensity: { value: grainIntensity },
      },
    });

    const mesh = new Mesh(gl, { geometry, program });

    const resize = () => {
      if (!container) return;
      const width = container.clientWidth || window.innerWidth;
      const height = container.clientHeight || 400;
      renderer.setSize(width, height);
      program.uniforms.uResolution.value = [width, height];
    };

    window.addEventListener('resize', resize);
    resize();

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = 1.0 - (e.clientY - rect.top) / rect.height;
      mousePos.current = { x, y };
      program.uniforms.uMouse.value = [x, y];
    };

    if (mouseInteraction) {
      window.addEventListener('mousemove', handleMouseMove);
    }

    let animationId: number;
    const update = (t: number) => {
      animationId = requestAnimationFrame(update);
      program.uniforms.uTime.value = t * 0.001;
      renderer.render({ scene: mesh });
    };

    animationId = requestAnimationFrame(update);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resize);
      if (mouseInteraction) {
        window.removeEventListener('mousemove', handleMouseMove);
      }
      if (canvas.parentNode) {
        canvas.parentNode.removeChild(canvas);
      }
      gl.getExtension('WEBGL_lose_context')?.loseContext();
    };
  }, [
    color1,
    color2,
    color3,
    speed,
    waveDepth,
    zoom,
    density,
    glow,
    spread,
    stepSize,
    colorShift,
    contrast,
    brightness,
    opacity,
    mouseInteraction,
    mouseStrength,
    mouseRadius,
    grain,
    grainIntensity,
  ]);

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-full overflow-hidden ${className}`}
      style={{ filter: blur > 0 ? `blur(${blur}px)` : undefined, ...style }}
    />
  );
};

export default AcidSquares;
