import { motion, AnimatePresence } from 'framer-motion';
import { useState, useMemo, useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Html, Line, Points, PointMaterial, PerformanceMonitor } from '@react-three/drei';
import { EffectComposer, Bloom, SMAA, Vignette } from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';
import * as THREE from 'three';

// --- Death Stranding: Full World Locations ---
const locations = [
  // ====== DS2: MEXICO (Northwest peninsula) ======
  { id: 'mx-1', name: 'Ciudad Nudo del Norte', region: 'Mexico', position: [-24, 0.5, -12], type: 'knot', status: 'ONLINE', desc: 'Massive fortress city in the rocky canyon region.' },
  { id: 'mx-2', name: 'Villa Libre', region: 'Mexico', position: [-20, 0.8, 2], type: 'facility', status: 'ONLINE', desc: 'Civilian settlement in the mesa.' },
  { id: 'mx-3', name: 'The Artist', region: 'Mexico', position: [-26, 2.5, -20], type: 'prepper', status: 'WARNING', desc: 'Isolated creator on the northern highlands.' },
  { id: 'mx-4', name: 'The Bokka', region: 'Mexico', position: [-18, 1.2, 10], type: 'facility', status: 'ONLINE', desc: 'Southern peninsula facility.' },
  // Mexico EP zones
  { id: 'mx-ep1', name: 'Zona EP: Cânion Vermelho', region: 'Mexico', position: [-22, 3.5, -8], type: 'ep_zone', status: 'HOSTILE', desc: '[INVESTIGAÇÃO] Alta concentração de EPs no cânion central. BT Alfa confirmado. Risco: EXTREMO.' },
  { id: 'mx-ep2', name: 'Zona EP: Planalto Sul', region: 'Mexico', position: [-17, 4.0, 5], type: 'ep_zone', status: 'HOSTILE', desc: '[INVESTIGAÇÃO] Cluster Leviathan detectado. Obliteração subterrânea provável. Risco: ALTO.' },
  { id: 'mx-ep3', name: 'Zona EP: Crista Norte', region: 'Mexico', position: [-27, 5.0, -16], type: 'ep_zone', status: 'HOSTILE', desc: '[INVESTIGAÇÃO] EPs de montanha com alta carga quiral. Timefall intenso. Risco: ALTO.' },
  { id: 'mx-ob1', name: 'Cratera da Obliteração Velha', region: 'Mexico', position: [-21, 1.0, -2], type: 'obliteration', status: 'HOSTILE', desc: '[INVESTIGAÇÃO] Voidout Cat.4. Cratera 800m. Carga quiral superdensa.' },

  // ====== DS2: AUSTRALIA (Eastern continent) ======
  { id: 'au-1', name: 'West Fort Knot (F1)', region: 'Australia', position: [14, 0.2, 2], type: 'knot', status: 'ONLINE', desc: 'Gateway hub near the caldera.' },
  { id: 'au-2', name: 'Terminal Fort Knot', region: 'Australia', position: [28, 0.5, -8], type: 'knot', status: 'ONLINE', desc: 'Major transit hub in the eastern highlands.' },
  { id: 'au-3', name: 'Rainbow Valley', region: 'Australia', position: [32, 1.5, 6], type: 'facility', status: 'ONLINE', desc: 'Settlement in the eastern mountain foothills.' },
  { id: 'au-4', name: 'Animal Shelter', region: 'Australia', position: [20, 0.5, 16], type: 'facility', status: 'WARNING', desc: 'Southern coastal preservation zone.' },
  { id: 'au-5', name: "Gov't Base", region: 'Australia', position: [22, 0.5, -14], type: 'knot', status: 'ONLINE', desc: 'Northern military command.' },
  // Australia EP zones & obliterations
  { id: 'au-ep1', name: 'Zona EP: Caldeira', region: 'Australia', position: [13, 2.0, 3], type: 'ep_zone', status: 'HOSTILE', desc: '[INVESTIGAÇÃO] Interior da caldeira saturado. Manifestação quiral ativa. Risco: EXTREMO.' },
  { id: 'au-ep2', name: 'Zona EP: Monte Central', region: 'Australia', position: [24, 7.0, 0], type: 'ep_zone', status: 'HOSTILE', desc: '[INVESTIGAÇÃO] EPs no pico nevado. Possível nexo quiral primário. Risco: EXTREMO.' },
  { id: 'au-ep3', name: 'Zona EP: Litoral Norte', region: 'Australia', position: [19, 1.0, -12], type: 'ep_zone', status: 'HOSTILE', desc: '[INVESTIGAÇÃO] Cluster Mammalia. Migração não mapeada. Risco: MODERADO.' },
  { id: 'au-ep4', name: 'Zona EP: Baía SE', region: 'Australia', position: [31, 0.5, 12], type: 'ep_zone', status: 'HOSTILE', desc: '[INVESTIGAÇÃO] EPs aquáticos. Conexão Tar Belt via corrente subterrânea. Risco: ALTO.' },
  { id: 'au-ob1', name: 'Obliteração — Outback', region: 'Australia', position: [26, 2.5, -4], type: 'obliteration', status: 'HOSTILE', desc: '[INVESTIGAÇÃO] Voidout Cat.5. Supernova quiral. Risco: ALTO.' },
  { id: 'au-ob2', name: 'Gran Obliteração', region: 'Australia', position: [17, 1.5, 8], type: 'obliteration', status: 'HOSTILE', desc: '[INVESTIGAÇÃO] Maior voidout da Austrália. Raio 2km. EPs de novo tipo. Risco: EXTREMO.' },

  // ====== DS1: NORTH AMERICA — United Cities of America ======
  // Layout: East → West (Capital → Port → Lake → South → Mountain → Edge)
  // EASTERN REGION — flat grassy coast, ~X=-38 to -44 in world space
  { id: 'us-1', name: 'Capital Knot City', region: 'UCA Eastern', position: [-38, 0.5, -31], type: 'knot', status: 'ONLINE', desc: '[DS1] Capital of the UCA. Built over ruins of Washington D.C. East coast, sea level.' },
  { id: 'us-2', name: 'Distribution Center (E)', region: 'UCA Eastern', position: [-41, 1.5, -33], type: 'facility', status: 'ONLINE', desc: '[DS1] Bridging hub between Capital and Port Knot. Mountain pass supply depot.' },
  { id: 'us-3', name: 'Port Knot City', region: 'UCA Eastern', position: [-44, 0.6, -29], type: 'knot', status: 'ONLINE', desc: '[DS1] Western border of Eastern Region. Boat port to Central Region.' },
  { id: 'us-4', name: "Mama's Lab", region: 'UCA Eastern', position: [-42, 2.8, -35], type: 'prepper', status: 'WARNING', desc: '[DS1] Mountain lab with ghost anchor. BB development site.' },

  // CENTRAL REGION — mixed grassland/snow, ~X=-47 to -58
  { id: 'us-5', name: 'Lake Knot City', region: 'UCA Central', position: [-48, 0.3, -26], type: 'knot', status: 'ONLINE', desc: '[DS1] First Central hub. Crater lake shore. Midwest plains.' },
  { id: 'us-6', name: 'South Knot City', region: 'UCA Central', position: [-50, 0.4, -38], type: 'knot', status: 'ONLINE', desc: '[DS1] Southern hub. Terminus of the chiral backbone. Crucial for western reach.' },
  { id: 'us-7', name: 'Heartman\'s Lab', region: 'UCA Central', position: [-55, 4.5, -35], type: 'prepper', status: 'WARNING', desc: '[DS1] High mountain lab near heart-shaped lake. Cardiac death loop experiments.' },
  { id: 'us-8', name: 'Timefall Farm', region: 'UCA Central', position: [-52, 1.2, -30], type: 'prepper', status: 'WARNING', desc: '[DS1] Agricultural Timefall refuge. Subterranean crop bunkers.' },
  { id: 'us-9', name: "Elder's Shelter", region: 'UCA Central', position: [-47, 2.0, -30], type: 'prepper', status: 'WARNING', desc: '[DS1] Hilltop recluse. Classified UCA archival data.' },

  // WESTERN REGION — Rocky Mountains, ~X=-60 to -68
  { id: 'us-10', name: 'Mountain Knot City', region: 'UCA Western', position: [-61, 1.2, -34], type: 'knot', status: 'ONLINE', desc: '[DS1] Snow-buried city in the Rockies. Controlled by Lockne. Hardest approach.' },
  { id: 'us-11', name: 'Wind Farm', region: 'UCA Western', position: [-63, 5.0, -37], type: 'facility', status: 'WARNING', desc: '[DS1] High-altitude chiral relay. Extreme Timefall and BT surges.' },
  { id: 'us-12', name: 'Film Director', region: 'UCA Western', position: [-59, 3.0, -31], type: 'prepper', status: 'WARNING', desc: '[DS1] Archivist documenting the end of civilization.' },
  { id: 'us-13', name: 'Edge Knot City', region: 'UCA Western', position: [-67, 0.8, -33], type: 'knot', status: 'ONLINE', desc: '[DS1] Final Knot. Higgs\' stronghold on the Pacific coast. End of Sam\'s journey.' },

  // DS1 Historical Voidout Craters
  { id: 'us-ob1', name: 'Cratera Central Knot', region: 'UCA Central', position: [-47, -0.5, -34], type: 'obliteration', status: 'HOSTILE', desc: '[DS1] Voidout que destruiu Central Knot City. Maior cratera do leste americano.' },
  { id: 'us-ob2', name: 'Cratera Rockies', region: 'UCA Western', position: [-57, -1.0, -39], type: 'obliteration', status: 'HOSTILE', desc: '[DS1] Voidout nos Rockies durante a Reconexão. EPs hibernantes no subsolo nevado.' },

  // ====== DS2: ARCHIPELAGO (Southern island cluster) ======
  { id: 'ar-1', name: 'Driftwood Node', region: 'Archipelago', position: [5, 0.2, 35], type: 'knot', status: 'ONLINE', desc: 'Main arrival point on the southern islands.' },
  { id: 'ar-2', name: 'The Seafarer', region: 'Archipelago', position: [12, 1.0, 38], type: 'prepper', status: 'WARNING', desc: 'Marine researcher isolated in the archipelago.' },
  { id: 'ar-3', name: 'Atoll Facility', region: 'Archipelago', position: [-2, 0.5, 42], type: 'facility', status: 'ONLINE', desc: 'Oceanic monitoring station.' },
  { id: 'ar-ep1', name: 'Zona EP: Mar Profundo', region: 'Archipelago', position: [8, 0.1, 45], type: 'ep_zone', status: 'HOSTILE', desc: '[INVESTIGAÇÃO] Anomalia aquática severa. EPs marinhos grandes.' },

  // Threat Zone
  { id: 'th-1', name: 'Tar Belt', region: 'Threat', position: [0, 0, 0], type: 'bt', status: 'HOSTILE', desc: 'Viscous chiral sea separating the continents.' }
];

