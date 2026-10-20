import { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ShieldCheck, Lock, Globe, UserCheck, Car, MessageSquare } from 'lucide-react';
import { driverProfile } from '../data/driverData';

interface PrivacyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const sections = [
  {
    icon: Lock,
    title: 'Seus dados no site',
    items: [
      'Você não precisa criar conta nem fazer cadastro para usar o site.',
      'O que você preenche no simulador (embarque, desembarque, data, horário, passageiros, bagagens e climatização) fica apenas no seu aparelho. O site não guarda essas informações em nenhum servidor.',
      'Esses dados só chegam até mim se você tocar em "Enviar para o WhatsApp". A partir daí, a conversa segue as regras do próprio WhatsApp.',
      'Não peço CPF, dados de cartão nem documentos por este site.'
    ]
  },
  {
    icon: UserCheck,
    title: 'Como uso as suas informações',
    items: [
      'Uso os dados da viagem somente para responder à sua cotação, confirmar o agendamento e realizar o atendimento.',
      'Não vendo e não compartilho seus dados com terceiros para publicidade.',
      'As conversas ficam guardadas apenas pelo tempo necessário ao atendimento.'
    ]
  },
  {
    icon: Globe,
    title: 'Serviços de terceiros',
    items: [
      'O mapa do simulador usa o OpenStreetMap (imagens do mapa) e o OSRM (traçado da rota). Ao abrir o mapa, seu navegador se conecta a esses serviços, e as coordenadas dos dois locais escolhidos são usadas para desenhar o trajeto. Nenhum nome ou contato seu é enviado.',
      'As fontes de texto do site são carregadas do Google Fonts.',
      'Os links para WhatsApp e Google Maps abrem esses aplicativos, que têm suas próprias políticas de privacidade.'
    ]
  },
  {
    icon: ShieldCheck,
    title: 'Cookies e localização',
    items: [
      'Este site não usa cookies de publicidade nem ferramentas de análise de comportamento.',
      'Não acessamos a sua localização por GPS. Você informa os locais manualmente.',
      'A hospedagem do site pode registrar dados técnicos de acesso (como IP e navegador) apenas para segurança e funcionamento.'
    ]
  },
  {
    icon: MessageSquare,
    title: 'Seus direitos (LGPD)',
    items: [
      'Conforme a Lei Geral de Proteção de Dados (Lei nº 13.709/2018), você pode pedir para confirmar se tenho dados seus, acessar, corrigir ou excluir o que foi enviado por WhatsApp.',
      'É só falar comigo pelos contatos abaixo. Responsável pelo atendimento e pelos seus dados: Mário Duarte.'
    ]
  },
  {
    icon: Car,
    title: 'Segurança nas viagens',
    items: [
      'Motorista profissional com CNH com EAR e mais de 30.000 corridas realizadas.',
      'Cinto de segurança para todos os ocupantes e direção dentro da lei e dos limites de velocidade.',
      'Veículo higienizado e confirmação do horário na véspera e 1 hora antes do embarque.'
    ]
  }
];

export default function PrivacyModal({ isOpen, onClose }: PrivacyModalProps) {
  // Fecha com a tecla Esc e trava a rolagem do site enquanto a janela está aberta
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="privacy-title"
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="relative w-full max-w-2xl max-h-[88vh] flex flex-col rounded-2xl bg-neutral-900 border border-white/15 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Cabeçalho fixo */}
            <div className="flex items-start justify-between gap-4 p-5 sm:p-6 border-b border-white/10">
              <div>
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-400">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Transparência</span>
                </div>
                <h3 id="privacy-title" className="mt-1 text-xl font-bold text-white">
                  Privacidade e Segurança
                </h3>
                <p className="mt-1 text-xs text-neutral-400">
                  Como cuido dos seus dados e da sua segurança durante as viagens.
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-2 shrink-0 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800 transition-colors cursor-pointer"
                aria-label="Fechar janela"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Conteúdo com rolagem */}
            <div className="overflow-y-auto p-5 sm:p-6 space-y-6">
              {sections.map((section) => {
                const Icon = section.icon;
                return (
                  <section key={section.title}>
                    <h4 className="flex items-center gap-2 text-sm font-semibold text-white">
                      <span className="p-1.5 rounded-lg bg-amber-400/10 text-amber-400">
                        <Icon className="w-4 h-4" />
                      </span>
                      <span>{section.title}</span>
                    </h4>
                    <ul className="mt-3 space-y-2 pl-1">
                      {section.items.map((item) => (
                        <li key={item} className="flex items-start gap-2.5 text-xs sm:text-sm text-neutral-300 leading-relaxed">
                          <span className="mt-2 w-1 h-1 rounded-full bg-amber-400 shrink-0" aria-hidden="true" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </section>
                );
              })}

              {/* Contato */}
              <div className="p-4 rounded-xl bg-neutral-950 border border-white/10 text-xs text-neutral-300 space-y-2">
                <div className="font-semibold text-white">Dúvidas sobre privacidade?</div>
                <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
                  <a
                    href={`https://wa.me/${driverProfile.whatsappNumber}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 hover:text-amber-400 transition-colors"
                  >
                    <MessageSquare className="w-3.5 h-3.5 text-amber-400" />
                    <span className="font-mono">{driverProfile.whatsappDisplay}</span>
                  </a>
              
                </div>
              </div>

              <p className="text-[11px] text-neutral-500">Última atualização: outubro de 2026.</p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
