/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { MessageSquare } from 'lucide-react';
import Header from './components/Header';
import Hero from './components/Hero';
import AboutSection from './components/AboutSection';
import VehicleShowcase from './components/VehicleShowcase';
import ServicesSection from './components/ServicesSection';
import TripSimulator from './components/TripSimulator';
import FaqSection from './components/FaqSection';
import ContactCardModal from './components/ContactCardModal';
import PrivacyModal from './components/PrivacyModal';
import Footer from './components/Footer';
import FadeInUp from './components/FadeInUp';
import { driverProfile } from './data/driverData';

export default function App() {
  const [contactModalOpen, setContactModalOpen] = useState(false);
  const [privacyModalOpen, setPrivacyModalOpen] = useState(false);
  const [selectedServiceForQuote, setSelectedServiceForQuote] = useState<string>('');

  const handleSelectServiceForQuote = (serviceTitle: string) => {
    setSelectedServiceForQuote(serviceTitle);
    const simulatorEl = document.getElementById('simulador');
    if (simulatorEl) {
      simulatorEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleFloatingWhatsApp = () => {
    const text = encodeURIComponent(
      `Olá Mário! Estou no seu site e gostaria de agendar uma viagem em Fortaleza com seu C4 Cactus.`
    );
    window.open(`https://wa.me/${driverProfile.whatsappNumber}?text=${text}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col font-sans selection:bg-amber-400 selection:text-neutral-950">
      
      {/* 3-Zone Top Navigation */}
      <Header onOpenContactModal={() => setContactModalOpen(true)} />

      {/* Main Content Area */}
      <main className="flex-1">
        
        {/* Hero Presentation */}
        <Hero onOpenContactModal={() => setContactModalOpen(true)} />

        {/* About Driver & Professional Philosophy */}
        <FadeInUp>
          <AboutSection onOpenContactModal={() => setContactModalOpen(true)} />
        </FadeInUp>

        {/* Interactive Vehicle Showcase & Amenities */}
        <FadeInUp>
          <VehicleShowcase />
        </FadeInUp>

        {/* Services & Modalidades */}
        <FadeInUp>
          <ServicesSection onSelectServiceForQuote={handleSelectServiceForQuote} />
        </FadeInUp>

        {/* Interactive Trip Simulator & WhatsApp Quote Builder */}
        <FadeInUp>
          <TripSimulator preSelectedService={selectedServiceForQuote} />
        </FadeInUp>

        {/* FAQ Section */}
        <FadeInUp>
          <FaqSection />
        </FadeInUp>

      </main>

      {/* Footer */}
      <Footer
        onOpenContactModal={() => setContactModalOpen(true)}
        onOpenPrivacyModal={() => setPrivacyModalOpen(true)}
      />

      {/* Digital Business Card & vCard Modal */}
      <ContactCardModal
        isOpen={contactModalOpen}
        onClose={() => setContactModalOpen(false)}
      />

      {/* Privacidade e Segurança */}
      <PrivacyModal
        isOpen={privacyModalOpen}
        onClose={() => setPrivacyModalOpen(false)}
      />

      {/* Mobile Floating Quick Action (Compliant with 15% sticky cap) */}
      <aside aria-label="Ações rápidas" className="fixed bottom-5 right-5 z-40 flex flex-col items-end gap-2 sm:hidden">
        <button
          onClick={handleFloatingWhatsApp}
          className="flex items-center gap-2 p-3.5 bg-amber-400 text-neutral-950 rounded-full shadow-xl shadow-amber-400/25 active:scale-95 transition-all cursor-pointer"
          aria-label="Abrir conversa no WhatsApp"
        >
          <MessageSquare className="w-5 h-5 fill-neutral-950" />
          <span className="text-xs font-bold pr-1">WhatsApp</span>
        </button>
      </aside>

    </div>
  );
}