// Routes — DS1 internal + DS2 internal
const routes = [
  // Mexico (DS2)
  { source: 'mx-1', target: 'mx-2', type: 'road' },
  { source: 'mx-2', target: 'mx-4', type: 'path' },
  { source: 'mx-1', target: 'mx-3', type: 'path' },
  // Australia (DS2)
  { source: 'au-1', target: 'au-2', type: 'road' },
  { source: 'au-2', target: 'au-3', type: 'path' },
  { source: 'au-1', target: 'au-4', type: 'road' },
  // Archipelago (DS2)
  { source: 'ar-1', target: 'ar-2', type: 'path' },
  { source: 'ar-1', target: 'ar-3', type: 'path' },
  // North America (DS1) — Sam Porter's route
  { source: 'us-1', target: 'us-2', type: 'road' },
  { source: 'us-2', target: 'us-5', type: 'road' },
  { source: 'us-5', target: 'us-9', type: 'road' },
  { source: 'us-6', target: 'us-7', type: 'path' },
  { source: 'us-8', target: 'us-3', type: 'path' },
  { source: 'us-9', target: 'us-10', type: 'path' },
];


// GLSL noise + elevation shared between the vertex and fragment shaders.
// Keeping this as a JS string that gets injected into both shader strings via template literals.
const NOISE_GLSL = `
  vec4 permute_n(vec4 x){return mod(((x*34.0)+1.0)*x, 289.0);}
  vec4 taylorInvSqrt_n(vec4 r){return 1.79284291400159 - 0.85373472095314 * r;}
  vec3 fade_n(vec3 t) {return t*t*t*(t*(t*6.0-15.0)+10.0);}

  float cnoise(vec3 P){
    vec3 Pi0 = floor(P); vec3 Pi1 = Pi0 + vec3(1.0); Pi0 = mod(Pi0, 289.0); Pi1 = mod(Pi1, 289.0); vec3 Pf0 = fract(P); vec3 Pf1 = Pf0 - vec3(1.0); vec4 ix = vec4(Pi0.x, Pi1.x, Pi0.x, Pi1.x); vec4 iy = vec4(Pi0.yy, Pi1.yy); vec4 iz0 = Pi0.zzzz; vec4 iz1 = Pi1.zzzz; vec4 ixy = permute_n(permute_n(ix) + iy); vec4 ixy0 = permute_n(ixy + iz0); vec4 ixy1 = permute_n(ixy + iz1); vec4 gx0 = ixy0 / 7.0; vec4 gy0 = fract(floor(gx0) / 7.0) - 0.5; gx0 = fract(gx0); vec4 gz0 = vec4(0.5) - abs(gx0) - abs(gy0); vec4 sz0 = step(gz0, vec4(0.0)); gx0 -= sz0 * (step(0.0, gx0) - 0.5); gy0 -= sz0 * (step(0.0, gy0) - 0.5); vec4 gx1 = ixy1 / 7.0; vec4 gy1 = fract(floor(gx1) / 7.0) - 0.5; gx1 = fract(gx1); vec4 gz1 = vec4(0.5) - abs(gx1) - abs(gy1); vec4 sz1 = step(gz1, vec4(0.0)); gx1 -= sz1 * (step(0.0, gx1) - 0.5); gy1 -= sz1 * (step(0.0, gy1) - 0.5); vec3 g000 = vec3(gx0.x,gy0.x,gz0.x); vec3 g100 = vec3(gx0.y,gy0.y,gz0.y); vec3 g010 = vec3(gx0.z,gy0.z,gz0.z); vec3 g110 = vec3(gx0.w,gy0.w,gz0.w); vec3 g001 = vec3(gx1.x,gy1.x,gz1.x); vec3 g101 = vec3(gx1.y,gy1.y,gz1.y); vec3 g011 = vec3(gx1.z,gy1.z,gz1.z); vec3 g111 = vec3(gx1.w,gy1.w,gz1.w); vec4 norm0 = taylorInvSqrt_n(vec4(dot(g000, g000), dot(g010, g010), dot(g100, g100), dot(g110, g110))); g000 *= norm0.x; g010 *= norm0.y; g100 *= norm0.z; g110 *= norm0.w; vec4 norm1 = taylorInvSqrt_n(vec4(dot(g001, g001), dot(g011, g011), dot(g101, g101), dot(g111, g111))); g001 *= norm1.x; g011 *= norm1.y; g101 *= norm1.z; g111 *= norm1.w; float n000 = dot(g000, Pf0); float n100 = dot(g100, vec3(Pf1.x, Pf0.yz)); float n010 = dot(g010, vec3(Pf0.x, Pf1.y, Pf0.z)); float n110 = dot(g110, vec3(Pf1.xy, Pf0.z)); float n001 = dot(g001, vec3(Pf0.xy, Pf1.z)); float n101 = dot(g101, vec3(Pf1.x, Pf0.y, Pf1.z)); float n011 = dot(g011, vec3(Pf0.x, Pf1.yz)); float n111 = dot(g111, Pf1); vec3 fade_xyz = fade_n(Pf0); vec4 n_z = mix(vec4(n000, n100, n010, n110), vec4(n001, n101, n011, n111), fade_xyz.z); vec2 n_yz = mix(n_z.xy, n_z.zw, fade_xyz.y); float n_xyz = mix(n_yz.x, n_yz.y, fade_xyz.x); return 2.2 * n_xyz;
  }

  float fbm(vec3 x) {
    float v = 0.0; float a = 0.5; vec3 shift = vec3(100.0);
    // 2 octaves (was 3) — massive fragment shader speedup
    for (int i = 0; i < 2; ++i) { v += a * cnoise(x); x = x * 2.0 + shift; a *= 0.5; }
    return v;
  }

  // ============================================================
  // FULL WORLD MAP: DS1 (North America) + DS2 Mexico + DS2 Australia
  // + Obliteration voidout craters as real terrain depressions
  // ============================================================
  float crater(vec2 pos, vec2 center, float rimR, float holeR, float rimH, float holeD) {
    float d = length(pos - center);
    float rim  = rimH  * exp(-pow(d / rimR,  2.0));
    float hole = holeD * exp(-pow(d / holeR, 2.0));
    return rim - hole;
  }

  float getElevation(vec2 pos) {
    // --- Organic base noise ---
    float baseNoise = fbm(vec3(pos.x * 0.18, pos.y * 0.18, 3.0)) * 2.0
                    + fbm(vec3(pos.x * 0.55, pos.y * 0.55, 17.0)) * 0.8
                    + cnoise(vec3(pos.x * 1.8,  pos.y * 1.8,  7.0)) * 0.25;

    // ====== DS1: NORTH AMERICA (UCA — United Cities of America) ======
    // Positioned far NW of the world grid: center ~(-52, -35)
    float ucaMask = smoothstep(0.0, 1.0,
      exp(-pow((pos.x + 52.0) / 18.0, 2.0) - pow((pos.y + 35.0) / 14.0, 2.0)));
    // East coast arm (Capital Knot / Port Knot area) — lower, coastal
    float ucaEast   = exp(-pow((pos.x + 38.0) / 8.0, 2.0) - pow((pos.y + 30.0) / 6.0, 2.0)) * 0.7;
    // Northern arm (Lake Knot / Minnesota area)
    float ucaNorth  = exp(-pow((pos.x + 50.0) / 6.0, 2.0) - pow((pos.y + 22.0) / 5.0, 2.0)) * 0.5;
    float ucaTotalMask = clamp(ucaMask + ucaEast * 0.6 + ucaNorth * 0.4, 0.0, 1.0);
    float ucaBase = ucaTotalMask * 2.0;

    // ROCKY MOUNTAINS (Mountain Knot City area) — western spine
    float rockies = exp(-pow((pos.x + 62.0) / 4.0, 2.0) - pow((pos.y + 35.0) / 10.0, 2.0)) * 7.5;

    // APPALACHIANS (eastern highlands) — lower range
    float appalachians = exp(-pow((pos.x + 42.0) / 3.5, 2.0) - pow((pos.y + 35.0) / 9.0, 2.0)) * 3.5;

    // GREAT LAKES basin (lake depression in north-center)
    float greatLakeRim  = exp(-pow((pos.x + 50.0) / 4.0, 2.0) - pow((pos.y + 28.0) / 4.0, 2.0)) * 1.5;
    float greatLakeHole = exp(-pow((pos.x + 50.0) / 2.5, 2.0) - pow((pos.y + 28.0) / 2.5, 2.0)) * 2.5;
    float greatLake = (greatLakeRim - greatLakeHole) * ucaTotalMask;

    // Midwest plains (flat-ish, between Rockies and Appalachians)
    float ucaRidges = fbm(vec3(pos.x * 0.25, pos.y * 0.25, 88.0)) * 1.5 * ucaTotalMask;

    // ====== DS2: MEXICO REGION (NW peninsula) ======
    float mexMask = smoothstep(0.0, 1.0,
      exp(-pow((pos.x + 22.0) / 8.0, 2.0) - pow((pos.y + 5.0) / 15.0, 2.0)));
    float mexBase = mexMask * 4.5;
    float canyonCut = sin(pos.x * 1.1 + 1.0) * cos(pos.y * 0.9 + 0.5) * 0.5 + 0.5;
    float canyonMask = mexMask * smoothstep(0.3, 0.7, 1.0 - canyonCut);
    float canyons = -canyonMask * 4.0;
    float mexMountains = exp(-pow((pos.x + 24.0) / 5.0, 2.0) - pow((pos.y + 15.0) / 8.0, 2.0)) * 4.0;

    // ====== DS2: AUSTRALIA REGION (Large Eastern continent) ======
    float ausMask = smoothstep(0.0, 1.0,
      exp(-pow((pos.x - 22.0) / 12.0, 2.0) - pow((pos.y - 2.0) / 11.0, 2.0)));
    float ausNorthArm = exp(-pow((pos.x - 18.0) / 9.0, 2.0) - pow((pos.y + 14.0) / 6.0, 2.0)) * 0.9;
    float ausSEArm    = exp(-pow((pos.x - 30.0) / 5.0, 2.0) - pow((pos.y - 10.0) / 7.0, 2.0)) * 0.8;
    float ausTotalMask = clamp(ausMask + ausNorthArm * 0.5 + ausSEArm * 0.4, 0.0, 1.0);
    float ausBase = ausTotalMask * 2.5;
    float ausCentralMtn = exp(-pow((pos.x - 23.0) / 5.0, 2.0) - pow((pos.y + 1.0) / 5.0, 2.0)) * 9.5;
    float calderaRim  = exp(-pow((pos.x - 13.0) / 3.5, 2.0) - pow((pos.y - 4.0) / 3.5, 2.0)) * 3.5;
    float calderaHole = exp(-pow((pos.x - 13.0) / 2.0, 2.0) - pow((pos.y - 4.0) / 2.0, 2.0)) * 4.5;
    float ausRidges = fbm(vec3(pos.x * 0.3, pos.y * 0.3, 50.0)) * 2.0 * ausTotalMask;

    // ====== DS2: ARCHIPELAGO (Southern islands) ======
    float archBase = exp(-pow((pos.x - 5.0) / 12.0, 2.0) - pow((pos.y - 38.0) / 10.0, 2.0)) * 1.5;
    float archNoise = fbm(vec3(pos.x * 0.4, pos.y * 0.4, 22.0));
    float archMask = smoothstep(0.3, 0.8, archBase * archNoise);
    float archipelago = archMask * 2.5;

    // ====== TAR BELT (narrow channel between Mexico and Australia) ======
    // Only carves the CENTRAL gap between the two DS2 continents. DS1 is far NW, never touched.
    float tarX = smoothstep(-8.0, -4.0, pos.x) * (1.0 - smoothstep(4.0, 8.0, pos.x));
    // Only apply tar in the Y-range between DS2 Mexico and DS2 Australia (roughly -20 to +20)
    float tarY = smoothstep(-24.0, -18.0, pos.y) * (1.0 - smoothstep(18.0, 24.0, pos.y));
    float allLand = clamp(mexMask + ausTotalMask + ucaTotalMask, 0.0, 1.0);
    float tarDepth = tarX * tarY * (1.0 - allLand) * -5.5;

    // ====== OBLITERATION CRATERS (real terrain geometry) ======
    // Each crater = raised blast rim + deep central hole, visible in 3D mesh
    // Mexico craters
    float crMxOb1 = crater(pos, vec2(-21.0, -2.0),  2.2, 1.2, 2.0, 3.8); // Cratera Velha MX
    // Australia craters
    float crAuOb1 = crater(pos, vec2(26.0,  -4.0),  2.5, 1.4, 2.2, 4.2); // Outback Voidout
    float crAuOb2 = crater(pos, vec2(17.0,   8.0),  3.0, 1.8, 2.8, 5.0); // Gran Obliteração
    // DS1 (North America) historical craters
    float crUs1   = crater(pos, vec2(-48.0, -32.0), 2.0, 1.1, 1.8, 3.5); // Voidout East
    float crUs2   = crater(pos, vec2(-57.0, -40.0), 2.8, 1.6, 2.4, 4.5); // Voidout West (near Rockies)
    float allCraters = crMxOb1 + crAuOb1 + crAuOb2 + crUs1 + crUs2;

    // ====== COMBINE ALL ======
    float elev = baseNoise * 0.5;
    // DS1 North America
    elev += ucaBase + rockies + appalachians + greatLake + ucaRidges;
    // DS2 Mexico
    elev += mexBase + canyons + mexMountains;
    // DS2 Australia
    elev += ausBase + ausCentralMtn + (calderaRim - calderaHole) + ausRidges;
    // DS2 Archipelago
    elev += archipelago;
    // Tar belt
    elev += tarDepth;
    // Craters — applied AFTER landmasses so they cut into existing terrain
    elev += allCraters;

    if (elev < 0.2) elev *= 0.04;
    return elev;
  }
`;

