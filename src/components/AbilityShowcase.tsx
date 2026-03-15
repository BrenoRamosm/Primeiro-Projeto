import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import * as THREE from 'three';

const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = `
  uniform sampler2D tDiffuse;
  varying vec2 vUv;
  void main() {
    vec4 color = texture2D(tDiffuse, vUv);
    if (color.r < 0.08 && color.g < 0.08 && color.b < 0.08) {
      discard;
    }
    gl_FragColor = vec4(color.rgb, color.a);
  }
`;

// Map class names to dynamic texture paths based on level
function getSpriteTexture(title: string, level: number) {
  // Bridges Security has full variations generated as Proof of Concept
  if (title === "Bridges Security") {
    if (level === 1) return "/img/classes/bridges_security_sprite_1773341427597.png";
    if (level === 5) return "/img/classes/security_lvl5_sprite_1773342853089.png";
    if (level === 10) return "/img/classes/security_lvl10_sprite_1773342868520.png";
    if (level === 15) return "/img/classes/security_lvl15_sprite_1773342883209.png";
    if (level === 20) return "/img/classes/security_lvl20_sprite_1773342899896.png";
  }
  
  // Fallbacks for other classes until all 24 images are fully generated
  switch (title) {
    case "Chiral Artist / Engineer": return "/img/classes/chiral_wizard_sprite_1773341442521.png";
    case "Ghost Porter": return "/img/classes/ghost_porter_sprite_1773341456379.png";
    case "Knot City Medic": return "/img/classes/medic_cleric_sprite_v2_1773342125151.png";
    case "DOOMS Sufferer": return "/img/classes/dooms_warlock_sprite_1773341484702.png";
    case "Wilderness Prepper": return "/img/classes/prepper_ranger_sprite_v2_1773342140933.png";
    default: return "/img/classes/bridges_security_sprite_1773341427597.png";
  }
}

function FloatingSprite({ title, level }: { title: string, level: number }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const texturePath = getSpriteTexture(title, level);
  const texture = useLoader(THREE.TextureLoader, texturePath);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.position.y = Math.sin(state.clock.elapsedTime * 1.2 + level) * 0.15;
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5 + level) * 0.2;
    }
  });

  return (
    <mesh ref={meshRef}>
      <planeGeometry args={[3.5, 3.5]} />
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={{ tDiffuse: { value: texture } }}
        transparent={true}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

function AbilityNode({ level, title, description, classTitle }: { level: number, title: string, description: string, classTitle: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { margin: "200px 0px", once: false });

  return (
    <div className="flex flex-col lg:flex-row gap-8 items-center bg-dark-engine/30 border border-shining-knight/10 p-6 rounded-sm relative group overflow-hidden">
      {/* 3D Model Viewport */}
      <div ref={containerRef} className="w-full lg:w-1/3 h-64 bg-black/40 border border-shining-knight/20 relative flex items-center justify-center">
        <div className="absolute top-2 left-2 z-10 bg-kurobeni/80 px-2 py-1 border border-odradek/50">
          <span className="font-mono text-xs text-odradek">LVL {level} AVATAR</span>
        </div>
        {isInView && (
          <Canvas camera={{ position: [0, 0, 4.5], fov: 50 }}>
            <ambientLight intensity={0.5} />
            <React.Suspense fallback={null}>
              <FloatingSprite title={classTitle} level={level} />
            </React.Suspense>
          </Canvas>
        )}
      </div>

      {/* Ability Details */}
      <div className="w-full lg:w-2/3 space-y-3 relative z-10">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full border-2 border-odradek flex items-center justify-center bg-kurobeni text-odradek font-orbitron font-bold text-xl shadow-[0_0_15px_rgba(251,191,36,0.3)]">
            {level}
          </div>
          <h3 className="font-orbitron font-bold text-2xl text-bleached-silk tracking-widest uppercase">{title}</h3>
        </div>
        <div className="h-px w-full bg-gradient-to-r from-shining-knight/50 to-transparent my-2"></div>
        <p className="font-inter text-december-sky text-lg leading-relaxed">
          {description}
        </p>
      </div>

      <div className="absolute inset-0 bg-odradek/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-0"></div>
    </div>
  );
}

export default function AbilityShowcase({ classData, index }: { classData: any, index: number }) {
  // Parse ability strings "Name: Description"
  const parseAbility = (text: string) => {
    const [name, ...desc] = text.split(':');
    return { name, description: desc.join(':').trim() };
  };

  const ab1 = parseAbility(classData.abilities.level1);
  const ab5 = parseAbility(classData.abilities.level5);
  const ab10 = parseAbility(classData.abilities.level10);
  const ab15 = parseAbility(classData.abilities.level15);
  const ab20 = parseAbility(classData.abilities.level20);

  return (
    <motion.section 
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8 }}
      className="relative"
    >
      <div className="sticky top-20 z-30 bg-kurobeni/95 backdrop-blur-md py-4 border-b-2 border-odradek mb-8 flex items-center justify-between shadow-2xl">
        <h2 className="font-orbitron text-3xl font-bold text-white uppercase tracking-widest pl-4">
          {classData.title}
        </h2>
        <span className="font-mono text-sm text-odradek tracking-widest pr-4">
          [{classData.roleType}]
        </span>
      </div>

      <div className="space-y-6">
        <AbilityNode level={1} title={ab1.name} description={ab1.description} classTitle={classData.title} />
        <AbilityNode level={5} title={ab5.name} description={ab5.description} classTitle={classData.title} />
        <AbilityNode level={10} title={ab10.name} description={ab10.description} classTitle={classData.title} />
        <AbilityNode level={15} title={ab15.name} description={ab15.description} classTitle={classData.title} />
        <AbilityNode level={20} title={ab20.name} description={ab20.description} classTitle={classData.title} />
      </div>
    </motion.section>
  );
}
