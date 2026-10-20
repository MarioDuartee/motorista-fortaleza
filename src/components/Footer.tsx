import { MessageSquare, Phone, ShieldCheck } from 'lucide-react';
import { driverProfile } from '../data/driverData';

interface FooterProps {
  onOpenContactModal: () => void;
  onOpenPrivacyModal: () => void;
}

export default function Footer({ onOpenContactModal, onOpenPrivacyModal }: FooterProps) {
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
              <span className="text-amber-400 font-normal ml-1">· Fortaleza - CE</span>
            </div>
            <p className="text-xs text-neutral-400 max-w-md leading-relaxed">
              Transporte particular e translados com pontualidade, ar-condicionado potente e conforto de SUV Citroën C4 Cactus em Fortaleza, aeroporto e praias.
            </p>
            <div className="flex items-center gap-2 text-[11px] text-emerald-400 pt-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>+30.000 Corridas Realizadas & CNH Profissional com EAR</span>
            </div>
          </div>

          {/* Col 2: Navigation Links */}
          <div className="space-y-2">
            <div className="text-xs font-semibold uppercase tracking-wider text-white">
              Navegação
            </div>
            <ul className="space-y-1.5">
              <li>
                <a href="#apresentacao" className="hover:text-amber-400 transition-colors">Apresentação</a>
              </li>
              <li>
                <a href="#veiculo" className="hover:text-amber-400 transition-colors">O C4 Cactus</a>
              </li>
              <li>
                <a href="#servicos" className="hover:text-amber-400 transition-colors">Serviços</a>
              </li>
              <li>
                <a href="#simulador" className="hover:text-amber-400 transition-colors">Simulador de Viagem</a>
              </li>
              <li>
                <a href="#duvidas" className="hover:text-amber-400 transition-colors">Dúvidas Frequentes</a>
              </li>
            </ul>
          </div>

          {/* Col 3: Direct Contact */}
          <div className="space-y-2">
            <div className="text-xs font-semibold uppercase tracking-wider text-white">
              Contato Direto
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
                  Baixar Cartão Virtual (.vcf)
                </button>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar: Copyright & Respectful notes */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-neutral-500">
          <div>
            © {currentYear} {driverProfile.name}. Todos os direitos reservados.
          </div>
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={onOpenPrivacyModal}
              className="hover:text-amber-400 underline underline-offset-4 decoration-neutral-700 hover:decoration-amber-400/60 transition-colors cursor-pointer"
            >
              Privacidade e Segurança
            </button>
            <span aria-hidden="true">·</span>
            <span>Fortaleza - Ceará, Brasil</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
