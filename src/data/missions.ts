// src/data/missions.ts

export interface Mission {
  id: string;
  orderNumber: number;
  title: string;
  cargo: string;
  weightKg: number;
  origin: string;
  destination: string;
  threats: string[];
  reward: string;
  status: "Available" | "In Progress" | "Completed";
  description: string;
}

export const missions: Mission[] = [
  {
    id: "m-101",
    orderNumber: 214,
    title: "Urgent Medical Supply Delivery",
    cargo: "High-grade Cryptobiotes, Blood Bags (O-)",
    weightKg: 25.5,
    origin: "Capital Knot City",
    destination: "Waystation West of Capital Knot",
    threats: ["BTs (Low Concentration)", "Timefall"],
    reward: "Chiral Crystals x150, Bridges Rep+",
    status: "Available",
    description: "The medical facility at the Waystation is running critically low on supplies. Navigate through the BT territory carefully; the cargo is highly sensitive to Timefall degradation."
  },
  {
    id: "m-102",
    orderNumber: 302,
    title: "Retrieval: Stolen PCC Printers",
    cargo: "Confiscated Bridges Hardware",
    weightKg: 60.0,
    origin: "MULE Camp (South-East coordinates)",
    destination: "Distribution Center South of Capital Knot",
    threats: ["MULEs (Armed)", "Sensor Poles"],
    reward: "PCC Level 2 Schematic, Metal x800",
    status: "Available",
    description: "A local MULE gang has hijacked a convoy carrying advanced PCC units. Infiltrate their camp, neutralize the threats non-lethally, and securely retrieve the stolen hardware."
  },
  {
    id: "m-103",
    orderNumber: 44,
    title: "Chiral Network Expansion Setup",
    cargo: "Q-pid Terminal Node",
    weightKg: 5.0,
    origin: "Port Knot City",
    destination: "Weather Station",
    threats: ["Homo Demens (Sniper risk)", "Heavy Timefall", "BTs (Catcher variant observed)", "Steep Terrain"],
    reward: "Weather Forecast Upgrade, High-density Chiralium",
    status: "In Progress",
    description: "Crucial order to connect the Weather Station to the Chiral Network. The route is extremely perilous. Extreme caution advised against Homo Demens separatist activity in the region."
  },
  {
    id: "m-104",
    orderNumber: 15,
    title: "Corpse Disposal (Emergency)",
    cargo: "Necrotizing Human Remains",
    weightKg: 85.0,
    origin: "Incinerator Route Entry",
    destination: "Incinerator Facility",
    threats: ["Imminent Voidout", "BTs (High Density)"],
    reward: "Access Clearance: Level 3, Metals x1000",
    status: "Completed",
    description: "A casualty was discovered near the network perimeter. Immediate incineration required before necrosis advances to the BT phase, risking a catastrophic voidout."
  }
];
