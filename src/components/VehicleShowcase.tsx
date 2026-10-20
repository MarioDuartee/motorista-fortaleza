import { useState } from 'react';
import { Wifi, Coffee, Thermometer, Volume2, Sparkles, Briefcase, Car, Check, ChevronRight } from 'lucide-react';
import { driverProfile } from '../data/driverData';

import exteriorImg from '../assets/images/c4_cactus_white_suv_1791550207794.jpg';
import interiorImg from '../assets/images/c4_cactus_interior_1791550216768.jpg';

type ViewMode = 'exterior' | 'interior' | 'cockpit';

export default function VehicleShowcase() {
  const [activeView, setActiveView] = useState<ViewMode>('exterior');
  const [activeAmenityId, setActiveAmenityId] = useState<string>('climate');

  const views = [
    { id: 'exterior', label: 'C4 Cactus Branco (Exterior)', short: 'Exterior', img: exteriorImg, caption: 'Citroën C4 Cactus Feel Pack 2022 Branco: SUV moderno, linhas marcantes e presença elegante.' },
    { id: 'interior', label: 'Cabine & Conforto Traseiro', short: 'Cabine', img: interiorImg, caption: 'Interior higienizado, bancos confortáveis, ar-condicionado gelado e água mineral disponível.' },
  ];

  const currentViewObj = views.find((v) => v.id === activeView) || views[0];

  const iconMap: Record<string, React.ElementType> = {
    Thermometer,
    Coffee,
    Wifi,
    Volume2,
    Briefcase,
    Sparkles
  };

  return (
    <section id="veiculo" className="py-16 lg:py-24 border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="max-w-2xl">
            <div className="text-xs font-semibold uppercase tracking-wider text-amber-400 mb-2">
              O Veículo
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight">
              Citroën C4 Cactus Feel Pack 2022 Branco
            </h2>
            <p className="mt-3 text-base text-neutral-300">
              Conforto de SUV francês com suspensão macia, ar-condicionado potente e espaço ideal para você e suas malas.
            </p>
          </div>

          {/* Interactive View Switcher Tabs - functional filter buttons */}
          <div className="grid grid-cols-2 md:flex md:items-center gap-1.5 p-1 w-full md:w-auto bg-neutral-900 border border-white/10 rounded-lg">
            {views.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveView(tab.id as ViewMode)}
                className={`px-2 sm:px-3 py-2 text-xs sm:text-sm font-medium text-center rounded-md transition-colors md:whitespace-nowrap cursor-pointer ${
                  activeView === tab.id
                    ? 'bg-amber-400 text-neutral-950 font-semibold shadow-sm'
                    : 'text-neutral-300 hover:text-white hover:bg-neutral-800'
                }`}
              >
                <span className="md:hidden">{tab.short}</span>
                <span className="hidden md:inline">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Vehicle Main Showcase Gallery Grid */}
        <div className="mt-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Main Visual Display (Col 8) */}
          <div className="lg:col-span-8 min-w-0 flex flex-col space-y-4">
            <div className="relative aspect-[16/10] sm:aspect-[16/9] w-full rounded-xl overflow-hidden border border-white/10 bg-neutral-900 shadow-2xl group">
              <img
                src={currentViewObj.img}
                alt={currentViewObj.caption}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-102"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/80 via-transparent to-transparent pointer-events-none" />

              {/* Caption Overlay */}
              <div className="absolute bottom-4 left-4 right-4 p-4 rounded-lg bg-neutral-950/85 backdrop-blur-md border border-white/10 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <Car className="w-5 h-5 text-amber-400 shrink-0" />
                  <span className="text-xs sm:text-sm text-neutral-200">
                    {currentViewObj.caption}
                  </span>
                </div>
                <span className="hidden sm:inline-block text-[11px] font-mono text-neutral-400 border border-white/10 px-2 py-1 rounded">
                  Feel Pack 2022
                </span>
              </div>
            </div>

            {/* Thumbnail mini selector */}
            <div className="grid grid-cols-2 gap-2">
              {views.map((v) => (
                <button
                  key={v.id}
                  onClick={() => setActiveView(v.id as ViewMode)}
                  className={`relative aspect-[16/9] rounded-lg overflow-hidden border transition-all cursor-pointer ${
                    activeView === v.id
                      ? 'border-amber-400 ring-2 ring-amber-400/20'
                      : 'border-white/10 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img
                    src={v.img}
                    alt={v.label}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-neutral-950/40" />
                  <span className="absolute bottom-1.5 left-2 text-[11px] font-medium text-white truncate max-w-[90%]">
                    {v.label}
                  </span>
                </button>
              ))}
            </div>

            {/* Vehicle Technical Features List */}
            <div className="mt-4 p-6 rounded-xl bg-neutral-900/50 border border-white/10">
              <div className="text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-4">
                Diferenciais do Citroën C4 Cactus Feel Pack
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm text-neutral-300">
                {driverProfile.vehicle.features.map((feat, i) => (
                  <div key={i} className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Interactive Amenities Drawer (Col 4) */}
          <div className="lg:col-span-4 min-w-0 flex flex-col space-y-3">
            <div className="text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-1">
              Conforto a Bordo em Fortaleza
            </div>

            {driverProfile.amenities.map((item) => {
              const Icon = iconMap[item.icon] || Coffee;
              const isSelected = activeAmenityId === item.id;

              return (
                <div
                  key={item.id}
                  onClick={() => setActiveAmenityId(item.id)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all duration-200 ${
                    isSelected
                      ? 'bg-neutral-900 border-amber-400/40 shadow-sm shadow-amber-400/5'
                      : 'bg-neutral-900/40 border-white/10 hover:border-white/20 hover:bg-neutral-900/60'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${isSelected ? 'bg-amber-400/10 text-amber-400' : 'bg-neutral-800 text-neutral-400'}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <h3 className={`text-sm font-semibold ${isSelected ? 'text-white' : 'text-neutral-200'}`}>
                        {item.title}
                      </h3>
                    </div>
                    <ChevronRight className={`w-4 h-4 transition-transform ${isSelected ? 'rotate-90 text-amber-400' : 'text-neutral-500'}`} />
                  </div>
                  
                  {isSelected && (
                    <p className="mt-3 text-xs text-neutral-300 leading-relaxed pl-11">
                      {item.description}
                    </p>
                  )}
                </div>
              );
            })}

            <div className="mt-4 p-4 rounded-xl bg-amber-400/5 border border-amber-400/20 text-xs text-neutral-300 leading-relaxed">
              <span className="font-semibold text-amber-300">Viagens com Bagagens & Praia: </span>
              Porta-malas espaçoso para malas de viagem, bolsas de praia, pranchas pequenas (com rebatimento) ou compras nos shoppings de Fortaleza.
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
