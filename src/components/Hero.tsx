import { useState } from 'react';
import { motion } from 'motion/react';
import { MessageSquare, Calendar, ShieldCheck, Award, Clock, MapPin } from 'lucide-react';
import { driverProfile } from '../data/driverData';
import { useI18n } from '../i18n/LanguageContext';

import heroDriverImg from '../assets/images/mario_duarte_foto_real.jpg';

interface HeroProps {
  onOpenContactModal: () => void;
}

export default function Hero({ onOpenContactModal }: HeroProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const { t } = useI18n();

  const handleWhatsAppBooking = () => {
    const text = encodeURIComponent(
      `Olá Mário Duarte! Vi o seu site e gostaria de agendar uma viagem com seu C4 Cactus aqui em Fortaleza.`
    );
    window.open(`https://wa.me/${driverProfile.whatsappNumber}?text=${text}`, '_blank');
  };

  return (
    <section className="relative pt-6 pb-16 lg:pt-12 lg:pb-24 overflow-hidden border-b border-white/10">
      {/* Background ambient lighting subtle glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-amber-500/5 blur-[120px] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Unboxed editorial top kicker - NO PILLS */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="flex flex-wrap items-center gap-2 text-xs sm:text-sm text-neutral-400 mb-6 font-medium"
        >
          <span className="text-amber-400">{t.hero.kicker1}</span>
          <span aria-hidden="true">·</span>
          <span>{t.hero.kicker2}</span>
          <span aria-hidden="true">·</span>
          <span>{t.hero.kicker3}</span>
        </motion.div>

        {/* 2-Column Desktop Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch">
          
          {/* Column 1: Copy and Primary CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.21, 0.47, 0.32, 0.98] }}
            className="lg:col-span-7 flex flex-col justify-center"
          >
            
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-[1.15] text-balance">
              {t.hero.title}
            </h1>

            <p className="mt-5 text-base sm:text-lg text-neutral-300 leading-relaxed max-w-2xl">
              {t.hero.introBefore}<strong className="text-white font-semibold">{driverProfile.name}</strong>{t.hero.introAfter}
            </p>

            {/* Credibility highlights text line */}
            <div className="mt-6 flex flex-wrap items-center gap-y-2 gap-x-4 text-xs sm:text-sm text-neutral-400">
              <div className="flex items-center gap-1.5 text-neutral-200">
                <MapPin className="w-4 h-4 text-amber-400 shrink-0" />
                <span className="font-semibold text-white">{t.hero.place}</span>
              </div>
              <span aria-hidden="true">·</span>
              <div className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-amber-400 shrink-0" />
                <span>{t.hero.punctuality}</span>
              </div>
            </div>

            {/* Action buttons */}
            <div className="mt-8 flex flex-wrap items-center gap-3 sm:gap-4">
              <button
                onClick={handleWhatsAppBooking}
                className="flex items-center gap-2.5 px-6 py-3.5 text-sm font-semibold text-neutral-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-all duration-200 shadow-md shadow-amber-400/20 active:scale-95 whitespace-nowrap cursor-pointer"
              >
                <MessageSquare className="w-4 h-4 text-neutral-950" />
                <span>{t.hero.ctaWhatsApp}</span>
              </button>

              <a
                href="#simulador"
                className="flex items-center gap-2 px-5 py-3.5 text-sm font-medium text-white bg-neutral-900 border border-white/15 hover:border-amber-400/40 hover:bg-neutral-850 rounded-lg transition-colors whitespace-nowrap"
              >
                <Calendar className="w-4 h-4 text-amber-400" />
                <span>{t.hero.ctaSimulate}</span>
              </a>

              <button
                onClick={onOpenContactModal}
                className="text-xs sm:text-sm font-medium text-neutral-400 hover:text-white underline underline-offset-4 decoration-neutral-600 transition-colors py-2 whitespace-nowrap cursor-pointer"
              >
                {t.hero.ctaSave}
              </button>
            </div>

            {/* Badges and recognitions - Clean unboxed presentation */}
            <div className="mt-10 pt-6 border-t border-white/10">
              <div className="text-xs uppercase tracking-wider text-neutral-500 font-semibold mb-3">
                {t.hero.highlightsTitle}
              </div>
              <div className="flex flex-wrap items-center gap-2">
                {t.hero.badges.map((badge) => (
                  <div
                    key={badge}
                    className="inline-flex items-center gap-2 px-3 py-1.5 bg-neutral-900/80 border border-white/5 rounded-md text-xs text-neutral-300"
                  >
                    <Award className="w-3.5 h-3.5 text-amber-400" />
                    <span>{badge}</span>
                  </div>
                ))}
              </div>
            </div>

          </motion.div>

          {/* Column 2: Marquee Driver Visual Portrait */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.2, ease: [0.21, 0.47, 0.32, 0.98] }}
            className="lg:col-span-5 relative flex items-center justify-center"
          >
            <div className="relative w-full aspect-[4/5] lg:aspect-auto lg:h-full min-h-[400px] rounded-xl overflow-hidden border border-white/10 bg-neutral-900 shadow-2xl group">
              
              {/* Fallback container with gradient and icon */}
              <div className="absolute inset-0 bg-neutral-900 flex flex-col items-center justify-center p-6 text-center">
                <div className="w-16 h-16 rounded-full bg-neutral-800 flex items-center justify-center mb-3">
                  <Award className="w-8 h-8 text-amber-400" />
                </div>
                <div className="text-sm font-medium text-neutral-200">Mário Duarte</div>
                <div className="text-xs text-neutral-500 mt-1">Citroën C4 Cactus </div>
              </div>

              {/* Real Generated Photograph */}
              <img
                src={heroDriverImg}
                alt={t.hero.photoAlt}
                referrerPolicy="no-referrer"
                onLoad={() => setImageLoaded(true)}
                className={`absolute inset-0 w-full h-full object-cover object-[50%_20%] transition-all duration-700 ${
                  imageLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
                }`}
              />

              {/* Measured contrast scrim */}
              <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/90 via-neutral-950/20 to-transparent pointer-events-none" />

              {/* Bottom overlay credential caption */}
              <div className="absolute bottom-4 left-4 right-4 p-4 rounded-lg bg-neutral-950/85 backdrop-blur-md border border-white/10 flex items-center justify-between gap-4">
                <div>
                  <div className="text-xs text-amber-400 font-medium">{driverProfile.name}</div>
                  <div className="text-sm font-semibold text-white">C4 Cactus</div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-neutral-400">{t.hero.experience}</div>
                  <div className="text-sm font-bold text-amber-400 font-mono">
                    {t.hero.trips}
                  </div>
                </div>
              </div>

            </div>
          </motion.div>

        </div>

        {/* 4-Column Proof & Metrics Strip in a Full-Width Row Below the Split */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.35, ease: 'easeOut' }}
          className="mt-12 lg:mt-16 pt-8 border-t border-white/10 grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8"
        >
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold text-amber-400 font-mono tabular-nums">
              {t.hero.stat1Value}
            </div>
            <div className="mt-1 text-xs sm:text-sm text-neutral-400">
              {t.hero.stat1Label}
            </div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono tabular-nums">
              C4 Cactus
            </div>
            <div className="mt-1 text-xs sm:text-sm text-neutral-400">
              {t.hero.stat2Label}
            </div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono tabular-nums">
              Fortaleza
            </div>
            <div className="mt-1 text-xs sm:text-sm text-neutral-400">
              {t.hero.stat3Label}
            </div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400 font-mono tabular-nums">
              100%
            </div>
            <div className="mt-1 text-xs sm:text-sm text-neutral-400">
              {t.hero.stat4Label}
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
