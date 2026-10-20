# Mário Duarte | Motorista Particular & Translados em Fortaleza

Site de apresentação e agendamento de viagens do motorista particular **Mário Duarte**, em Fortaleza (CE). A pessoa conhece o serviço e o carro (Citroën C4 Cactus), simula o trajeto no mapa, vê o valor estimado e envia o pedido já pronto para o WhatsApp.

O projeto é uma *single page application* feita com **React + TypeScript**, pensada para funcionar bem no celular, que é de onde vem a maior parte dos clientes.

## O que o site faz

- **Apresentação profissional:** quem é o motorista, experiência, o veículo e as modalidades de atendimento (translado do aeroporto, Beach Park, praias e interior do Ceará, diárias executivas e city tour).
- **Simulador de trajeto:** o cliente informa embarque e desembarque, o site traça a rota real pelas ruas no mapa, calcula a distância e o valor estimado da corrida.
- **Busca de endereços e pontos de referência:** localiza ruas, hotéis, shoppings e outros locais, além de uma lista de locais frequentes e do botão "Usar minha localização atual".
- **Agendamento pelo WhatsApp:** monta automaticamente a mensagem com serviço, origem, destino, distância, valor, data, horário, passageiros, malas e preferência de climatização.
- **Quatro idiomas:** português, inglês, espanhol e chinês, com escolha automática pelo idioma do navegador. A mensagem enviada ao WhatsApp sempre sai em português.
- **Tema claro e escuro.**
- **Cartão de contato** (arquivo vCard) e QR Code para abrir o WhatsApp.
- **FAQ** e página de **Privacidade e Segurança**, com explicação de como os dados são tratados (LGPD).

## Tecnologias

| Área | Tecnologia |
|---|---|
| Interface | [React 19](https://react.dev/) |
| Linguagem | [TypeScript](https://www.typescriptlang.org/) |
| Build e servidor de desenvolvimento | [Vite](https://vite.dev/) |
| Estilos | [Tailwind CSS 4](https://tailwindcss.com/) |
| Animações | [Motion](https://motion.dev/) |
| Ícones | [Lucide](https://lucide.dev/) |
| Mapa | [Leaflet](https://leafletjs.com/) com imagens do [OpenStreetMap](https://www.openstreetmap.org/) |
| Traçado da rota | [OSRM](https://project-osrm.org/) (serviço público) |
| Busca de endereços | [Nominatim](https://nominatim.org/) (OpenStreetMap) |

Alguns detalhes técnicos que vale destacar:

- **Internacionalização feita à mão:** um dicionário por idioma (`src/i18n`), tipado a partir do português, então o TypeScript avisa se faltar alguma tradução.
- **Busca de endereços respeitando as regras do serviço gratuito:** pedidos espaçados em fila, cache de resultados repetidos e busca só quando a pessoa confirma, sem autocompletar a cada tecla.
- **Distância com plano B:** usa a rota real pelas ruas quando disponível e uma estimativa quando o serviço de rotas está indisponível.
- **Privacidade:** o site não guarda nome nem contato. As coordenadas só são usadas para desenhar o trajeto e a localização do aparelho só é lida se a pessoa tocar em "Usar minha localização atual".

## Como este projeto foi feito

O projeto foi desenvolvido por **Mário Duarte**, com o apoio de ferramentas de inteligência artificial:

- **Google AI Studio** e **Gemini**, onde o projeto foi iniciado e a primeira versão do site tomou forma.
- **Claude (Anthropic)**, usado para revisar, corrigir e melhorar o código e os textos ao longo do desenvolvimento.
- **Meus conhecimentos em React**, que usei para entender, ajustar e evoluir o código gerado, organizar os componentes e decidir como o site deveria funcionar.

A IA acelerou o trabalho, mas as decisões do projeto, os testes e a evolução do site são meus.


## Estrutura do projeto

```text
src/
├── components/   # Seções do site, simulador, mapa e campo de endereço
├── data/         # Dados do motorista
├── hooks/        # Lógica da busca de endereços
├── i18n/         # Textos em português, inglês, espanhol e chinês
├── theme/        # Tema claro e escuro
├── types/        # Tipos compartilhados
└── utils/        # Cálculo de distância e valor, e busca de endereços
```

## Contato

**Mário Duarte**, motorista particular em Fortaleza, CE.
Atendimento e agendamento pelo WhatsApp: (85) 99902-2591.

---

Feito com React e muita vontade de aprender. 🚗
