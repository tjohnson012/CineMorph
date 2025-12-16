import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Download, Shuffle, Layers } from 'lucide-react';
import { Button } from '../components/Button';
import { Card } from '../components/Card';

const features = [
  {
    icon: Download,
    title: 'Extract',
    description: 'Analyze any image to extract its cinematographic DNA - lighting, camera angles, color grading, and atmosphere.',
  },
  {
    icon: Shuffle,
    title: 'Remix',
    description: 'Fine-tune every aspect of the extracted DNA. Adjust camera work, lighting, colors, and mood to perfection.',
  },
  {
    icon: Layers,
    title: 'Blend',
    description: 'Merge the styles of two different films. Create unique hybrids by blending cinematographic elements.',
  },
];

const directors = [
  {
    name: 'Stanley Kubrick',
    trait: 'Symmetrical perfection',
    gradient: 'bg-gradient-to-b from-blue-200 via-slate-400 to-blue-900',
    overlay: 'before:absolute before:inset-0 before:bg-[linear-gradient(90deg,transparent_49.5%,rgba(255,255,255,0.3)_49.5%,rgba(255,255,255,0.3)_50.5%,transparent_50.5%)]'
  },
  {
    name: 'Quentin Tarantino',
    trait: 'Bold colors & violence',
    gradient: 'bg-gradient-to-br from-yellow-500 via-red-600 to-amber-900',
    overlay: 'before:absolute before:inset-0 before:bg-[radial-gradient(circle_at_30%_70%,rgba(0,0,0,0.4)_0%,transparent_50%)]'
  },
  {
    name: 'Wes Anderson',
    trait: 'Pastel whimsy',
    gradient: 'bg-gradient-to-r from-pink-300 via-amber-200 to-teal-300',
    overlay: 'before:absolute before:inset-0 before:bg-[linear-gradient(90deg,transparent_49%,rgba(255,255,255,0.2)_49%,rgba(255,255,255,0.2)_51%,transparent_51%)]'
  },
  {
    name: 'Denis Villeneuve',
    trait: 'Epic scale & mood',
    gradient: 'bg-gradient-to-b from-orange-400/60 via-stone-600 to-teal-900',
    overlay: 'before:absolute before:inset-0 before:bg-[linear-gradient(to_bottom,transparent_60%,rgba(0,0,0,0.5)_100%)]'
  },
  {
    name: 'Christopher Nolan',
    trait: 'Dark realism',
    gradient: 'bg-gradient-to-br from-slate-700 via-blue-950 to-zinc-900',
    overlay: 'before:absolute before:inset-0 before:bg-[radial-gradient(ellipse_at_top,rgba(100,150,200,0.15)_0%,transparent_60%)]'
  },
  {
    name: 'Wong Kar-wai',
    trait: 'Neon romance',
    gradient: 'bg-gradient-to-br from-emerald-500 via-fuchsia-600 to-blue-700',
    overlay: 'before:absolute before:inset-0 before:backdrop-blur-[1px] before:bg-[radial-gradient(circle_at_20%_80%,rgba(255,0,150,0.3)_0%,transparent_40%),radial-gradient(circle_at_80%_20%,rgba(0,255,200,0.3)_0%,transparent_40%)]'
  },
  {
    name: 'David Fincher',
    trait: 'Cold precision',
    gradient: 'bg-gradient-to-b from-yellow-900/40 via-green-950 to-zinc-900',
    overlay: 'before:absolute before:inset-0 before:bg-[linear-gradient(180deg,rgba(100,120,50,0.2)_0%,transparent_100%)]'
  },
  {
    name: 'Steven Spielberg',
    trait: 'Warm nostalgia',
    gradient: 'bg-gradient-to-br from-amber-400 via-orange-500 to-yellow-600',
    overlay: 'before:absolute before:inset-0 before:bg-[radial-gradient(circle_at_70%_30%,rgba(255,255,255,0.6)_0%,rgba(255,200,100,0.2)_30%,transparent_60%)]'
  },
];

const steps = [
  {
    number: '01',
    title: 'Upload Your Image',
    description: 'Start with any film still, photograph, or reference image.',
  },
  {
    number: '02',
    title: 'Extract & Analyze',
    description: 'Our AI identifies camera angles, lighting, colors, and atmosphere.',
  },
  {
    number: '03',
    title: 'Remix & Export',
    description: 'Adjust parameters or apply director presets. Export in professional formats.',
  },
];

export function Landing() {
  return (
    <div className="relative">
      <section className="relative min-h-screen flex items-center justify-center gradient-bg overflow-hidden">
        {/* Film grain overlay */}
        <div className="absolute inset-0 film-grain opacity-30 pointer-events-none z-20" />

        {/* Animated gradient orbs */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 -left-1/4 w-[600px] h-[600px] bg-purple-600/20 rounded-full blur-[120px] animate-pulse" />
          <div className="absolute bottom-1/4 -right-1/4 w-[500px] h-[500px] bg-cyan-600/15 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '1s' }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-violet-600/10 rounded-full blur-[150px]" />
        </div>

        {/* Radial gradient overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(124,58,237,0.15)_0%,transparent_60%)]" />
        
        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-7xl font-bold mb-6 bg-gradient-to-r from-white via-purple-200 to-white bg-clip-text text-transparent">
              The DNA of Cinema.
              <br />
              Now Yours to Control.
            </h1>
            <p className="text-2xl text-zinc-400 mb-12 max-w-3xl mx-auto">
              Extract the exact lighting, camera work, and color palette from any film.
              Remix it. Make it yours.
            </p>
            <Link to="/studio">
              <Button variant="primary" className="text-lg px-10 py-4">
                Start Creating
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      <section className="py-24 bg-black">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
                viewport={{ once: true }}
              >
                <Card>
                  <feature.icon className="w-12 h-12 text-purple-500 mb-4" />
                  <h3 className="text-2xl font-semibold mb-3">{feature.title}</h3>
                  <p className="text-zinc-400">{feature.description}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 bg-zinc-950">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl font-bold mb-4">Director Presets</h2>
            <p className="text-xl text-zinc-400">
              Apply the signature style of legendary filmmakers
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {directors.map((director, index) => (
              <motion.div
                key={director.name}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="text-center group cursor-pointer">
                  <div className={`relative w-full h-32 ${director.gradient} rounded-lg mb-4 overflow-hidden ${director.overlay}`} />
                  <h3 className="font-semibold mb-2 group-hover:text-purple-400 transition-colors">{director.name}</h3>
                  <p className="text-sm text-zinc-500">{director.trait}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 bg-black">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl font-bold mb-4">How It Works</h2>
            <p className="text-xl text-zinc-400">Three simple steps to cinematic mastery</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-12">
            {steps.map((step, index) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.3, duration: 0.6, ease: "easeOut" }}
                viewport={{ once: true, margin: "-100px" }}
                className="relative"
              >
                <motion.div
                  className="text-8xl font-bold text-purple-500/20 mb-4"
                  initial={{ scale: 0.8 }}
                  whileInView={{ scale: 1 }}
                  transition={{ delay: index * 0.3 + 0.2, duration: 0.4 }}
                  viewport={{ once: true }}
                >
                  {step.number}
                </motion.div>
                <h3 className="text-2xl font-semibold mb-3">{step.title}</h3>
                <p className="text-zinc-400">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}