const terrainVertexShader = `
  varying vec2 vUv;
  varying vec3 vPosition;
  varying float vElevation;

  ${NOISE_GLSL}

  void main() {
    vUv = uv;
    vPosition = position;
    vElevation = getElevation(position.xy);
    vec3 newPosition = position + normal * vElevation;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
  }
`;

const terrainFragmentShader = `
  varying vec2 vUv;
  varying vec3 vPosition;
  varying float vElevation;

  uniform vec3 lightPosition;
  uniform vec3 viewPosition;
  uniform float uTime;

  ${NOISE_GLSL}

  void main() {
    // Dark rocky Death Stranding palette
    vec3 colorWater = vec3(0.01, 0.01, 0.015);      // Black Tar
    vec3 colorCrater = vec3(0.04, 0.04, 0.045);     // Scorched ash, near-black
    vec3 colorTundra = vec3(0.09, 0.09, 0.10);      // Dark grey rock base
    vec3 colorRock   = vec3(0.13, 0.13, 0.15);      // Dark charcoal stone
    vec3 colorSnow   = vec3(0.65, 0.68, 0.72);      // Dirty grey-white ice, not pure white
    
    vec3 baseColor;
    float roughness = 1.0;
    float metallic = 0.0;
    
    // Stronger multi-frequency rock noise for chiseled detail
    float noiseTexture  = cnoise(vec3(vPosition.x * 5.0,  vPosition.y * 5.0,  0.0));
    float noiseCoarse   = cnoise(vec3(vPosition.x * 1.5,  vPosition.y * 1.5,  5.0));
    float noiseFine     = cnoise(vec3(vPosition.x * 12.0, vPosition.y * 12.0, 0.0));
    
    if (vElevation < 0.2) {
      // === Vivid bioluminescent Timefall Tar — multi-layer fluid waves ===
      // Large slow swell
      float waveA = cnoise(vec3(vPosition.xy * 1.8,  uTime * 0.5)) * 0.5 + 0.5;
      // Mid-frequency chop
      float waveB = cnoise(vec3(vPosition.xy * 4.5 + vec2(1.7, 0.9),  uTime * 1.1)) * 0.5 + 0.5;
      // High-frequency foam crests
      float waveC = cnoise(vec3(vPosition.xy * 10.0 - vec2(0.5, 1.3), uTime * 2.2)) * 0.5 + 0.5;
      // Direction-biased ripple for sense of flow
      float waveD = cnoise(vec3(vPosition.x * 6.0 + uTime * 1.8, vPosition.y * 2.5, uTime * 0.7)) * 0.5 + 0.5;
      // Foam flecks — very high freq, fast
      float foam  = cnoise(vec3(vPosition.xy * 22.0 + vec2(uTime * 3.5, -uTime * 1.2), 0.0)) * 0.5 + 0.5;

      vec3 tarBase  = vec3(0.0,  0.03, 0.07);
      vec3 tarGlow  = vec3(0.0,  0.75, 0.88);
      vec3 tarFoam  = vec3(0.25, 1.0,  1.0);

      float blend = waveA * 0.35 + waveB * 0.3 + waveC * 0.2 + waveD * 0.15;
      baseColor = mix(tarBase, mix(tarGlow, tarFoam, waveC * waveB), blend * blend);
      // Bright foam flecks on crests
      baseColor = mix(baseColor, tarFoam, pow(foam, 6.0) * 0.7);
      roughness = 0.01;
      metallic = 1.0;
    } else if (vElevation < 0.5) {
      baseColor = mix(colorWater, colorCrater, smoothstep(0.2, 0.5, vElevation));
      roughness = 0.75;
      metallic = 0.1;
    } else if (vElevation < 2.5) {
      float mf = (vElevation - 0.5) / 2.0;
      baseColor = mix(colorCrater, colorTundra, smoothstep(0.0, 1.0, mf));
      // Chiseled rock grain — darker crevices
      baseColor -= abs(noiseTexture) * 0.04;
      baseColor -= abs(noiseFine)    * 0.02;
      roughness = 0.95;
    } else if (vElevation < 5.0) {
      float mf = (vElevation - 2.5) / 2.5;
      baseColor = mix(colorTundra, colorRock, smoothstep(0.0, 1.0, mf));
      // Heavy layered rock erosion
      baseColor -= abs(noiseTexture) * 0.07;
      baseColor -= abs(noiseCoarse)  * 0.04;
      baseColor += noiseFine         * 0.015; // Slight highlight on sharp edges
      roughness = 0.92;
    } else {
      float mf = (vElevation - 5.0) / 2.0;
      baseColor = mix(colorRock, colorSnow, smoothstep(0.0, 1.0, mf));
      // Dirty snow — not clean white
      baseColor -= abs(noiseFine) * 0.08;
      roughness = 0.6;
    }


    // --- Fast 2-sample Normals (cross-difference, 2x cheaper than 4-sample) ---
    float eps = 0.1;
    float hR = getElevation(vPosition.xy + vec2(eps, 0.0));
    float hU = getElevation(vPosition.xy + vec2(0.0, eps));
    vec3 normal = normalize(vec3(vElevation - hR, vElevation - hU, eps));

    // Animated Tar normal perturbation — creates parallax ripple/flow effect
    if (vElevation < 0.2) {
      // Two layers of normal distortion with different speeds and directions
      float r1x = cnoise(vec3(vPosition.xy * 2.5 + vec2(uTime * 0.9, 0.0), 0.0)) * 0.12;
      float r1y = cnoise(vec3(vPosition.xy * 2.5 + vec2(0.0, uTime * 0.7), 1.0)) * 0.12;
      float r2x = cnoise(vec3(vPosition.xy * 6.0 - vec2(uTime * 1.6, 0.3), 2.0)) * 0.06;
      float r2y = cnoise(vec3(vPosition.xy * 6.0 + vec2(0.1, uTime * 2.0), 3.0)) * 0.06;
      normal.x += r1x + r2x;
      normal.y += r1y + r2y;
      normal = normalize(normal);
    }

    vec3 lightDir = normalize(lightPosition);
    float diff = max(dot(normal, lightDir), 0.0);
    float ao = clamp((vElevation + 1.0) / 3.0, 0.2, 1.0);
    vec3 viewDir = normalize(viewPosition - vec3(vPosition.x, vPosition.y, vElevation));
    vec3 reflectDir = reflect(-lightDir, normal);
    float spec = pow(max(dot(viewDir, reflectDir), 0.0), 32.0 * roughness) * (1.0 - roughness);
    float shadow = clamp(1.0 - (cnoise(vec3(vPosition.x * 2.0 + lightDir.x * 5.0, vPosition.y * 2.0 + lightDir.y * 5.0, 10.0)) * 0.5 + 0.5), 0.4, 1.0);

    float sunHeight = normalize(lightPosition).y;
    // Raised ambient floor so map stays readable even after sunset (0.08 min)
    vec3 ambientColor = mix(vec3(0.08, 0.08, 0.12), vec3(0.22, 0.25, 0.38), smoothstep(-0.2, 0.5, sunHeight));
    vec3 sunColor = mix(vec3(0.9, 0.4, 0.2), vec3(1.0, 1.0, 0.9), smoothstep(0.0, 0.4, sunHeight));

    vec3 ambient = ambientColor * baseColor * ao; 
    vec3 diffuse = diff * baseColor * shadow * mix(0.1, 2.2, smoothstep(-0.1, 0.3, sunHeight)) * sunColor;
    vec3 specular = spec * sunColor * shadow * mix(0.1, 1.0, smoothstep(0.0, 0.5, sunHeight));
    vec3 finalColor = ambient + diffuse + specular;

    float depth = gl_FragCoord.z / gl_FragCoord.w;
    float fogFactor = smoothstep(25.0, 120.0, depth);
    vec3 fogColor = mix(vec3(0.01, 0.02, 0.03), vec3(0.4, 0.5, 0.6), smoothstep(-0.2, 0.6, sunHeight));
    finalColor = mix(finalColor, fogColor, fogFactor);

    float gridX = step(0.98, fract(vPosition.x * 0.5));
    float gridY = step(0.98, fract(vPosition.y * 0.5));
    float gridMask = max(gridX, gridY) * (1.0 - fogFactor);
    finalColor = mix(finalColor, vec3(0.2, 0.3, 0.4), gridMask * mix(0.15, 0.3, smoothstep(0.0, -0.2, sunHeight)));

    gl_FragColor = vec4(finalColor, 1.0);
  }
`;

