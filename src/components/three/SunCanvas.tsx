"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import { PerformanceMonitor, Stars } from "@react-three/drei";
import { useEffect, useMemo, useRef, useState, type RefObject } from "react";
import * as THREE from "three";

const NOISE = /* glsl */ `
vec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x,289.0);}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159-0.85373472095314*r;}
float snoise(vec3 v){
  const vec2 C=vec2(1.0/6.0,1.0/3.0);const vec4 D=vec4(0.0,0.5,1.0,2.0);
  vec3 i=floor(v+dot(v,C.yyy));vec3 x0=v-i+dot(i,C.xxx);
  vec3 g=step(x0.yzx,x0.xyz);vec3 l=1.0-g;vec3 i1=min(g.xyz,l.zxy);vec3 i2=max(g.xyz,l.zxy);
  vec3 x1=x0-i1+C.xxx;vec3 x2=x0-i2+C.yyy;vec3 x3=x0-D.yyy;
  i=mod(i,289.0);
  vec4 p=permute(permute(permute(i.z+vec4(0.0,i1.z,i2.z,1.0))+i.y+vec4(0.0,i1.y,i2.y,1.0))+i.x+vec4(0.0,i1.x,i2.x,1.0));
  float n_=1.0/7.0;vec3 ns=n_*D.wyz-D.xzx;
  vec4 j=p-49.0*floor(p*ns.z*ns.z);
  vec4 x_=floor(j*ns.z);vec4 y_=floor(j-7.0*x_);
  vec4 x=x_*ns.x+ns.yyyy;vec4 y=y_*ns.x+ns.yyyy;vec4 h=1.0-abs(x)-abs(y);
  vec4 b0=vec4(x.xy,y.xy);vec4 b1=vec4(x.zw,y.zw);
  vec4 s0=floor(b0)*2.0+1.0;vec4 s1=floor(b1)*2.0+1.0;vec4 sh=-step(h,vec4(0.0));
  vec4 a0=b0.xzyw+s0.xzyw*sh.xxyy;vec4 a1=b1.xzyw+s1.xzyw*sh.zzww;
  vec3 p0=vec3(a0.xy,h.x);vec3 p1=vec3(a0.zw,h.y);vec3 p2=vec3(a1.xy,h.z);vec3 p3=vec3(a1.zw,h.w);
  vec4 norm=taylorInvSqrt(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));
  p0*=norm.x;p1*=norm.y;p2*=norm.z;p3*=norm.w;
  vec4 m=max(0.6-vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)),0.0);m=m*m;
  return 42.0*dot(m*m,vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));
}
float fbm(vec3 p){float a=0.5,s=0.0;for(int i=0;i<3;i++){s+=a*snoise(p);p*=2.02;a*=0.5;}return s;}`;

const VERT = NOISE + /* glsl */ `
uniform float uTime; uniform vec2 uMouse; uniform float uScroll;
varying float vSurf; varying vec3 vNormal; varying vec3 vView; varying vec3 vPos;
void main(){
  vec3 p=position;
  vPos=p;
  float surf=fbm(p*2.1 + vec3(0.0,0.0,uTime*0.10));
  vSurf=surf;
  float m=(uMouse.x*0.5+uMouse.y*0.4);
  float disp=surf*0.07 + m*0.03 + uScroll*0.09;
  vec3 np=p+normal*disp;
  vec4 mv=modelViewMatrix*vec4(np,1.0);
  vNormal=normalize(normalMatrix*normal);
  vView=normalize(-mv.xyz);
  gl_Position=projectionMatrix*mv;
}`;

const FRAG = NOISE + /* glsl */ `
uniform float uTime;
uniform vec3 uDark,uMid,uHot,uFlare,uLime;
varying float vSurf; varying vec3 vNormal; varying vec3 vView; varying vec3 vPos;
void main(){
  // per-pixel granulation (STATIC — animating it makes the surface flicker) +
  // large-scale sunspot regions. The slow life comes from vSurf (vertex churn).
  float gran = fbm(vPos*3.4);
  float spots = fbm(vPos*1.7 + vec3(31.0));
  float base = vSurf*0.5 + gran*0.5;
  float s = smoothstep(-0.6,0.85,base);
  vec3 col = mix(uDark, uMid, smoothstep(0.0,0.5,s));
  col = mix(col, uHot, smoothstep(0.45,0.82,s));
  col = mix(col, uFlare, smoothstep(0.82,1.0,s));
  // sunspots: subtle dark patches
  float spotMask = smoothstep(0.18,0.42, spots);
  col *= mix(0.45, 1.0, spotMask);
  // corona / limb glow
  float fres = pow(1.0 - max(dot(vNormal,vView),0.0), 2.2);
  col += mix(uHot, uFlare, fres) * fres * 1.05;
  gl_FragColor = vec4(col,1.0);
}`;

type Refs = {
  scroll: RefObject<number>;
  pointer: RefObject<THREE.Vector2>;
  narrow: RefObject<boolean>;
};

