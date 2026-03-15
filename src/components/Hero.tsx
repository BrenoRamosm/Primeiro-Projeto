import { motion } from "framer-motion";
import { useState, useEffect } from "react";

export default function Hero() {
  const [status, setStatus] = useState<'connecting' | 'online'>('connecting');
  const [dots, setDots] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      setStatus('online');
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (status === 'connecting') {
      const dotInterval = setInterval(() => {
        setDots(prev => prev.length >= 3 ? '' : prev + '.');
      }, 500);
      return () => clearInterval(dotInterval);
    }
  }, [status]);

  return (
    <section className="relative min-h-[80vh] flex flex-col items-center justify-center px-6 pt-20 text-center overflow-hidden">
      
      {/* Dynamic Background Image */}
      <div 
        className={`absolute inset-0 z-0 bg-cover bg-center transition-all duration-[3000ms] ease-in-out ${status === 'online' ? 'opacity-40 scale-100' : 'opacity-0 scale-105'}`}
        style={{ backgroundImage: "url('/img/hero-bg.jpg')" }}
      />
      <div className="absolute inset-0 bg-kurobeni/60 z-0 mix-blend-multiply pointer-events-none" />
      {/* Decorative center line */}
      <motion.div 
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: 160, opacity: 0.3 }}
        transition={{ duration: 1.5, delay: 0.2, ease: "easeOut" }}
        className="absolute top-0 left-1/2 -translate-x-1/2 w-px bg-odradek"
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.5 }}
        className="max-w-3xl relative z-10"
      >
        <div className={`font-mono text-sm mb-4 tracking-[0.3em] uppercase transition-colors duration-1000 ${status === 'connecting' ? 'text-odradek animate-pulse' : 'text-blue-500 animate-none opacity-80'}`}>
          [ {status === 'connecting' ? `Connecting to chiral network${Math.floor(Date.now() / 500) % 4 === 0 ? '' : dots}` : 'Online'} ]
        </div>
        
        <div className="relative h-28 md:h-40 lg:h-48 mb-6 flex flex-col justify-center">
          <h1 className={`absolute inset-x-0 font-orbitron text-4xl md:text-6xl lg:text-7xl font-bold tracking-tighter text-bleached-silk uppercase leading-none transition-opacity duration-1000 ${status === 'connecting' ? 'opacity-100' : 'opacity-0'}`}>
            Tomorrow <br/> Is In Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-december-sky to-shining-knight">Hands</span>
          </h1>
          <h1 className={`absolute inset-x-0 font-orbitron text-4xl md:text-6xl lg:text-7xl font-bold tracking-tighter text-bleached-silk uppercase leading-none transition-opacity duration-1000 ${status === 'online' ? 'opacity-100' : 'opacity-0 delay-500'}`}>
            For Ludens <br/> Who <span className="text-transparent bg-clip-text bg-gradient-to-r from-december-sky to-shining-knight">Dare?</span>
          </h1>
        </div>
        
        <p className="font-inter text-december-sky text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
          Embark on a journey across a shattered America. Reconnect the isolated remnants of humanity and brave the Beached Things in this atmospheric role-playing experience.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <motion.a 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            href="#classes" 
            className="px-8 py-3 bg-odradek text-kurobeni font-orbitron font-bold uppercase tracking-widest text-sm hover:brightness-110 transition-all border border-odradek"
          >
            Acknowledge Order
          </motion.a>
          
          <motion.a 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            href="#archive" 
            className="px-8 py-3 bg-transparent text-bleached-silk font-mono uppercase tracking-widest text-sm hover:bg-shining-knight/10 transition-all border border-shining-knight/30"
          >
            View Data Archive
          </motion.a>
        </div>
      </motion.div>
      
      {/* Scroll indicator */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="font-mono text-xs text-shining-knight tracking-widest">SCROLL</span>
        <motion.div 
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          className="w-px h-12 bg-gradient-to-b from-shining-knight to-transparent"
        />
      </motion.div>
    </section>
  );
}