function RealisticTerrain({ sunPosition }: { sunPosition: THREE.Vector3 }) {
  const materialRef = useRef<THREE.ShaderMaterial>(null);



  // Update uniforms for lighting and animated tar water
  useFrame(({ camera }) => {
    if (materialRef.current) {
      materialRef.current.uniforms.viewPosition.value.copy(camera.position);
      materialRef.current.uniforms.lightPosition.value.copy(sunPosition);
      materialRef.current.uniforms.uTime.value += 0.025; // Smooth water animation
    }
  });

  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]}>
      {/* 128x128 segments — optimized for better baseline performance */}
      <planeGeometry args={[200, 200, 128, 128]} />
      <shaderMaterial 
        ref={materialRef}
        vertexShader={terrainVertexShader}
        fragmentShader={terrainFragmentShader}
        wireframe={false}
        uniforms={{
          lightPosition: { value: sunPosition },
          viewPosition: { value: new THREE.Vector3() },
          uTime: { value: 0 },
        }}
      />
    </mesh>
  );
}

// --- Procedural Volumetric Clouds ---
const cloudsVertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const cloudsFragmentShader = `
  varying vec2 vUv;
  uniform float time;
  uniform vec3 lightPosition;
  
  // Hash function for noise
  float hash(vec2 p) {
    p = fract(p * vec2(123.34, 456.21));
    p += dot(p, p + 45.32);
    return fract(p.x * p.y);
  }

  // 2D Value Noise
  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(mix(hash(i + vec2(0.0, 0.0)), hash(i + vec2(1.0, 0.0)), u.x),
               mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
  }

  // Fractional Brownian Motion for clouds — 3 octaves (was 4)
  float fbm(vec2 p) {
    float v = 0.0;
    float a = 0.5;
    vec2 shift = vec2(100.0);
    for (int i = 0; i < 3; ++i) {
      v += a * noise(p);
      p = p * 2.0 + shift + time * 0.05;
      a *= 0.5;
    }
    return v;
  }

  void main() {
    // Sparse clouds — raised threshold so only the densest patches show
    float cloudDensity = fbm(vUv * 8.0);
    cloudDensity = smoothstep(0.65, 0.85, cloudDensity); // Was 0.4→0.8, now 0.65→0.85

    float sunHeight = normalize(lightPosition).y;
    vec3 dayCloudColor    = vec3(0.9, 0.9, 0.95);
    vec3 sunsetCloudColor = vec3(0.85, 0.5, 0.3);
    vec3 nightCloudColor  = vec3(0.04, 0.05, 0.08);
    vec3 cloudColor = mix(nightCloudColor, mix(sunsetCloudColor, dayCloudColor, smoothstep(0.1, 0.4, sunHeight)), smoothstep(-0.2, 0.2, sunHeight));

    float shadowMask = fbm(vUv * 8.0 + normalize(lightPosition.xz) * 0.1);
    cloudColor *= mix(0.6, 1.0, shadowMask);

    // Max opacity 0.25 (was 0.5) — sparse, wispy clouds
    gl_FragColor = vec4(cloudColor, cloudDensity * mix(0.03, 0.25, smoothstep(-0.2, 0.1, sunHeight)));
  }
`;

