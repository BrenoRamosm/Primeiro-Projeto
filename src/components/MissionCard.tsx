import { motion } from 'framer-motion';
import type { Mission } from '../data/missions';

interface MissionCardProps {
  mission: Mission;
  delay?: number;
}

export default function MissionCard({ mission, delay = 0 }: MissionCardProps) {
  const getStatusColor = (status: Mission["status"]) => {
    switch (status) {
      case 'Available': return 'text-december-sky border-december-sky';
      case 'In Progress': return 'text-odradek border-odradek';
      case 'Completed': return 'text-shining-knight border-shining-knight opacity-60';
      default: return 'text-bleached-silk border-bleached-silk';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay, ease: "easeOut" }}
      className={`group relative overflow-hidden border border-shining-knight/30 bg-kurobeni/80 backdrop-blur-sm p-6 flex flex-col justify-between ${mission.status === 'Completed' ? 'grayscale' : ''}`}
    >
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-shining-knight/10 to-transparent -z-10" />
      <div className="absolute top-4 right-4 text-xs font-mono font-bold tracking-widest text-shining-knight/30 select-none">
        {mission.id.toUpperCase()}
      </div>

      <div>
        <div className="flex justify-between items-start mb-4">
          <div className="flex gap-3 items-center">
            <span className="font-mono text-sm tracking-widest text-december-sky bg-shining-knight/20 px-2 py-1">
              ORDER No. {mission.orderNumber}
            </span>
            <span className={`font-mono text-[10px] uppercase px-2 py-1 border ${getStatusColor(mission.status)}`}>
              {mission.status}
            </span>
          </div>
        </div>

        <h3 className="font-orbitron text-xl md:text-2xl font-bold uppercase tracking-wide text-bleached-silk mb-2 group-hover:text-odradek transition-colors">
          {mission.title}
        </h3>
        
        <p className="font-sans text-sm text-shining-knight mb-6 leading-relaxed">
          {mission.description}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <div className="space-y-1">
            <span className="block font-mono text-[10px] text-december-sky uppercase tracking-widest">Origin</span>
            <span className="block font-sans text-sm text-bleached-silk">{mission.origin}</span>
          </div>
          <div className="space-y-1">
            <span className="block font-mono text-[10px] text-december-sky uppercase tracking-widest">Destination</span>
            <span className="block font-sans text-sm text-bleached-silk">{mission.destination}</span>
          </div>
          <div className="space-y-1">
            <span className="block font-mono text-[10px] text-december-sky uppercase tracking-widest">Cargo Details</span>
            <span className="block font-sans text-sm text-bleached-silk">{mission.cargo} ({mission.weightKg.toFixed(1)}kg)</span>
          </div>
          <div className="space-y-1">
            <span className="block font-mono text-[10px] text-december-sky uppercase tracking-widest">Reward</span>
            <span className="block font-sans text-sm text-odradek">{mission.reward}</span>
          </div>
        </div>
      </div>

      <div>
        <div className="border-t border-shining-knight/20 pt-4 mb-4">
          <span className="block font-mono text-[10px] text-december-sky uppercase tracking-widest mb-2">Hazards / Threats</span>
          <div className="flex flex-wrap gap-2">
            {mission.threats.map((threat, i) => (
              <span key={i} className="font-sans text-xs bg-red-900/30 text-red-400 px-2 py-1 border border-red-900/50">
                {threat}
              </span>
            ))}
          </div>
        </div>

        {mission.status !== 'Completed' && (
          <button className="w-full relative overflow-hidden group/btn font-mono uppercase tracking-widest text-xs py-3 border border-odradek text-odradek hover:text-kurobeni transition-colors mt-2">
            <span className="relative z-10 text-center block w-full">Accept Order</span>
            <motion.div
              className="absolute inset-0 bg-odradek origin-left transform -scale-x-0 group-hover/btn:scale-x-100 transition-transform duration-300 ease-out z-0"
              initial={false}
            />
          </button>
        )}
      </div>

      {/* Decorative scanline overlay on hover */}
      <div className="absolute inset-0 bg-[url('/img/scanlines.png')] opacity-0 group-hover:opacity-10 mix-blend-overlay pointer-events-none transition-opacity duration-500" />
    </motion.div>
  );
}
