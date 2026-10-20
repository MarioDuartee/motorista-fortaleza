import { useState } from 'react';
import { MessageSquare, Menu, X, PhoneCall } from 'lucide-react';
import { driverProfile } from '../data/driverData';
import { useI18n } from '../i18n/LanguageContext';
import LanguageSwitcher from './LanguageSwitcher';
import ThemeToggle from './ThemeToggle';

interface HeaderProps {
  onOpenContactModal: () => void;
}

export default function Header({ onOpenContactModal }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { t } = useI18n();

  const handleWhatsAppClick = () => {
    const text = encodeURIComponent(
      `Olá ${driverProfile.name}! Acessei o seu site portfólio e gostaria de consultar disponibilidade para um trajeto.`
    );
    window.open(`https://wa.me/${driverProfile.whatsappNumber}?text=${text}`, '_blank');
  };

  return (
    <header className="sticky top-0 z-40 bg-neutral-950/90 backdrop-blur-md border-b border-white/10 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8 h-20">
          
          {/* Zone 1: Single text element wordmark */}
          <a
            href="#"
            className="text-lg sm:text-xl font-bold tracking-tight text-white hover:text-amber-400 transition-colors whitespace-nowrap shrink-0"
          >
            {driverProfile.name}
            <span className="text-amber-400 font-light ml-1 text-sm sm:text-base">{t.header.tagline}</span>
          </a>

          {/* Zone 2: 4-5 clean single-line text navigation links */}
          <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-neutral-300">
            <a
              href="#apresentacao"
              className="hover:text-amber-400 transition-colors whitespace-nowrap shrink-0"
            >
              {t.nav.presentation}
            </a>
            <a
              href="#veiculo"
              className="hover:text-amber-400 transition-colors whitespace-nowrap shrink-0"
            >
              {t.nav.vehicle}
            </a>
            <a
              href="#servicos"
              className="hover:text-amber-400 transition-colors whitespace-nowrap shrink-0"
            >
              {t.nav.services}
            </a>
            <a
              href="#simulador"
              className="hover:text-amber-400 transition-colors whitespace-nowrap shrink-0"
            >
              {t.nav.simulator}
            </a>
            <a
              href="#duvidas"
              className="hover:text-amber-400 transition-colors whitespace-nowrap shrink-0"
            >
              {t.nav.faq}
            </a>
          </nav>

          {/* Zone 3: 1 primary action */}
          <div className="hidden sm:flex items-center gap-3 shrink-0">
            <LanguageSwitcher />
            <ThemeToggle />
            <button
              onClick={handleWhatsAppClick}
              className="flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-semibold text-neutral-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-all duration-200 whitespace-nowrap shrink-0 shadow-sm shadow-amber-400/20 active:scale-95"
            >
              <MessageSquare className="w-4 h-4 text-neutral-950" />
              <span>{t.header.bookWhatsApp}</span>
            </button>
          </div>

          {/* Mobile hamburger button */}
          <div className="flex md:hidden items-center gap-2">
            <div className="sm:hidden flex items-center gap-2">
              <LanguageSwitcher />
              <ThemeToggle />
            </div>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-neutral-400 hover:text-white rounded-lg focus:outline-none focus:ring-1 focus:ring-amber-400"
              aria-label={mobileMenuOpen ? t.header.closeMenu : t.header.openMenu}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-white/10 bg-neutral-950 px-4 pt-3 pb-5 space-y-3">
          <div className="flex flex-col space-y-2 text-base font-medium text-neutral-300">
            <a
              href="#apresentacao"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-md hover:bg-neutral-900 hover:text-amber-400 transition-colors"
            >
              {t.nav.presentation}
            </a>
            <a
              href="#veiculo"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-md hover:bg-neutral-900 hover:text-amber-400 transition-colors"
            >
              {t.nav.vehicleMobile}
            </a>
            <a
              href="#servicos"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-md hover:bg-neutral-900 hover:text-amber-400 transition-colors"
            >
              {t.nav.services}
            </a>
            <a
              href="#simulador"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-md hover:bg-neutral-900 hover:text-amber-400 transition-colors"
            >
              {t.nav.simulatorMobile}
            </a>
            <a
              href="#duvidas"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-md hover:bg-neutral-900 hover:text-amber-400 transition-colors"
            >
              {t.nav.faqLong}
            </a>
          </div>

          <div className="pt-2 flex flex-col gap-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                handleWhatsAppClick();
              }}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 text-sm font-semibold text-neutral-950 bg-amber-400 rounded-lg hover:bg-amber-300 transition-colors"
            >
              <MessageSquare className="w-4 h-4" />
              <span>{t.header.callWhatsApp}</span>
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenContactModal();
              }}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 text-xs font-medium text-neutral-300 bg-neutral-900 border border-white/10 rounded-lg hover:bg-neutral-800 transition-colors"
            >
              <PhoneCall className="w-3.5 h-3.5 text-amber-400" />
              <span>{t.header.contactCard}</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