function Sun({ scroll, pointer, narrow }: Refs) {
  const group = useRef<THREE.Group>(null!);
  const mesh = useRef<THREE.Mesh>(null!);
  const pts = useRef<THREE.Points>(null!);
  const sLerp = useRef(0);
  const m = useRef(new THREE.Vector2());

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uMouse: { value: new THREE.Vector2() },
      uScroll: { value: 0 },
      uDark: { value: new THREE.Color("#4A0E00") },
      uMid: { value: new THREE.Color("#FF5A00") },
      uHot: { value: new THREE.Color("#FFB020") },
      uFlare: { value: new THREE.Color("#FFF1C2") },
      uLime: { value: new THREE.Color("#FFE08A") },
    }),
    [],
  );

  const pgeo = useMemo(() => {
    const COUNT = 1200;
    const arr = new Float32Array(COUNT * 3);
    for (let i = 0; i < COUNT; i++) {
      const r = 1.9 + Math.random() * 2.8;
      const th = Math.random() * Math.PI * 2;
      const ph = Math.acos(2 * Math.random() - 1);
      arr[i * 3] = r * Math.sin(ph) * Math.cos(th);
      arr[i * 3 + 1] = r * Math.sin(ph) * Math.sin(th);
      arr[i * 3 + 2] = r * Math.cos(ph);
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(arr, 3));
    return g;
  }, []);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    m.current.lerp(pointer.current ?? m.current, 0.05);
    const targetScroll = scroll.current ?? 0;
    sLerp.current += (targetScroll - sLerp.current) * 0.06;

    uniforms.uTime.value = t;
    uniforms.uMouse.value.copy(m.current);
    uniforms.uScroll.value = sLerp.current;

    mesh.current.rotation.y = m.current.x * 0.4 + t * 0.04 + sLerp.current * Math.PI;
    mesh.current.rotation.x = -m.current.y * 0.3 + sLerp.current * 0.5;
    pts.current.rotation.y = t * 0.02 + sLerp.current * 0.7;
    const nb = narrow.current ?? false;
    const CAP = 1.4; // matches the scroll clamp; at full scroll the sun is centered
    const baseX = nb ? 0.45 : 1.25;
    const baseY = nb ? -0.55 : 0;
    const baseScale = nb ? 0.7 : 1;
    const k = Math.min(sLerp.current / CAP, 1);
    group.current.position.x = baseX * (1 - k); // → 0 (centered) at the limit
    group.current.position.y = baseY * (1 - k);
    group.current.scale.setScalar(baseScale + k * 0.3);

    state.camera.position.x += (m.current.x * 0.2 - state.camera.position.x) * 0.05;
    state.camera.position.y += (m.current.y * 0.15 - state.camera.position.y) * 0.05;
    state.camera.lookAt(0, 0, 0);
  });

  const detail = typeof window !== "undefined" && window.innerWidth < 768 ? 28 : 48;

  return (
    <group ref={group} position={[1.25, 0, 0]}>
      <mesh ref={mesh}>
        <icosahedronGeometry args={[1.25, detail]} />
        <shaderMaterial vertexShader={VERT} fragmentShader={FRAG} uniforms={uniforms} />
      </mesh>
      <points ref={pts} geometry={pgeo}>
        <pointsMaterial
          size={0.016}
          color={"#FFB060"}
          transparent
          opacity={0.5}
          depthWrite={false}
        />
      </points>
    </group>
  );
}

export default function SunCanvas() {
  const scroll = useRef(0);
  const pointer = useRef(new THREE.Vector2());
  const narrow = useRef(false);
  const [lowPower, setLowPower] = useState(false);
  const [dpr, setDpr] = useState(1.5);
  // Bloom postproceso desactivado: con la superficie realista en pantallas
  // grandes generaba titileo. El brillo lo da el shader (corona) + el glow CSS.
  const [bloomOn, setBloomOn] = useState(false);

  useEffect(() => {
    const onResize = () => {
      narrow.current = window.innerWidth < 768;
      setLowPower(window.innerWidth < 768);
    };
    onResize();
    window.addEventListener("resize", onResize);
    const onScroll = () => {
      scroll.current = Math.min(window.scrollY / window.innerHeight, 1.4);
    };
    const onMove = (e: PointerEvent) => {
      pointer.current.set(
        (e.clientX / window.innerWidth) * 2 - 1,
        -((e.clientY / window.innerHeight) * 2 - 1),
      );
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("pointermove", onMove);
    return () => {
      window.removeEventListener("resize", onResize);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("pointermove", onMove);
    };
  }, []);

  return (
    <div className="scene">
      <Canvas camera={{ position: [0, 0, 5.2], fov: 45 }} dpr={dpr} gl={{ alpha: true }}>
        <PerformanceMonitor
          onDecline={() => {
            setDpr(1);
            setBloomOn(false);
          }}
        />
        <Stars radius={80} depth={40} count={1500} factor={3} saturation={0} fade speed={0.4} />
        <Sun scroll={scroll} pointer={pointer} narrow={narrow} />
        {bloomOn && !lowPower && (
          <EffectComposer>
            <Bloom
              intensity={0.55}
              luminanceThreshold={0.42}
              luminanceSmoothing={0.8}
              radius={0.7}
              mipmapBlur
            />
          </EffectComposer>
        )}
      </Canvas>
    </div>
  );
}
