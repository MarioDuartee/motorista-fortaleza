import { useState } from 'react';
import { motion } from 'motion/react';
import { Shield, Clock, Thermometer, Sparkles, CheckCircle2, UserCheck, FileText, Download } from 'lucide-react';
import { driverProfile } from '../data/driverData';
import { useI18n } from '../i18n/LanguageContext';

import c4ExteriorImg from '../assets/images/c4_cactus_white_suv_1791550207794.jpg';

interface AboutSectionProps {
  onOpenContactModal: () => void;
}

export default function AboutSection({ onOpenContactModal }: AboutSectionProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const { t } = useI18n();

  const pillarMeta = [
    { index: '01', icon: Clock },
    { index: '02', icon: Thermometer },
    { index: '03', icon: Shield },
    { index: '04', icon: Sparkles },
  ];
  const pillars = pillarMeta.map((meta, i) => ({ ...meta, ...t.about.pillars[i] }));

  return (
    <section id="apresentacao" className="py-16 lg:py-24 border-b border-white/10 bg-neutral-900/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl">
          <div className="text-xs font-semibold uppercase tracking-wider text-amber-400 mb-2">
            {t.about.kicker}
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight text-balance">
            {t.about.title}
          </h2>
          <p className="mt-4 text-base text-neutral-300 leading-relaxed">
            {t.about.text}
          </p>
        </div>

        {/* 2-Column Split: Pillars & Visual Vehicle */}
        <div className="mt-12 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch">
          
          {/* Column 1: Editorial Pillars List */}
          <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {pillars.map((pillar, idx) => {
                const IconComponent = pillar.icon;
                return (
                  <motion.div
                    key={pillar.index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: idx * 0.1, ease: 'easeOut' }}
                    className="p-5 rounded-xl bg-neutral-900/60 border border-white/10 hover:border-amber-400/30 transition-all duration-200"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-mono text-xs font-bold text-amber-400">
                        {pillar.index}
                      </span>
                      <IconComponent className="w-5 h-5 text-neutral-400" />
                    </div>
                    <h3 className="text-base font-semibold text-white">
                      {pillar.title}
                    </h3>
                    <p className="mt-2 text-xs sm:text-sm text-neutral-300 leading-relaxed">
                      {pillar.description}
                    </p>
                  </motion.div>
                );
              })}
            </div>

            {/* Document Verification & Security Strip */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="p-5 rounded-xl bg-neutral-950 border border-white/10"
            >
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-3">
                <UserCheck className="w-4 h-4 text-emerald-400" />
                <span>{t.about.safetyTitle}</span>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-neutral-300">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{t.about.safety[0]}</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{t.about.safety[1]}</span>
                </div>

                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{t.about.safety[2]}</span>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-white/10 flex flex-wrap items-center justify-between gap-3">
                <span className="text-xs text-neutral-500">
                  {t.about.flexible}
                </span>
                <button
                  onClick={onOpenContactModal}
                  className="flex items-center gap-1.5 text-xs font-medium text-amber-400 hover:text-amber-300 transition-colors cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>{t.about.saveContact}</span>
                </button>
              </div>
            </motion.div>

          </div>

          {/* Column 2: Vehicle Exterior In Context */}
          <div className="lg:col-span-5 relative flex flex-col">
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              className="relative flex-1 min-h-[340px] rounded-xl overflow-hidden border border-white/10 bg-neutral-900 group"
            >
              
              {/* Fallback frame */}
              <div className="absolute inset-0 bg-neutral-900 flex flex-col items-center justify-center p-6 text-center">
                <FileText className="w-10 h-10 text-neutral-600 mb-2" />
                <span className="text-xs text-neutral-400">Citroën C4 Cactus</span>
              </div>

              <img
                src={c4ExteriorImg}
                alt={t.about.imageAlt}
                referrerPolicy="no-referrer"
                onLoad={() => setImageLoaded(true)}
                className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 ${
                  imageLoaded ? 'opacity-100' : 'opacity-0'
                }`}
              />

              <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/90 via-transparent to-transparent pointer-events-none" />

              <div className="absolute bottom-4 left-4 right-4 p-4 rounded-lg bg-neutral-950/85 backdrop-blur-md border border-white/10">
                <div className="text-xs text-amber-400 font-medium">Citroën C4 Cactus</div>
                <div className="text-sm font-semibold text-white">{t.about.imageTitle}</div>
                <div className="mt-1 text-xs text-neutral-400">
                  {t.about.imageText}
                </div>
              </div>
            </motion.div>
          </div>

        </div>

      </div>
    </section>
  );
}