function CloudsLayer({ sunPosition }: { sunPosition: THREE.Vector3 }) {
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.time.value = state.clock.elapsedTime;
      materialRef.current.uniforms.lightPosition.value.copy(sunPosition);
    }
  });

  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 5.0, 0]}> {/* Position strictly above the mountains */}
      {/* Clouds don't need many segments — 24x24 is plenty */}
      <planeGeometry args={[200, 200, 24, 24]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={cloudsVertexShader}
        fragmentShader={cloudsFragmentShader}
        transparent={true}
        depthWrite={false} // Don't block things behind the transparent clouds
        uniforms={{
          time: { value: 0 },
          lightPosition: { value: sunPosition },
        }}
      />
    </mesh>
  );
}

// --- Timefall Rain Particles ---
function TimefallRain() {
  const count = 400; // was 750 — reduced for performance
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i*3]   = (Math.random() - 0.5) * 200; // X spread
      arr[i*3+1] = Math.random() * 30;           // Y height
      arr[i*3+2] = (Math.random() - 0.5) * 200; // Z spread
    }
    return arr;
  }, []);
  const posRef = useRef<Float32Array>(positions);
  const pointsRef = useRef<THREE.Points>(null);

  useFrame((_, delta) => {
    if (!pointsRef.current) return;
    const pos = posRef.current;
    const speed = 8.0;
    for (let i = 0; i < count; i++) {
      pos[i*3+1] -= speed * delta;
      if (pos[i*3+1] < -2) {
        // Reset to top with new random XZ
        pos[i*3]   = (Math.random() - 0.5) * 200;
        pos[i*3+1] = 28 + Math.random() * 4;
        pos[i*3+2] = (Math.random() - 0.5) * 200;
      }
    }
    (pointsRef.current.geometry.attributes.position as THREE.BufferAttribute).needsUpdate = true;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[posRef.current, 3]}
          count={count}
        />
      </bufferGeometry>
      <pointsMaterial
        color="#7dd3fc"
        size={0.06}
        transparent
        opacity={0.35}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

// --- Map Nodes & Icons — Holographic Floating Pins ---
function MapIcon({ loc, isActive, onHover }: { loc: any, isActive: boolean, onHover: (id: string|null) => void }) {
  const isKnot    = loc.type === 'knot';
  const isEP      = loc.type === 'ep_zone';
  const isVoidout = loc.type === 'obliteration';
  const isFacility = loc.type === 'facility';
  const isPrepper  = loc.type === 'prepper';
  const isHostile  = loc.status === 'HOSTILE';

  // Color palette
  const color = isKnot     ? '#38bdf8'  // Sky blue — Allied Knot
              : isFacility ? '#34d399'  // Emerald — Facility
              : isPrepper  ? '#a78bfa'  // Violet — Prepper shelter
              : isEP       ? '#fbbf24'  // Amber — EP concentration
              : isVoidout  ? '#f87171'  // Soft red — Obliteration
              : '#ef4444';              // Red — BT/Hostile

  const pinH = isKnot ? 0.9 : isFacility ? 0.6 : isPrepper ? 0.5 : 0.4;

  // Animated orb + ring
  const orbRef  = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (orbRef.current) {
      // Float up/down
      orbRef.current.position.y = pinH + 0.08 + Math.sin(t * 2.1 + loc.position[0] * 0.7) * 0.06;
      // Slow spin
      orbRef.current.rotation.y = t * 0.8;
    }
    if (ringRef.current) {
      ringRef.current.rotation.z = t * 1.2;
      const pulse = 1 + Math.sin(t * 3.0 + loc.position[0]) * 0.15;
      ringRef.current.scale.setScalar(pulse);
    }
  });

  return (
    <group position={loc.position as [number, number, number]}>
      {/* Invisible hitbox */}
      <mesh
        onPointerOver={(e) => { e.stopPropagation(); onHover(loc.id); document.body.style.cursor = 'crosshair'; }}
        onPointerOut={() => { onHover(null); document.body.style.cursor = 'auto'; }}
        visible={false}
      >
        <cylinderGeometry args={[0.4, 0.4, pinH + 0.6, 8]} />
        <meshBasicMaterial />
      </mesh>

      {/* Vertical pillar — thin glowing stem */}
      {!isEP && !isVoidout && (
        <mesh position={[0, pinH / 2, 0]}>
          <cylinderGeometry args={[0.018, 0.035, pinH, 6]} />
          <meshBasicMaterial color={color} transparent opacity={0.7} />
        </mesh>
      )}

      {/* Base glow disc on ground */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
        <circleGeometry args={[isKnot ? 0.5 : 0.3, 32]} />
        <meshBasicMaterial color={color} transparent opacity={0.12} side={THREE.DoubleSide} />
      </mesh>

      {/* Floating orb at pin tip */}
      {!isEP && !isVoidout && (
        <mesh ref={orbRef} position={[0, pinH, 0]}>
          {isKnot
            ? <boxGeometry args={[0.18, 0.18, 0.18]} />
            : isFacility
            ? <tetrahedronGeometry args={[0.14, 0]} />
            : <sphereGeometry args={[0.12, 8, 8]} />}
          <meshBasicMaterial color={color} />
        </mesh>
      )}

      {/* Spinning ring around orb */}
      {!isEP && !isVoidout && (
        <mesh ref={ringRef} position={[0, pinH + 0.08, 0]} rotation={[Math.PI / 3, 0, 0]}>
          <ringGeometry args={[0.2, 0.24, 24]} />
          <meshBasicMaterial color={color} transparent opacity={0.55} side={THREE.DoubleSide} />
        </mesh>
      )}

      {/* EP Zone — diamond orb with double pulsing ring (no pillar, hovers above ground) */}
      {isEP && (
        <>
          <mesh ref={orbRef} position={[0, 0.5, 0]}>
            <octahedronGeometry args={[0.22, 0]} />
            <meshBasicMaterial color="#fbbf24" />
          </mesh>
          <mesh ref={ringRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.06, 0]}>
            <ringGeometry args={[0.7, 0.85, 32]} />
            <meshBasicMaterial color="#fbbf24" transparent opacity={0.4} side={THREE.DoubleSide} />
          </mesh>
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.04, 0]}>
            <ringGeometry args={[1.1, 1.18, 32]} />
            <meshBasicMaterial color="#fbbf24" transparent opacity={0.18} side={THREE.DoubleSide} />
          </mesh>
        </>
      )}

      {/* Obliteration — rising red plume sphere, no pillar */}
      {isVoidout && (
        <>
          <mesh ref={orbRef} position={[0, 0.45, 0]}>
            <sphereGeometry args={[0.22, 10, 10]} />
            <meshBasicMaterial color="#f87171" />
          </mesh>
          {/* Two concentric oscillating rings */}
          <mesh ref={ringRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.06, 0]}>
            <ringGeometry args={[0.8, 1.05, 32]} />
            <meshBasicMaterial color="#ef4444" transparent opacity={0.38} side={THREE.DoubleSide} />
          </mesh>
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.04, 0]}>
            <ringGeometry args={[1.4, 1.52, 32]} />
            <meshBasicMaterial color="#991b1b" transparent opacity={0.2} side={THREE.DoubleSide} />
          </mesh>
        </>
      )}

      {/* HUD Info Box on hover */}
      {isActive && (
        <Html distanceFactor={15} center zIndexRange={[100, 0]} position={[0, pinH + 0.9, 0]}>
          <div className="pointer-events-none w-52 bg-kurobeni/95 border border-shining-knight/50 p-3 shadow-2xl backdrop-blur-md">
            <div className="flex justify-between items-center mb-1">
              <span className="font-mono text-[9px] uppercase tracking-widest text-december-sky">{loc.region}</span>
              <span className={`font-mono text-[9px] uppercase px-1 border ${
                isHostile ? 'text-red-400 border-red-800' : 'text-blue-400 border-blue-800'
              }`}>{loc.status}</span>
            </div>
            <h4 className="font-orbitron font-bold text-sm text-white mb-1 leading-tight">{loc.name}</h4>
            <div className="w-full h-px bg-shining-knight/30 my-2" />
            <p className="font-sans text-[10px] text-shining-knight leading-tight">{loc.desc}</p>
          </div>
        </Html>
      )}

      {/* Floating label */}
      {!isActive && (
        <Html distanceFactor={28} center position={[0, 0.2, 0]}>
          <div className={`pointer-events-none whitespace-nowrap font-mono text-[7px] tracking-widest uppercase ${
            isKnot ? 'text-sky-400/90' :
            isFacility ? 'text-emerald-400/80' :
            isPrepper ? 'text-violet-400/75' :
            isEP ? 'text-amber-400/85' :
            isVoidout ? 'text-red-400/85' : 'text-red-500/70'
          }`}>{loc.name}</div>
        </Html>
      )}
    </group>
  );
}

