import * as THREE from 'three';

export interface SilkBackgroundHandle { dispose: () => void; setColor: (c: string | number) => void; setSpeed: (s: number) => void; }

export interface SilkBackgroundOptions {
  cols?: number; rows?: number; spacing?: number; cameraZ?: number; interactive?: boolean;
  pointSize?: number; dotColor?: string | number; waveSpeed?: number; mouseIntensity?: number; mouseEase?: number;
}

export function initSilkBackground(canvas: HTMLCanvasElement, opts: SilkBackgroundOptions = {}): SilkBackgroundHandle {
  const { cols = 1000, rows = 75, spacing = 0.05, cameraZ = 7.5, interactive = true, pointSize = 1.0, dotColor = '#000', waveSpeed = 2, mouseIntensity = 1, mouseEase = 0.5 } = opts;

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: false, powerPreference: 'high-performance' });
  // simple 模式使用更高像素比保证清晰；否则按限制
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1));
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 150);
  camera.position.set(0, 0, cameraZ);

  const geo = new THREE.BufferGeometry();
  const count = cols * rows;
  const positions = new Float32Array(count * 3);
  const uvs = new Float32Array(count * 2);
  let pi = 0, ui = 0;
  // 让点阵整体斜着排列（左上到右下），通过旋转坐标生成逻辑实现
  const angle = Math.PI / 4; // 45度
  const cosA = Math.cos(angle);
  const sinA = Math.sin(angle);
  for (let y = 0; y < rows; y++) {
    const vLen = y / (rows - 1);
    for (let x = 0; x < cols; x++) {
      const vWidth = x / (cols - 1);
      // 原始坐标
      const px0 = (x - cols / 2) * spacing;
      const py0 = (y - rows / 2) * spacing;
      // 旋转45度
      const px = px0 * cosA - py0 * sinA;
      const py = px0 * sinA + py0 * cosA;
      positions[pi++] = px;
      positions[pi++] = py;
      positions[pi++] = 0;
      uvs[ui++] = vWidth;
      uvs[ui++] = vLen;
    }
  }
  geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geo.setAttribute('uv', new THREE.BufferAttribute(uvs, 2));

  const uniforms = { uTime: { value: 0 }, uPointSize: { value: pointSize }, uDotColor: { value: new THREE.Color(dotColor as any) }, uWaveSpeed: { value: waveSpeed } } as const;

  const material = new THREE.ShaderMaterial({
        transparent: false,
        depthWrite: false,
        blending: THREE.NoBlending,
        uniforms,
        vertexShader: /* glsl */`
          precision mediump float;
          uniform float uTime; uniform float uWaveSpeed;
          uniform float uPointSize;
          void main(){
            vec3 p = position;
            float t = uTime * 0.6 * uWaveSpeed;
            float w1 = sin(p.x * 1.2 + t);
            float w2 = sin(p.y * 1.4 - t * 1.3);
            float w3 = sin((p.x + p.y) * 0.7 + t * 0.8);
            float h = (w1 * 0.55 + w2 * 0.35 + w3 * 0.25);
            p.z = h * 0.9;
            vec4 mv = modelViewMatrix * vec4(p,1.0);
            // 使用传入点大小；>=2 时呈现圆形
            gl_PointSize = uPointSize;
            gl_Position = projectionMatrix * mv;
          }
    `,
    fragmentShader: /* glsl */`
          precision mediump float;
          uniform float uPointSize;
          uniform vec3 uDotColor;
          void main(){
            if(uPointSize <= 1.01){
              gl_FragColor = vec4(uDotColor,1.0);
              return;
            }
            float d = length(gl_PointCoord - 0.5);
            if(d>0.5) discard; // 圆形裁剪
            gl_FragColor = vec4(uDotColor,1.0);
          }
    `
  });

  const points = new THREE.Points(geo, material);
  scene.add(points);

  // interaction tilt
  const target = new THREE.Vector2();
  const lerp = new THREE.Vector2();
  if (interactive) {
    window.addEventListener('pointermove', (e) => {
      target.x = (e.clientX / window.innerWidth - 0.5) * 2.0;
      target.y = (e.clientY / window.innerHeight - 0.5) * 2.0;
    });
  }

  function resize() {
    const w = window.innerWidth; const h = window.innerHeight;
    renderer.setSize(w, h); camera.aspect = w / h; camera.updateProjectionMatrix();
  }
  window.addEventListener('resize', resize);
  resize();

  function tick() {
    requestAnimationFrame(tick);
    (uniforms.uTime as any).value = performance.now() * 0.001;
  lerp.x += (target.x - lerp.x) * mouseEase;
  lerp.y += (target.y - lerp.y) * mouseEase;
  camera.position.x = lerp.x * 2.0 * mouseIntensity;
  camera.position.y = -lerp.y * 1.4 * mouseIntensity;
    camera.lookAt(0,0,0);
    renderer.render(scene, camera);
  }
  tick();

  return {
    dispose() {
      renderer.dispose();
      geo.dispose();
      material.dispose();
    },
  setColor(c) { (uniforms.uDotColor as any).value.set(c as any); },
  setSpeed(s: number){ (uniforms.uWaveSpeed as any).value = s; }
  };
}
