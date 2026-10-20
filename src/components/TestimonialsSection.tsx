import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Star, Quote, CheckCircle2 } from 'lucide-react';
import { driverProfile } from '../data/driverData';

type FilterCategory = 'todos' | 'executivo' | 'aeroporto' | 'familia';

export default function TestimonialsSection() {
  const [activeFilter, setActiveFilter] = useState<FilterCategory>('todos');

  const filterTabs = [
    { id: 'todos', label: 'Todos os Depoimentos' },
    { id: 'executivo', label: 'Corporativo & Executivo' },
    { id: 'aeroporto', label: 'Translados Aeroporto' },
    { id: 'familia', label: 'Famílias & Viagens' }
  ];

  const filtered = activeFilter === 'todos'
    ? driverProfile.testimonials
    : driverProfile.testimonials.filter((t) => t.category === activeFilter);

  return (
    <section id="avaliacoes" className="py-16 lg:py-24 border-b border-white/10 bg-neutral-900/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading & Filter Tabs */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="max-w-2xl">
            <div className="text-xs font-semibold uppercase tracking-wider text-amber-400 mb-2">
              Depoimentos & Experiências Reais
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight">
              A confiança de quem viaja conosco com frequência
            </h2>
            <p className="mt-3 text-base text-neutral-300">
              Avaliações autênticas de diretores executivos, médicos, famílias e viajantes que transformaram suas rotinas.
            </p>
          </div>

          {/* Interactive filter tabs */}
          <div className="flex flex-wrap items-center gap-1.5 p-1 bg-neutral-900 border border-white/10 rounded-lg shrink-0">
            {filterTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveFilter(tab.id as FilterCategory)}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                  activeFilter === tab.id
                    ? 'bg-amber-400 text-neutral-950 font-semibold shadow-sm'
                    : 'text-neutral-300 hover:text-white hover:bg-neutral-800'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Testimonials 2-Column Grid */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          <AnimatePresence mode="popLayout">
            {filtered.map((item, idx) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.45, delay: idx * 0.08 }}
                className="p-6 sm:p-8 rounded-xl bg-neutral-950/80 border border-white/10 flex flex-col justify-between hover:border-amber-400/30 transition-all duration-200"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-1">
                      {[...Array(item.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 text-amber-400 fill-amber-400" />
                      ))}
                    </div>
                    <Quote className="w-6 h-6 text-neutral-700" />
                  </div>

                  <p className="text-sm sm:text-base text-neutral-200 leading-relaxed italic">
                    "{item.text}"
                  </p>

                  {/* Traveled route tag */}
                  <div className="mt-4 pt-3 border-t border-white/5 text-xs font-mono text-neutral-400 flex items-center gap-1.5">
                    <span className="text-amber-400">Rota:</span>
                    <span className="truncate">{item.route}</span>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between">
                  <div>
                    <div className="text-sm font-semibold text-white flex items-center gap-1.5">
                      <span>{item.author}</span>
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    </div>
                    <div className="text-xs text-neutral-400">
                      {item.role} {item.company ? `· ${item.company}` : ''}
                    </div>
                  </div>

                  <div className="text-xs text-neutral-500 font-mono">
                    {item.date}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Uber/99 Verified Scorecard Summary Strip */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-12 p-6 sm:p-8 rounded-xl bg-neutral-900 border border-white/10 flex flex-col lg:flex-row items-center justify-between gap-6"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-400/10 border border-amber-400/20 flex items-center justify-center text-amber-400 font-extrabold text-xl font-mono">
              ★
            </div>
            <div>
              <div className="text-sm font-bold text-white">
                Avaliação Verificada pelos Aplicativos Parceiros
              </div>
              <div className="text-xs text-neutral-400">
                Padrão Diamante / VIP com mais de 99.8% de viagens concluídas sem incidentes.
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-6 text-xs sm:text-sm">
            <div>
              <span className="text-neutral-500">Nota Uber: </span>
              <span className="font-bold text-white font-mono">4.99 ⭐</span>
            </div>
            <div>
              <span className="text-neutral-500">Nota 99: </span>
              <span className="font-bold text-white font-mono">5.0 ⭐</span>
            </div>
            <div>
              <span className="text-neutral-500">Cancelamentos: </span>
              <span className="font-bold text-emerald-400 font-mono">0% pelo motorista</span>
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