// JS elevation sampler — mirrors GLSL getElevation() so routes hug terrain correctly
function jsSampleElevation(x: number, y: number): number {
  const hash = (a: number, b: number) => { const s = Math.sin(a * 127.1 + b * 311.7) * 43758.5453; return s - Math.floor(s); };
  const snoise = (px: number, py: number): number => {
    const ix = Math.floor(px), iy = Math.floor(py), fx = px - ix, fy = py - iy;
    const ux = fx * fx * (3 - 2 * fx), uy = fy * fy * (3 - 2 * fy);
    return (hash(ix,iy)*(1-ux)*(1-uy)+hash(ix+1,iy)*ux*(1-uy)+hash(ix,iy+1)*(1-ux)*uy+hash(ix+1,iy+1)*ux*uy)*2-1;
  };
  const fbm = (px: number, py: number, seed = 0): number => {
    let v = 0, a = 0.5;
    for (let i = 0; i < 4; i++) { v += a * snoise(px + seed, py + seed); px = px*2+100; py = py*2+100; a*=0.5; }
    return v;
  };
  const gaussD = (cx: number, cy: number, sx: number, sy: number) =>
    Math.exp(-Math.pow((x-cx)/sx,2) - Math.pow((y-cy)/sy,2));
  const craterFn = (cx: number, cy: number, rimR: number, holeR: number, rimH: number, holeD: number) => {
    const d = Math.sqrt(Math.pow(x-cx,2)+Math.pow(y-cy,2));
    return rimH * Math.exp(-Math.pow(d/rimR,2)) - holeD * Math.exp(-Math.pow(d/holeR,2));
  };

  // DS1: North America (UCA) — far NW
  const ucaMask = Math.max(0, Math.min(1, gaussD(-52,-35,18,14)));
  const ucaEast  = gaussD(-38,-30,8,6) * 0.7;
  const ucaNorth = gaussD(-50,-22,6,5) * 0.5;
  const ucaTotalMask = Math.min(1, ucaMask + ucaEast*0.6 + ucaNorth*0.4);
  const ucaBase = ucaTotalMask * 2.0;
  const rockies = gaussD(-62,-35,4,10) * 7.5;
  const appalachians = gaussD(-42,-35,3.5,9) * 3.5;
  const greatLakeRim  = gaussD(-50,-28,4,4) * 1.5;
  const greatLakeHole = gaussD(-50,-28,2.5,2.5) * 2.5;
  const ucaRidges = fbm(x*0.25, y*0.25, 88) * 1.5 * ucaTotalMask;

  // Mexico peninsula (NW)
  const mexMask = Math.max(0, Math.min(1, gaussD(-22,-5,8,15)));
  const canyonCut = Math.sin(x*1.1+1)*Math.cos(y*0.9+0.5)*0.5+0.5;
  const canyonMask = mexMask * Math.max(0, Math.min(1, (1-canyonCut-0.3)/0.4));
  const mexBase = mexMask * 4.5;
  const canyons = -canyonMask * 4.0;
  const mexMountains = gaussD(-24,-15,5,8) * 4.0;

  // Australia continent (E)
  const ausMask = Math.max(0, Math.min(1, gaussD(22,2,12,11)));
  const ausNorthArm = gaussD(18,-14,9,6) * 0.9;
  const ausSEArm = gaussD(30,-10,5,7) * 0.8;
  const ausTotalMask = Math.min(1, ausMask + ausNorthArm*0.5 + ausSEArm*0.4);
  const ausBase = ausTotalMask * 2.5;
  const ausCentralMtn = gaussD(23,-1,5,5) * 9.5;
  const calderaRim = gaussD(13,4,3.5,3.5) * 3.5;
  const calderaHole = gaussD(13,4,2,2) * 4.5;
  const ausRidges = fbm(x*0.3, y*0.3, 50) * 2.0 * ausTotalMask;

  // Archipelago
  const archBase = gaussD(5,38,12,10) * 1.5;
  const archNoise = fbm(x*0.4, y*0.4, 22);
  const archMask = Math.max(0, Math.min(1, (archBase * archNoise - 0.3)/0.5));
  const archipelago = archMask * 2.5;

  // Tar belt
  const tarX = Math.max(0,Math.min(1,(x+10)/5)) * (1-Math.max(0,Math.min(1,(x-5)/5)));
  const allLand = Math.min(1, mexMask + ausTotalMask + ucaTotalMask + archMask);
  const tarDepth = tarX * (1 - allLand) * -5.5;

  // Obliteration craters (real geometry)
  const craters = craterFn(-21,-2,2.2,1.2,2.0,3.8)
                + craterFn(26,-4,2.5,1.4,2.2,4.2)
                + craterFn(17,8,3.0,1.8,2.8,5.0)
                + craterFn(-48,-32,2.0,1.1,1.8,3.5)
                + craterFn(-57,-40,2.8,1.6,2.4,4.5);

  // Base noise
  const baseNoise = fbm(x*0.18, y*0.18, 3)*2.0 + fbm(x*0.55, y*0.55, 17)*0.8;

  let elev = baseNoise * 0.5
           + ucaBase + rockies + appalachians + (greatLakeRim - greatLakeHole) + ucaRidges
           + mexBase + canyons + mexMountains
           + ausBase + ausCentralMtn + (calderaRim - calderaHole) + ausRidges
           + archipelago
           + tarDepth + craters;
  if (elev < 0.2) elev *= 0.04;
  return elev;
}

