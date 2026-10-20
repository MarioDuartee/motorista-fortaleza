import { MessageSquare, Phone, ShieldCheck } from 'lucide-react';
import { driverProfile } from '../data/driverData';
import { useI18n } from '../i18n/LanguageContext';

interface FooterProps {
  onOpenContactModal: () => void;
  onOpenPrivacyModal: () => void;
}

export default function Footer({ onOpenContactModal, onOpenPrivacyModal }: FooterProps) {
  const { t } = useI18n();
  const currentYear = new Date().getFullYear();

  const handleWhatsApp = () => {
    window.open(`https://wa.me/${driverProfile.whatsappNumber}`, '_blank');
  };

  return (
    <footer className="bg-neutral-950 border-t border-white/10 pt-16 pb-12 text-neutral-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-12 border-b border-white/10">
          
          {/* Col 1: Wordmark & Bio */}
          <div className="md:col-span-2 space-y-3">
            <div className="text-base font-bold text-white tracking-tight">
              {driverProfile.name}
              <span className="text-amber-400 font-normal ml-1">{t.footer.locationSuffix}</span>
            </div>
            <p className="text-xs text-neutral-400 max-w-md leading-relaxed">
              {t.footer.bio}
            </p>
            <div className="flex items-center gap-2 text-[11px] text-emerald-400 pt-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>{t.footer.badge}</span>
            </div>
          </div>

          {/* Col 2: Navigation Links */}
          <div className="space-y-2">
            <div className="text-xs font-semibold uppercase tracking-wider text-white">
              {t.footer.navTitle}
            </div>
            <ul className="space-y-1.5">
              <li>
                <a href="#apresentacao" className="hover:text-amber-400 transition-colors">{t.nav.presentation}</a>
              </li>
              <li>
                <a href="#veiculo" className="hover:text-amber-400 transition-colors">{t.nav.vehicle}</a>
              </li>
              <li>
                <a href="#servicos" className="hover:text-amber-400 transition-colors">{t.nav.services}</a>
              </li>
              <li>
                <a href="#simulador" className="hover:text-amber-400 transition-colors">{t.nav.simulatorFooter}</a>
              </li>
              <li>
                <a href="#duvidas" className="hover:text-amber-400 transition-colors">{t.nav.faqLong}</a>
              </li>
            </ul>
          </div>

          {/* Col 3: Direct Contact */}
          <div className="space-y-2">
            <div className="text-xs font-semibold uppercase tracking-wider text-white">
              {t.footer.contactTitle}
            </div>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={handleWhatsApp}
                  className="flex items-center gap-1.5 text-neutral-300 hover:text-amber-400 transition-colors"
                >
                  <MessageSquare className="w-3.5 h-3.5 text-amber-400" />
                  <span className="font-mono">{driverProfile.whatsappDisplay}</span>
                </button>
              </li>
              <li className="pt-2">
                <button
                  onClick={onOpenContactModal}
                  className="text-xs font-medium text-amber-400 hover:text-amber-300 underline underline-offset-4"
                >
                  {t.footer.downloadCard}
                </button>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar: Copyright & Respectful notes */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-neutral-500">
          <div>
            © {currentYear} {driverProfile.name}. {t.footer.rights}
          </div>
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={onOpenPrivacyModal}
              className="hover:text-amber-400 underline underline-offset-4 decoration-neutral-700 hover:decoration-amber-400/60 transition-colors cursor-pointer"
            >
              {t.footer.privacy}
            </button>
            <span aria-hidden="true">·</span>
            <span>{t.footer.place}</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
