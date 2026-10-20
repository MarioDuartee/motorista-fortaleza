import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown, HelpCircle } from 'lucide-react';

interface FaqItem {
  question: string;
  answer: string;
}

export default function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs: FaqItem[] = [
    {
      question: 'Como é calculado o valor da corrida ou translado?',
      answer: 'O cálculo é direto e 100% transparente: calculamos a distância exata em quilômetros entre o embarque e o desembarque através do mapa e multiplicamos por R$ 3,00 o km rodado. Sem tarifas dinâmicas surpresa!'
    },
    {
      question: 'Como funciona o agendamento prévio com Mário Duarte?',
      answer: 'Você pode solicitar a cotação pelo simulador acima ou direto pelo WhatsApp (85) 99902-2591. Assim que combinamos a data, horário e rota, seu horário fica 100% reservado na minha agenda exclusiva. Na véspera e 1 hora antes do embarque, envio uma mensagem de confirmação para sua total tranquilidade.'
    },
    {
      question: 'O carro tem espaço para malas e compras de viagem?',
      answer: 'Sim! O Citroën C4 Cactus é um SUV compacto e, como o carro tem kit GNV instalado, o porta-malas é um pouco menor que o original. Mesmo assim, ainda cabem algumas malas e bolsas com tranquilidade. Se for levar muita bagagem, me avise no agendamento que eu confirmo se acomodamos tudo com conforto.'
    },
    {
      question: 'Quais são as formas de pagamento aceitas?',
      answer: 'Aceito Pix (chave rápida no WhatsApp ou QR Code a bordo), cartões de crédito e débito de todas as bandeiras na maquininha sem fio e dinheiro em espécie trocado.'
    },
    {
      question: 'Você faz viagens de ida e volta para o Beach Park ou Cumbuco?',
      answer: 'Com certeza! Posso levar você pela manhã e combinar o horário exato de retorno no final da tarde, para que você não precise disputar carro nem pagar tarifas dinâmicas abusivas na saída dos parques e praias.'
    },
    {
      question: 'Posso escolher entre ar-condicionado e janelas abertas?',
      answer: 'Pode sim! O ar-condicionado fica ligado o tempo todo e na temperatura que você preferir, ou, se você gosta de curtir a brisa de Fortaleza, seguimos com as janelas abertas em temperatura ambiente. Você escolhe no simulador de viagem ou combina comigo pelo WhatsApp.'
    }
  ];

  const toggleItem = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section id="duvidas" className="py-16 lg:py-24 border-b border-white/10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto">
          <div className="flex items-center justify-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-400 mb-2">
            <HelpCircle className="w-4 h-4" />
            <span>Tire Suas Dúvidas</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight">
            Perguntas Frequentes
          </h2>
          <p className="mt-3 text-sm sm:text-base text-neutral-400">
            Tudo o que você precisa saber sobre o atendimento particular e viagens agendadas com Mário Duarte em Fortaleza.
          </p>
        </div>

        {/* Accordion list */}
        <div className="mt-12 space-y-3">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;

            return (
              <div
                key={index}
                className="rounded-xl border border-white/10 bg-neutral-900/60 overflow-hidden transition-colors"
              >
                <button
                  type="button"
                  onClick={() => toggleItem(index)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 focus:outline-none cursor-pointer"
                >
                  <span className="text-sm sm:text-base font-semibold text-white">
                    {faq.question}
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 text-neutral-400 shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180 text-amber-400' : ''
                    }`}
                  />
                </button>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: 'easeOut' }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 pb-5 text-xs sm:text-sm text-neutral-300 leading-relaxed border-t border-white/5 pt-3">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