// --- Connections/Roads (Chiral Network) ---
function MapRoutes() {
  const terrainRoutes = useMemo(() => {
    return routes.map((route) => {
      const src = locations.find(l => l.id === route.source);
      const tgt = locations.find(l => l.id === route.target);
      if (!src || !tgt) return null;

      const hover = 0.3;

      // Sample elevation at 3 key anchors: start, midpoint, end
      const srcY  = jsSampleElevation(src.position[0], src.position[2]) + hover;
      const tgtY  = jsSampleElevation(tgt.position[0], tgt.position[2]) + hover;
      const midX  = (src.position[0] + tgt.position[0]) / 2;
      const midZ  = (src.position[2] + tgt.position[2]) / 2;
      const midY  = jsSampleElevation(midX, midZ) + hover;
      // Arc the midpoint slightly upward so it clears terrain naturally
      const arcLift = Math.max(srcY, tgtY, midY) + 0.4;

      const curve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(src.position[0], srcY,   src.position[2]),
        new THREE.Vector3(midX,            arcLift, midZ),
        new THREE.Vector3(tgt.position[0], tgtY,   tgt.position[2]),
      ]);

      return { points: curve.getPoints(48), type: route.type };
    }).filter(Boolean);
  }, []);

  return (
    <>
      {terrainRoutes.map((r, i) => (
        <Line
          key={i}
          points={r!.points}
          color={r!.type === 'road' ? '#f59e0b' : '#22d3ee'} // Roads=amber, Paths=cyan chiral
          lineWidth={r!.type === 'road' ? 1.8 : 1.2}
          transparent
          opacity={r!.type === 'road' ? 0.8 : 0.55}
        />
      ))}
    </>
  );
}

