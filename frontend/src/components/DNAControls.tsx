import { useState } from 'react';
import { ChevronDown, Camera, Sun, Palette, Cloud } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Slider } from './Slider';
import { Dropdown } from './Dropdown';
import type { CinematographyDNA } from '../types/api';

interface DNAControlsProps {
  dna: CinematographyDNA;
  onChange: (dna: CinematographyDNA) => void;
}

interface SectionProps {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  defaultOpen?: boolean;
  accentColor?: string;
}

function Section({ title, icon, children, defaultOpen = true, accentColor = 'purple' }: SectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  const colorClasses: Record<string, string> = {
    purple: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
    cyan: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
    amber: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    emerald: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  };

  return (
    <motion.div
      className="rounded-xl overflow-hidden border border-zinc-800/50"
      initial={false}
      animate={{ borderColor: isOpen ? 'rgba(124, 58, 237, 0.2)' : 'rgba(39, 39, 42, 0.5)' }}
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-5 py-4 flex items-center justify-between bg-zinc-900/50 hover:bg-zinc-800/50 transition-all duration-300"
      >
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${colorClasses[accentColor]} border`}>
            {icon}
          </div>
          <span className="font-semibold text-sm uppercase tracking-wider">{title}</span>
        </div>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="text-zinc-500"
        >
          <ChevronDown className="w-4 h-4" />
        </motion.div>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="p-5 space-y-5 bg-zinc-950/50 border-t border-zinc-800/50">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export function DNAControls({ dna, onChange }: DNAControlsProps) {
  const updateCamera = (key: string, value: unknown) => {
    onChange({
      ...dna,
      camera: { ...dna.camera, [key]: value },
    });
  };

  const updateLighting = (key: string, value: unknown) => {
    onChange({
      ...dna,
      lighting: { ...dna.lighting, [key]: value },
    });
  };

  const updateColor = (key: string, value: unknown) => {
    onChange({
      ...dna,
      color: { ...dna.color, [key]: value },
    });
  };

  const updateAtmosphere = (key: string, value: unknown) => {
    onChange({
      ...dna,
      atmosphere: { ...dna.atmosphere, [key]: value },
    });
  };

  return (
    <div className="grid md:grid-cols-2 gap-4">
      <Section title="Camera" icon={<Camera className="w-4 h-4" />} accentColor="purple">
        <Dropdown
          label="Angle"
          value={dna.camera.angle}
          options={['eye_level', 'low_angle', 'high_angle', 'dutch_angle', 'birds_eye', 'worms_eye']}
          onChange={(v) => updateCamera('angle', v)}
        />
        <Dropdown
          label="Field of View"
          value={dna.camera.fov}
          options={['wide', 'normal', 'telephoto', 'ultra_wide']}
          onChange={(v) => updateCamera('fov', v)}
        />
        <Slider
          label="Lens"
          value={dna.camera.lens_mm}
          min={14}
          max={200}
          step={1}
          onChange={(v) => updateCamera('lens_mm', v)}
          unit="mm"
        />
        <Dropdown
          label="Depth of Field"
          value={dna.camera.depth_of_field}
          options={['shallow', 'medium', 'deep']}
          onChange={(v) => updateCamera('depth_of_field', v)}
        />
        <Dropdown
          label="Shot Type"
          value={dna.camera.shot_type}
          options={['extreme_close_up', 'close_up', 'medium', 'full', 'wide', 'extreme_wide']}
          onChange={(v) => updateCamera('shot_type', v)}
        />
      </Section>

      <Section title="Lighting" icon={<Sun className="w-4 h-4" />} accentColor="amber">
        <Dropdown
          label="Direction"
          value={dna.lighting.direction}
          options={['front', 'back', 'side', 'top', 'bottom', 'rim', 'three_point']}
          onChange={(v) => updateLighting('direction', v)}
        />
        <Slider
          label="Intensity"
          value={dna.lighting.intensity}
          min={0}
          max={1}
          step={0.1}
          onChange={(v) => updateLighting('intensity', v)}
        />
        <Slider
          label="Color Temperature"
          value={dna.lighting.color_temp}
          min={2000}
          max={10000}
          step={100}
          onChange={(v) => updateLighting('color_temp', v)}
          unit="K"
        />
        <Dropdown
          label="Style"
          value={dna.lighting.style}
          options={['natural', 'dramatic', 'soft', 'hard', 'chiaroscuro', 'flat']}
          onChange={(v) => updateLighting('style', v)}
        />
        <Dropdown
          label="Time of Day"
          value={dna.lighting.time_of_day}
          options={['day', 'golden_hour', 'blue_hour', 'night', 'twilight']}
          onChange={(v) => updateLighting('time_of_day', v)}
        />
      </Section>

      <Section title="Color" icon={<Palette className="w-4 h-4" />} accentColor="cyan">
        <Slider
          label="Saturation"
          value={dna.color.saturation}
          min={0}
          max={1}
          step={0.1}
          onChange={(v) => updateColor('saturation', v)}
        />
        <Slider
          label="Contrast"
          value={dna.color.contrast}
          min={0}
          max={1}
          step={0.1}
          onChange={(v) => updateColor('contrast', v)}
        />
        <Dropdown
          label="Mood"
          value={dna.color.mood}
          options={['neutral', 'warm', 'cool', 'vibrant', 'muted', 'desaturated']}
          onChange={(v) => updateColor('mood', v)}
        />
        <Dropdown
          label="Grade"
          value={dna.color.grade}
          options={['natural', 'cinematic', 'vintage', 'bleach_bypass', 'teal_orange', 'monochrome']}
          onChange={(v) => updateColor('grade', v)}
        />
      </Section>

      <Section title="Atmosphere" icon={<Cloud className="w-4 h-4" />} accentColor="emerald">
        <Dropdown
          label="Weather"
          value={dna.atmosphere.weather}
          options={['clear', 'cloudy', 'foggy', 'rainy', 'snowy', 'stormy']}
          onChange={(v) => updateAtmosphere('weather', v)}
        />
        <Dropdown
          label="Particles"
          value={dna.atmosphere.particles}
          options={['none', 'dust', 'smoke', 'rain', 'snow', 'sparks']}
          onChange={(v) => updateAtmosphere('particles', v)}
        />
        <Slider
          label="Haze"
          value={dna.atmosphere.haze}
          min={0}
          max={1}
          step={0.1}
          onChange={(v) => updateAtmosphere('haze', v)}
        />
        <Dropdown
          label="Environment"
          value={dna.atmosphere.environment}
          options={['interior', 'exterior', 'urban', 'rural', 'industrial', 'natural']}
          onChange={(v) => updateAtmosphere('environment', v)}
        />
      </Section>
    </div>
  );
}
