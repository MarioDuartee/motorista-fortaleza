import { Plane, Navigation, Briefcase, PartyPopper, Check, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';
import { driverProfile } from '../data/driverData';
import { useI18n } from '../i18n/LanguageContext';
import type { ServiceId } from '../types';

interface ServicesSectionProps {
  onSelectServiceForQuote: (serviceId: ServiceId) => void;
}

export default function ServicesSection({ onSelectServiceForQuote }: ServicesSectionProps) {
  const { t } = useI18n();
  const serviceIcons: Record<string, React.ElementType> = {
    transfers: Plane,
    beachpark: Navigation,
    litoral: Navigation,
    diaria: Briefcase
  };

  return (
    <section id="servicos" className="py-16 lg:py-24 border-b border-white/10 bg-neutral-900/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="max-w-3xl">
          <div className="text-xs font-semibold uppercase tracking-wider text-amber-400 mb-2">
            {t.services.kicker}
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight text-balance">
            {t.services.title}
          </h2>
          <p className="mt-3 text-base text-neutral-300">
            {t.services.subtitle}
          </p>
        </div>

        {/* Services 2x2 Grid with Bento Hierarchy */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {t.services.items.map((service, idx) => {
            const Icon = serviceIcons[service.id] || Navigation;

            return (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.55, delay: idx * 0.12, ease: [0.21, 0.47, 0.32, 0.98] }}
                className="p-6 sm:p-8 rounded-xl bg-neutral-900/70 border border-white/10 hover:border-amber-400/40 transition-all duration-300 flex flex-col justify-between group shadow-lg"
              >
                <div>
                  <div className="flex items-start justify-between gap-4">
                    <div className="p-3 rounded-lg bg-neutral-800 text-amber-400 group-hover:bg-amber-400/10 transition-colors">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="font-mono text-xs sm:text-sm font-semibold text-neutral-300 bg-neutral-800/80 px-3 py-1 rounded-md border border-white/5">
                      {service.price}
                    </span>
                  </div>

                  <h3 className="mt-5 text-lg sm:text-xl font-bold text-white group-hover:text-amber-400 transition-colors">
                    {service.title}
                  </h3>

                  <p className="mt-3 text-sm text-neutral-300 leading-relaxed">
                    {service.description}
                  </p>

                  {/* Unboxed editorial tags */}
                  <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-neutral-400 font-medium">
                    {service.tags.map((tag, i) => (
                      <span key={tag} className="flex items-center gap-1">
                        {i > 0 && <span className="text-neutral-600">/</span>}
                        <span>{tag}</span>
                      </span>
                    ))}
                  </div>

                  {/* Highlights */}
                  <div className="mt-6 pt-6 border-t border-white/10 space-y-2.5">
                    {service.highlights.map((h, i) => (
                      <div key={i} className="flex items-start gap-2 text-xs sm:text-sm text-neutral-300">
                        <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{h}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-8 pt-4">
                  <button
                    onClick={() => onSelectServiceForQuote(service.id as ServiceId)}
                    className="w-full flex items-center justify-center gap-2 py-3 px-4 text-xs sm:text-sm font-semibold text-white bg-neutral-800 hover:bg-amber-400 hover:text-neutral-950 rounded-lg transition-all duration-200 cursor-pointer"
                  >
                    <span>{t.services.quoteButton}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Region Banner */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-10 p-6 rounded-xl bg-neutral-950 border border-white/10 flex flex-col md:flex-row items-center justify-between gap-6"
        >
          <div className="text-center md:text-left">
            <h4 className="text-sm font-bold text-white">
              {t.services.regionTitle}
            </h4>
            <p className="mt-1 text-xs text-neutral-400">
              {t.services.cities.join(' · ')}{t.services.regionSuffix}
            </p>
          </div>
          <a
            href={`https://wa.me/${driverProfile.whatsappNumber}?text=${encodeURIComponent('Olá Mário! Gostaria de consultar se você atende uma rota específica para...')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 text-xs font-semibold text-amber-400 hover:text-amber-300 border border-amber-400/30 hover:border-amber-400 rounded-lg transition-colors whitespace-nowrap shrink-0"
          >
            {t.services.customRoute}
          </a>
        </motion.div>

      </div>
    </section>
  );
}