// --- Background Chiral Particles ---
function ChiralDebris() {
  const count = 150; // was 400 — reduced for performance
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 50;
      arr[i * 3 + 1] = Math.random() * 10;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 40;
    }
    return arr;
  }, []);

  const ref = useRef<THREE.Points>(null);
  useFrame(() => {
    if (ref.current) {
      ref.current.rotation.y += 0.0005;
      ref.current.position.y = Math.sin(Date.now() * 0.001) * 0.5;
    }
  });

  return (
    <Points ref={ref} positions={positions} stride={3}>
      <PointMaterial transparent color="#f59e0b" size={0.08} sizeAttenuation={true} depthWrite={false} opacity={0.5} blending={THREE.AdditiveBlending} />
    </Points>
  );
}


// --- Time Utilities: Brasília (UTC-3) ---
function getBrasiliaSunPosition() {
  const now = new Date();
  
  // Calculate UTC time in milliseconds, then apply UTC-3 offset
  const utcMs = now.getTime() + (now.getTimezoneOffset() * 60000);
  const brasiliaOffset = -3;
  const brasiliaTime = new Date(utcMs + (3600000 * brasiliaOffset));

  const hours = brasiliaTime.getHours();
  const minutes = brasiliaTime.getMinutes();
  
  // Time in hours as a decimal (e.g., 14.5 for 2:30 PM)
  const timeDecimal = hours + minutes / 60;

  // Calculate sun angle. 6 AM = Sunrise (horizon), 12 PM = Zenith, 6 PM = Sunset
  // Map 0-24 hours to an angle where 12 is directly overhead
  // A standard day cycle: let's map 6 to 18 as the visible sun arc
  const sunAngle = ((timeDecimal - 6) / 12) * Math.PI; // 0 at 6am, PI/2 at 12pm, PI at 6pm
  
  // Use polar coordinates to map the sun rising from East to West over the map
  const radius = 30;
  const x = Math.cos(sunAngle) * radius; // East to West
  const y = Math.sin(sunAngle) * radius; // Height above scene
  const z = 10; // Keep it slightly pushed back for good shadows

  return new THREE.Vector3(-x, y, z);
}

// --- Main UI Component ---
export default function DrawbridgeMap() {
  const [activeNode, setActiveNode] = useState<string | null>(null);
  const [dpr, setDpr] = useState([1, 1.5]); // Dynamic resolution baseline (capped at 1.5)
  
  // Update sun position dynamically based on real time
  const [sunPosition, setSunPosition] = useState(new THREE.Vector3(-15, 25, 10)); // Default fallback
  const [brasiliaTimeString, setBrasiliaTimeString] = useState('');

  useEffect(() => {
    const updateTime = () => {
      setSunPosition(getBrasiliaSunPosition());
      
      const now = new Date();
      const utcMs = now.getTime() + (now.getTimezoneOffset() * 60000);
      const brasiliaTime = new Date(utcMs + (3600000 * -3));
      setBrasiliaTimeString(brasiliaTime.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }));
    };
    
    updateTime(); // initial
    const interval = setInterval(updateTime, 60000); // Check every minute
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="py-12 px-6 max-w-5xl mx-auto relative z-10">
      
      <div className="mb-6 border-l-2 border-blue-500 pl-6 flex flex-col md:flex-row justify-between items-start md:items-end gap-4 ml-6">
        <div>
          <h2 className="font-orbitron font-bold text-3xl md:text-5xl uppercase tracking-wider text-white mb-1">
            Chiral <span className="text-blue-400">Network Map</span>
          </h2>
          <p className="font-mono text-xs text-shining-knight tracking-widest uppercase">
            [ Bridges Topographical Data / Central & Eastern Regions ]
          </p>
        </div>
        <div className="text-right">
          <p className="font-mono text-sm text-december-sky tracking-widest uppercase bg-blue-900/20 px-4 py-2 border border-blue-900/50 rounded-sm">
            Local Time: {brasiliaTimeString} (UTC-3)
          </p>
        </div>
      </div>

      {/* The React Three Fiber Canvas (Full HD 16:9 Aspect) */}
      <div className="relative w-full aspect-video bg-black border border-blue-900/50 overflow-hidden shadow-[0_0_30px_rgba(59,130,246,0.15)] group rounded-sm">
        <div className="absolute top-4 left-4 z-20 bg-blue-900/80 px-3 py-1 font-mono text-xs text-blue-100 uppercase tracking-widest border border-blue-500/50 backdrop-blur-md">
          Live Satellite Topology [On The Beach Network]
        </div>
        
        <Canvas 
          camera={{ position: [-12, 30, 22], fov: 60 }} 
          dpr={dpr as [number, number]}
          gl={{ antialias: false, powerPreference: "high-performance" }} // Manual AA handled by postprocessing
        >
          {/* Dynamic Downgrade/Upgrade monitor. Lowers resolution if FPS drops under heavy load */}
          <PerformanceMonitor onDecline={() => setDpr([0.8, 1])} onIncline={() => setDpr([1, 1.5])} />
          
          <color attach="background" args={["#030508"]} /> {/* Sky color handled dynamically by fog */}
          {/* Exponential fog handles the literal infinity cutoff perfectly */}
          <fogExp2 attach="fog" args={["#030508", 0.015]} /> 
          
          <ambientLight intensity={0.5} /> 
          
          <RealisticTerrain sunPosition={sunPosition} />
          <CloudsLayer sunPosition={sunPosition} />
          <MapRoutes />
          {/* Timefall rain particles falling across the whole world */}
          <TimefallRain />
          {/* Debris made massively huge to cover infinity */}
          <ChiralDebris /> 
          
          {locations.map((loc) => (
            <MapIcon key={loc.id} loc={loc} isActive={activeNode === loc.id} onHover={setActiveNode} />
          ))}

          {/* Professional Post-Processing Pipeline */}
          <EffectComposer multisampling={0}>
            {/* Morphological AA (Crisp edges on high-res geometry without standard MSAA cost) */}
            <SMAA />
            {/* Cinematic Bloom (Glow). Threshold ensures only bright particles/highways glow */}
            <Bloom mipmapBlur intensity={1.5} luminanceThreshold={0.5} luminanceSmoothing={0.9} />
            {/* Cinematic dark edges */}
            <Vignette eskil={false} offset={0.1} darkness={1.1} blendFunction={BlendFunction.NORMAL} />
          </EffectComposer>

          {/* Infinite exploration controls */}
          <OrbitControls 
            enablePan={true} 
            enableZoom={true} 
            maxPolarAngle={Math.PI / 2.2} 
            minDistance={2}
            maxDistance={180} // Let the user zoom all the way up to "orbit"
            target={[-12, 0, -15]}
          />
        </Canvas>

      </div>
    </section>
  );
}
