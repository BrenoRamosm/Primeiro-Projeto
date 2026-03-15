// src/data/classes.ts

export interface RoleClass {
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
}

export const classes: RoleClass[] = [
  {
    title: "Bridges Security",
    roleType: "Fighter / Combatant",
    description: "Tactical enforcers armed with anti-BT weaponry and lethal ordnances. They rely on combat training to clear routes of MULE camps and Homo Demens terrorists.",
    stats: { str: 85, dex: 70, con: 80, int: 50, wis: 45, cha: 40 },
    abilities: {
      level1: "Action Surge: Once per Short Rest, take one additional Action on your turn.",
      level3: "Combat Superiority: Gain 4d8 superiority dice. Expend one to add to an attack roll or attempt a Disarm.",
      level5: "Extra Attack: Attack twice, instead of once, whenever you take the Attack action.",
      level10: "Indomitable: Once per Long Rest, reroll a failed saving throw.",
      level15: "Hematic Arsenal Overclock: Your superiority dice become d12s. Non-magical attacks count as magical vs BTs.",
      level20: "Master of War: You can now execute up to four attacks per Action."
    }
  },
  {
    title: "Chiral Artist / Engineer",
    roleType: "Wizard / Caster",
    description: "Experts in manipulating Chiralium and the Chiral Network. They deploy advanced holograms, PCC structures, and utilize Odradek scanner upgrades to alter the field.",
    stats: { str: 30, dex: 50, con: 45, int: 95, wis: 70, cha: 30 },
    abilities: {
      level1: "Chiral Casting: You have 2 First-Level PCC Slots. Regain all slots on a Long Rest.",
      level3: "Odradek Pulse: As a Bonus Action, force all hidden creatures in 60ft to make a DEX Save vs your Spell Save DC.",
      level5: "Holographic Decoy: As a Reaction to being hit, impose Disadvantage on the attacker's roll.",
      level10: "Chiral Displacement: As a Bonus Action, teleport up to 30 feet to an unoccupied space.",
      level15: "Network Weaver: You gain Resistance to Force and Necrotic damage.",
      level20: "Archmage of the Beach: Cast level 1, 2, and 3 spell blueprints at will without expending slots."
    }
  },
  {
    title: "Ghost Porter",
    roleType: "Rogue / Stealth",
    description: "Specialized in infiltration and silent delivery. They use stealth camo and Bola Guns to bypass MULE sensor poles and BTs without triggering voidouts.",
    stats: { str: 45, dex: 90, con: 55, int: 60, wis: 50, cha: 65 },
    abilities: {
      level1: "Sneak Attack: Once per turn, deal an extra 1d6 damage to a creature if you have Advantage.",
      level3: "Cunning Action: Take a Bonus Action on your turn to Dash, Disengage, or Hide.",
      level5: "Uncanny Dodge: As a Reaction, halve the damage from an incoming attack that hits you.",
      level10: "Supreme Sneak: You have Advantage on Dexterity (Stealth) checks if you move no more than half your speed.",
      level15: "Ghost Camo: If you are hidden, attacking does not reveal your position. Sneak Attack increases to 8d6.",
      level20: "Stroke of Luck: Once per Short Rest, turn a missed attack into a hit, or a failed ability check into an automatic 20."
    }
  },
  {
    title: "Knot City Medic",
    roleType: "Cleric / Support",
    description: "Dedicated to keeping Porters alive. They synthesize Cryptobiotes, manage Blood Bag transfusions, and soothe BB autotoxemia levels during high-stress encounters.",
    stats: { str: 50, dex: 45, con: 60, int: 70, wis: 90, cha: 75 },
    abilities: {
      level1: "Cryptobiote Synthesis: As an Action, heal a creature you touch for 1d8 + WIS modifier HP.",
      level3: "Channel Divinity: As an Action, present your holy symbol to grant 2d6 Temporary HP to allies in 30ft.",
      level5: "BB Soothe: Cast 'Lesser Restoration' without expending a spell slot once per Short Rest.",
      level10: "Divine Intervention: Roll percentile dice. If you roll under your level, your deity (or Amelie) aids you.",
      level15: "Supreme Healing: Healing spells you cast automatically heal the maximum possible amount.",
      level20: "Avatar of Amelie: Guaranteed Divine Intervention once per week. Can cast 'True Resurrection'."
    }
  },
  {
    title: "DOOMS Sufferer",
    roleType: "Warlock / Psionic",
    description: "Afflicted with high-level DOOMS. They have a supernatural connection to the Beach, allowing them to sense BTs instinctively and even influence chiral matter.",
    stats: { str: 40, dex: 65, con: 75, int: 60, wis: 40, cha: 85 },
    abilities: {
      level1: "DOOMS Pact Magic: Pact Magic slots always cast at their highest level. Regain slots on a Short Rest.",
      level3: "Tar Manipulator: Gain 'Eldritch Blast'. On a hit, it pushes the target up to 10 feet away.",
      level5: "Chiral Surge: Once per Long rest, gain Resistance to Bludgeoning, Piercing, and Slashing damage for 1 min.",
      level10: "Voidout Defiance: If you drop to 0 HP, drop to 1 HP instead. Once per Long Rest.",
      level15: "Extinction Entity Whispers: You can cast 'Flesh to Stone' or 'Finger of Death' once per Long Rest.",
      level20: "Eldritch Master of the Beach: Spend 1 minute entreating your patron to regain all expended spell slots."
    }
  },
  {
    title: "Wilderness Prepper",
    roleType: "Ranger / Survivalist",
    description: "Isolated survivalists living outside the UCA. They craft crucial gear and navigate temporal Timefall storms with unmatched perception and endurance.",
    stats: { str: 65, dex: 80, con: 70, int: 55, wis: 85, cha: 35 },
    abilities: {
      level1: "Favored Terrain: Ignore difficult terrain. Gain Advantage on INT and WIS checks related to the Wilderness.",
      level3: "Hunter's Prey: Once per turn, deal an extra 1d8 damage to a creature you hit with a weapon attack.",
      level5: "Multiattack: Make two attacks when taking the Action economy Attack action.",
      level10: "Hide in Plain Sight: Spend 1 minute camouflaging yourself. Gain a +10 bonus to Stealth checks.",
      level15: "Feral Senses: You do not suffer Disadvantage on attack rolls against unseen attackers.",
      level20: "Apex Survivor: Add your WIS modifier to the attack and damage rolls you make against a Favored Enemy."
    }
  }
];
