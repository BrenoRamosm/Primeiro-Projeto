import { motion } from "framer-motion";
import React, { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface RoleCardProps {
  title: string;
  roleType: string;
  description: string;
  stats: {
    str: number;
    dex: number;
    con: number;
    int: number;
    wis: number;
    cha: number;
  };
  abilities: {
    level1: string;
    level3: string;
    level5: string;
    level10: string;
    level15: string;
    level20: string;
  };
  delay?: number;
}

import { useLoader } from "@react-three/fiber";

// Determine which texture to use based on the class title
function getSpritePath(title: string) {
  switch (title) {
    case "Bridges Security": return "/img/classes/bridges_security_sprite_1773341427597.png";
    case "Chiral Artist / Engineer": return "/img/classes/chiral_wizard_sprite_1773341442521.png";
    case "Ghost Porter": return "/img/classes/ghost_porter_sprite_1773341456379.png";
    case "Knot City Medic": return "/img/classes/medic_cleric_sprite_1773341470706.png";
    case "DOOMS Sufferer": return "/img/classes/dooms_warlock_sprite_1773341484702.png";
    case "Wilderness Prepper": return "/img/classes/prepper_ranger_sprite_1773341501090.png";
    default: return "/img/classes/bridges_security_sprite_1773341427597.png";
  }
}

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
    // Discard solid black background (common in AI generated isolated backgrounds)
    if (color.r < 0.08 && color.g < 0.08 && color.b < 0.08) {
      discard; // Make transparent
    }
    // Slight glow overlay to match the DB aesthetic
    gl_FragColor = vec4(color.rgb, color.a);
  }
`;

function Role3DModel({ title }: { title: string }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const texturePath = getSpritePath(title);
  
  // Load texture
  const texture = useLoader(THREE.TextureLoader, texturePath);

  // Slight drifting animation
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.position.y = Math.sin(state.clock.elapsedTime * 1.5) * 0.1;
      // Slight rotation back and forth for a holographic card feel
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.15;
    }
  });

  return (
    <mesh ref={meshRef}>
      <planeGeometry args={[3, 3]} />
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

export default function RoleCard({ title, roleType, description, stats, abilities, delay = 0 }: RoleCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay }}
      whileHover={{ y: -5 }}
      className="group relative bg-dark-engine/40 border border-shining-knight/20 p-6 flex flex-col justify-between overflow-hidden backdrop-blur-sm"
    >
      {/* Accent Top Bar */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-shining-knight/50 to-transparent group-hover:via-odradek transition-colors duration-500"></div>

      {/* Decorative corners */}
      <div className="absolute top-2 left-2 w-2 h-2 border-t border-l border-shining-knight/40 group-hover:border-odradek/80 transition-colors"></div>
      <div className="absolute top-2 right-2 w-2 h-2 border-t border-r border-shining-knight/40 group-hover:border-odradek/80 transition-colors"></div>
      <div className="absolute bottom-2 left-2 w-2 h-2 border-b border-l border-shining-knight/40 group-hover:border-odradek/80 transition-colors"></div>
      <div className="absolute bottom-2 right-2 w-2 h-2 border-b border-r border-shining-knight/40 group-hover:border-odradek/80 transition-colors"></div>

      {/* 3D Model Display */}
      <div className="w-full h-40 mb-4 border border-shining-knight/10 relative overflow-hidden bg-black/20 group-hover:bg-black/40 transition-colors pointer-events-none">
        <Canvas camera={{ position: [0, 0, 4], fov: 50 }}>
          <ambientLight intensity={0.5} />
          <directionalLight position={[2, 5, 2]} intensity={1.5} />
          <React.Suspense fallback={null}>
            <Role3DModel title={title} />
          </React.Suspense>
        </Canvas>
      </div>

      <div className="mb-6 relative z-10 pointer-events-auto">
        <span className="text-xs font-mono text-odradek tracking-widest uppercase mb-1 block">
          [{roleType}]
        </span>
        <h3 className="font-orbitron text-2xl font-bold text-bleached-silk tracking-wide uppercase">
          {title}
        </h3>
      </div>

      <p className="font-inter text-sm text-december-sky mb-8 leading-relaxed relative z-10 pointer-events-auto">
        {description}
      </p>

      <div className="grid grid-cols-2 gap-x-4 gap-y-3 relative z-10 pointer-events-auto">
        <StatBar label="STR" value={stats.str} />
        <StatBar label="INT" value={stats.int} />
        <StatBar label="DEX" value={stats.dex} />
        <StatBar label="WIS" value={stats.wis} />
        <StatBar label="CON" value={stats.con} />
        <StatBar label="CHA" value={stats.cha} />
      </div>

      {/* Abilities Overlay on Hover */}
      <div className="absolute inset-0 bg-kurobeni/95 backdrop-blur-md z-20 opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col p-6 translate-y-4 group-hover:translate-y-0 pointer-events-none">
        <h4 className="font-orbitron font-bold text-odradek text-lg tracking-widest uppercase mb-4 border-b border-odradek/30 pb-2">
          Class Progression
        </h4>
        <div className="flex-1 overflow-y-auto space-y-4 pr-2 scrollbar-thin scrollbar-thumb-odradek/50">
          <AbilityRow level={1} text={abilities.level1} />
          <AbilityRow level={10} text={abilities.level10} />
          <AbilityRow level={20} text={abilities.level20} />
        </div>
        <div className="mt-4 pt-3 border-t border-shining-knight/20 text-center">
          <span className="font-mono text-[10px] text-shining-knight uppercase tracking-widest">
            Detailed rules available in Archive
          </span>
        </div>
      </div>

      {/* Background glow on hover */}
      <div className="absolute inset-0 bg-odradek/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-0"></div>
    </motion.div>
  );
}

function StatBar({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex items-center gap-3">
      <span className="font-mono text-xs text-shining-knight w-8">{label}</span>
      <div className="flex-1 h-1.5 bg-kurobeni relative overflow-hidden">
        <motion.div 
          initial={{ width: 0 }}
          whileInView={{ width: `\${value}%` }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
          className="absolute top-0 left-0 h-full bg-shining-knight group-hover:bg-odradek transition-colors duration-300"
        ></motion.div>
      </div>
      <span className="font-mono text-xs text-december-sky w-6 text-right">{value}</span>
    </div>
  );
}

function AbilityRow({ level, text }: { level: number; text: string }) {
  const [name, ...descParts] = text.split(':');
  const description = descParts.join(':').trim();

  return (
    <div className="flex gap-3 text-left">
      <div className="flex flex-col items-center mt-1">
        <div className="w-6 h-6 rounded bg-dark-engine border border-shining-knight/30 flex items-center justify-center font-mono text-[10px] text-odradek">
          L{level}
        </div>
        <div className="w-px h-full bg-shining-knight/20 mt-1"></div>
      </div>
      <div className="pb-3">
        <span className="font-orbitron text-sm font-bold text-bleached-silk block">{name}</span>
        <span className="font-inter text-xs text-december-sky/90 leading-snug block mt-1">{description}</span>
      </div>
    </div>
  );
}
