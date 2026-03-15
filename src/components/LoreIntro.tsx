import { motion, type Variants } from 'framer-motion';

export default function LoreIntro() {
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.15,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
  };

  return (
    <section className="py-24 px-6 max-w-5xl mx-auto relative z-10 border-t border-shining-knight/20">
      
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        className="backdrop-blur-md bg-kurobeni/60 border border-shining-knight/20 p-8 md:p-12 relative overflow-hidden"
      >
        {/* Subtle background decoration */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-odradek/5 blur-[100px] rounded-full pointer-events-none" />
        <div className="absolute inset-0 bg-[url('/img/scanlines.png')] opacity-10 mix-blend-overlay pointer-events-none" />

        <motion.div variants={itemVariants} className="mb-8 border-l-2 border-bleached-silk pl-4">
          <p className="font-mono text-xs text-december-sky tracking-widest uppercase mb-1">Archive Entry // 001</p>
          <h2 className="font-orbitron font-bold text-3xl md:text-4xl uppercase tracking-wider text-bleached-silk">
            The <span className="text-odradek">Death Stranding</span>
          </h2>
        </motion.div>

        <div className="font-sans text-shining-knight space-y-6 leading-relaxed text-sm md:text-base">
          <motion.p variants={itemVariants}>
            An unprecedented cataclysm shattered the boundary between the living world and the domain of the dead, known as <span className="text-odradek font-mono bg-odradek/10 px-1">The Beach</span>. This event triggered massive explosions across the globe—Voidouts—obliterating cities and leaving humanity splintered and isolated.
          </motion.p>
          
          <motion.p variants={itemVariants}>
            Ghosts from the other side, known as <span className="font-bold text-bleached-silk">BTs (Beached Things)</span>, now roam the landscape. They are invisible to standard human vision, detectable only through the technological synergy between an Odradek scanner and a Bridge Baby (BB). To make matters worse, temporal rain called <span className="text-december-sky font-mono bg-december-sky/10 px-1">Timefall</span> accelerates the aging and deterioration of anything it touches.
          </motion.p>

          <motion.div variants={itemVariants} className="my-8 p-4 border border-december-sky/20 bg-black/40">
            <h3 className="font-mono text-xs uppercase tracking-widest text-december-sky mb-2">[ The Drawbridge Initiative ]</h3>
            <p className="text-sm">
              Years after the initial reconnection of America, a civilian logistics organization called <span className="text-bleached-silk font-mono">Drawbridge</span> was formed to expand the Chiral Network across oceans. Now, our operations span from the ruins of Ciudad Nudo del Norte (Mexico) to the vast, dangerous outback of Australia, utilizing the mobile fortress <span className="text-odradek">DHV Magellan</span>.
            </p>
          </motion.div>

          <motion.p variants={itemVariants}>
            As an RPG participant, you are a specialized operative in this ruined world. Choose your class, equip your ordnances, and brave the wilderness as a Porter, a Combatant, or a Chiral Specialist. Reconnect the world. Your choices determine if you survive the journey.
          </motion.p>
        </div>
      </motion.div>

    </section>
  );
}
