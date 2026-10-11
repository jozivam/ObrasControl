# SiteStock / ObrasControl - Gestão de Pátio, Montagem Industrial & Rastreabilidade de TAGs

Plataforma integrada de controle de pátio, almoxarifado técnico e avanço físico de montagem eletromecânica industrial para canteiros de obras no Brasil, com rastreabilidade rigorosa por TAG ISA, separação fiscal de custódia (Contratante vs. Montadora), cautela de ferramentas, auditoria fotográfica dupla e operação offline-first no celular dos técnicos.

---

### User Review & Critical Decisions

> [!IMPORTANT]
> As seguintes decisões críticas de arquitetura e experiência foram alinhadas com base no PRD e nas respostas de esclarecimento:

- **Flexibilidade Multi-Obra & Carga Real do Projeto Z3**: O sistema será entregue pré-carregado com os subsistemas e TAGs industriais reais extraídos dos diagramas de engenharia da **Votorantim Cimentos (Moagem Z3 Nobres - MT)** (motores, gavetas CCM, chaves de nível, válvulas rotativas, transmissores de pressão e temperatura, programadores de filtro e bombas), mas com arquitetura 100% dinâmica que permite cadastrar novas obras, importar romaneios/listas de TAGs em CSV/JSON e alternar projetos no seletor do topo.
- **Leitura de TAGs por Câmera & Bipagem Rápida**: Módulo de leitura com câmera ao vivo via HTML5/Webcam com scanner visual para QR Codes e Códigos de Barras industriais, complementado por barra de busca ultrarrápida com autocomplete e filtros por área/subsistema.
- **Sincronização Offline-First Bidirecional**: Como canteiros industriais frequentemente possuem áreas de sombra ou subestações sem sinal de celular, a aplicação opera com banco local (IndexedDB) para registrar fotos, baixas de TAG, entradas de NF e cautelas mesmo 100% desconectado, sincronizando em segundo plano com a API quando a conexão for restabelecida, além de um indicador visual de conectividade e botão "Sincronizar Agora".
- **Design Executivo & Operacional**: Layout inspirado na interface de referência fornecida, combinando sidebar fixa em azul industrial, cabeçalho de boas-vindas com seletor de obra e data, 4 cartões de KPIs com barras de avanço físico, grid de ações rápidas, feed de atividades em tempo real e painel de alertas e pendências urgentes.

---

### 1. Overview & Core Concept

- **O Que o Sistema Faz**: Controla o ciclo de vida completo de cada item e instrumento em obras de montagem industrial — desde o recebimento físico com conferência de Nota Fiscal (distinguindo o que é fornecido pela Contratante vs. comprado pela Montadora), armazenamento com foto no pátio/almoxarifado, baixa física para montagem por TAG de projeto, até o comissionamento em campo com registro fotográfico geolocalizado e cálculo automático da Curva de Avanço Físico (Curva S).
- **Público-Alvo e Perfis (RBAC)**:
  1. *Gerente Geral (Admin)*: Gestão total de acessos, relatórios consolidados de múltiplas obras, auditoria de NFs e custos fiscais.
  2. *Gestor de Campo*: Curva de avanço físico, aprovação de requisições de material por frente de serviço, liberação de frentes.
  3. *Gestor de Almoxarifado*: Entrada e conferência de NFs, balanço de estoque, cautela de ferramentas e inventário.
  4. *Supervisor de Campo*: Baixa e requisição de instrumentos por TAG, upload de fotos de instalação no equipamento, devoluções de sobras.
  5. *Almoxarife*: Bipagem de entrada física, fotos de recebimento, entrega para montagem e controle de devolução de ferramentas.
- **Valor Principal**: Elimina perda de instrumentos de alto valor (transmissores, sensores, cabos especiais), impede a confusão entre o estoque fiscal da contratante e da montadora, acelera medições de avanço através de evidências fotográficas auditáveis e funciona perfeitamente no bolso dos técnicos em campo mesmo sem internet.

---

### 2. User Experience & Visual Design

#### A. Telas e Fluxos Principais

1. **Dashboard Executivo & Operacional (Conforme Referência Visual)**:
   - *Barra Lateral (Sidebar)*: Navegação ágil com ícones e rótulos unificados: Dashboard, Almoxarifado, Tags & Instrumentos, Notas Fiscais, Cautela de Ferramentas, Curva de Avanço & Relatórios, Gestão de Perfis & Usuários, Configurações de Obras. Seletor de perfil ativo no rodapé da sidebar para testar permissões RBAC com um clique.
   - *Card Superior de Boas-Vindas*: Identificação do usuário logado, seletor suspenso da Obra Ativa (ex.: `Obra Nobres - Moagem Z3 (Votorantim Cimentos)`), data em português e botões de Exportação e Sincronização.
   - *4 Cards de KPIs Rápidos*:
     - **Total de TAGs do Projeto** (ex.: 158 tags cadastradas no projeto Nobres Z3).
     - **Progresso Físico Montado / Comissionado** (com barra de avanço percentual e meta).
     - **Saldo no Pátio** (divisão clara: Contratante vs. Montadora).
     - **Ferramentas Cauteladas** (total em campo e destaque para devoluções pendentes).
   - *Quick Actions (Ações Rápidas)*: Cards destacados para `[Entrada de NF]`, `[Baixa de TAG em Campo]`, `[Foto de Instalação]`, `[Cautelar Ferramenta]`.
   - *Painel de Avanço Físico & Curva S*: Gráfico por subsistemas (Eletrocentro Z3SE1/SE2, Moagem Z3, Silos de Aditivos, Filtro de Mangas, etc.) com status comparativo de montagem.
   - *Feed de Atividades ao Vivo*: Histórico cronológico das ações recentes na obra.
   - *Alertas & Pendências*: Cards coloridos para itens com estoque mínimo, sobras a recolher e ferramentas com cautela vencida.

2. **Módulo de Notas Fiscais & Guarda Fiscal (RF-01)**:
   - Formulário de entrada com anexo de NF (PDF/XML ou foto), número, fornecedor, data, valor e chave de acesso.
   - Seleção explícita de custódia:
     - `Fornecido pelo Contratante`: saldo sob custódia de montagem (não entra em ativo contábil de compra da montadora).
     - `Comprado pela Montadora`: controle com ordem de compra e centro de custo.
   - Upload fotográfico de embalagens/paletes/etiquetas no recebimento físico no pátio.

3. **Módulo de TAGs & Instrumentos Industriais (RF-02 & RF-03)**:
   - Tabela detalhada e cartões com TAG ISA (ex.: `Z3M03M1`, `Z3P71_PT1`, `Z3S01_SE`, `A1A01LT`, `Z3K01_PSL1`).
   - Dados de engenharia integrados: Descrição, Subsistema/Área, Gaveta CCM/Painel, Fabricante/Modelo, Tipo de Sinal, Cabos e Bornes.
   - Fluxo de Baixa para Campo: operador abre o scanner de câmera ou digita a TAG -> status transita de `NO_ESTOQUE` para `EM_MONTAGEM` -> saldo é debitado.
   - Registro Fotográfico Duplo:
     - *Foto 1 - Estoque/Recebimento*: Item íntegro no pátio.
     - *Foto 2 - Campo/Instalado*: Instrumento fixado no suporte/painel/linha, com metadados (responsável, data/hora e coordenadas GPS). A foto de instalação valida a TAG para status `INSTALADO_CAMPO` ou `COMISSIONADO`.

4. **Cautela de Ferramentas & Equipamentos (RF-04)**:
   - Catálogo de ferramentas e instrumentos de teste (megômetros, alicates amperímetros, torquímetros, máquinas de solda).
   - Fluxo de Empréstimo: seleção do equipamento, técnico/encarregado responsável, frente de serviço, data prevista de devolução e foto do estado de saída.
   - Devolução com checklist de integridade e baixa no sistema.

5. **Relatórios, RDO e Curva de Avanço (RF-05)**:
   - Curva de Avanço Físico por subsistema e ponderação de montagem.
   - Gerador de Relatório Diário de Obra (RDO) com resumo de entradas de NF, TAGs montadas no dia, ferramentas em campo e fotos registradas.
   - Exportação completa para PDF formatado para impressão e planilha Excel (.csv/.xlsx).

6. **PWA Mobile-First & Câmera**:
   - Layout 100% adaptado para smartphones com barra inferior de navegação ergonômica (Dedão), botões com alvos táteis $\ge 44\text{px}$, modal de escaneamento de código de barras e botão nativo "Instalar App".

#### B. Identidade Visual & Tema

- **Aparência**: Azul industrial profundo e grafite moderno, seguindo a paleta de alta tecnologia do mockup fornecido.
- **Cores Principais**:
  - Fundo Canvas: `#f8fafc` (slate-50) e `#ffffff`
  - Sidebar: Azul Escuro Real `#0f3b75` a `#1e40af` com tipografia nítida em branco
  - Superfícies e Cards: Branco com bordas suaves `border-slate-200`
  - Cores de Ação Rápida: Gradientes sutis em Azul Royal (`from-blue-600 to-indigo-600`), Esmeralda (`from-emerald-600 to-teal-600`), Laranja/Âmbar (`from-amber-500 to-orange-600`), Violeta (`from-purple-600 to-indigo-600`)
  - Status Semânticos: `NO_ESTOQUE` (Cinza neutro), `EM_MONTAGEM` (Azul), `INSTALADO_CAMPO` (Âmbar/Laranja), `COMISSIONADO` (Verde esmeralda)
- **Tipografia**: `Plus Jakarta Sans` para títulos e botões, `Manrope` para dados gerais e `font-mono tabular-nums` para TAGs, números de NF, contadores e percentuais.

---

### 3. Key Product Decisions & Trade-Offs

- **Decisão 1: Sincronização Híbrida Offline-First (IndexedDB + API REST)**
  - *Abordagem*: Todo dado cadastrado ou atualizado em campo é salvo imediatamente no `IndexedDB` local do navegador/celular com uma fila de sincronização (`sync_queue`). Um gerenciador de rede escuta eventos `online`/`offline` e sincroniza automaticamente quando houver internet, permitindo também forçar envio manual.
  - *Por que*: Canteiros de montagem de mineração e cimento (como a unidade Nobres da Votorantim) possuem galpões e estruturas metálicas densas onde o sinal 4G/5G oscila constantemente.
- **Decisão 2: Modelo de Dados Multi-Obra Extensível com Pré-Carga da Moagem Z3**
  - *Abordagem*: O sistema isola dados por `obra_id`. Entregamos pré-cadastrada a obra de referência "Moagem Z3 - Nobres MT" com dados autênticos extraídos dos 346 diagramas de interligação da Votorantim/ATMC (subsistemas, CCMs, gavetas, TAGs de instrumentos de campo), e fornecemos ferramenta visual para criar novas obras e importar planilhas de TAGs.
  - *Por que*: Atende o requisito do usuário de já testar com dados reais da obra atual, garantindo capacidade para qualquer outra obra futura da montadora.
- **Decisão 3: Simulação & Suporte Real a Câmera HTML5 / Scanner de Código de Barras**
  - *Abordagem*: Utilização de `navigator.mediaDevices.getUserMedia` para acesso direto à câmera frontal/traseira do celular, com fallback gracioso para upload de arquivos ou captura de imagem por arquivo, além de gerador de etiquetas com QR Code para imprimir e colar nos instrumentos.

---

### 4. Technical Architecture & Data Strategy

```
┌────────────────────────────────────────────────────────────────────────┐
│                        SITESTOCK / OBRASCONTROL                        │
└────────────────────────────────────────────────────────────────────────┘
                                    │
    ┌───────────────────────────────┴───────────────────────────────┐
    ▼                                                               ▼
┌─────────────────────────┐                     ┌─────────────────────────┐
│     DESKTOP VIEW        │                     │   MOBILE TOUCH / PWA    │
│  - Sidebar Executiva    │                     │  - Barra Inferior Dedão │
│  - Painel de Curva S    │                     │  - Scanner Câmera HTML5 │
│  - Auditoria de NFs     │                     │  - Baixa Rápida de TAGs │
│  - Exportação RDO & CSV │                     │  - Cautela de Ferrament.│
└───────────┬─────────────┘                     └────────────┬────────────┘
            │                                                │
            └───────────────────────┬────────────────────────┘
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                    CAMADA DE ESTADO & SINCRONIZAÇÃO                     │
│  - Seletor de Obra Ativa (`activeObraId`)                               │
│  - Perfil Ativo RBAC (`activeProfile`: Admin, Gestor, Almoxarife, etc.) │
│  - Gestor Offline / Online (`useNetworkStatus`, `syncQueue`)            │
│  - IndexedDB Persistence (Local-First Store)                            │
└───────────────────────────────────┬─────────────────────────────────────┘
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                    API SERVER & ARMAZENAMENTO PERSISTENTE               │
│  - Servidor Express / Proxy em `server.ts`                              │
│  - Endpoints REST: `/api/obras`, `/api/tags`, `/api/nfs`,               │
│    `/api/ferramentas`, `/api/cautelas`, `/api/atividades`, `/api/sync`  │
│  - Banco de Dados JSON estruturado e persistente em disco               │
└─────────────────────────────────────────────────────────────────────────┘
```

#### Entidades de Dados Principais

1. **Obra / Projeto**: `id`, `nome`, `cliente`, `localizacao`, `descricao`, `contrato`, `dataInicio`, `status`.
2. **TAG / Instrumento**: `id`, `obraId`, `tag` (ex: `Z3M03M1`), `tipo` (Motor, Transmissor, Chave de Nível, Válvula, Programador), `descricao`, `subsistema` (Moagem Z3, Eletrocentro Z3SE1, etc.), `painelGaveta`, `status` (`NO_ESTOQUE`, `EM_MONTAGEM`, `INSTALADO_CAMPO`, `COMISSIONADO`), `custodia` (`CONTRATANTE` | `MONTADORA`), `nfId`, `fotoEstoqueUrl`, `fotoInstalacaoUrl`, `metadadosInstalacao` (`usuario`, `dataHora`, `localizacao`), `observacoes`.
3. **Nota Fiscal (NF)**: `id`, `obraId`, `numero`, `fornecedor`, `dataEmissao`, `valorTotal`, `tipoCustodia` (`CONTRATANTE` | `MONTADORA`), `anexoNome`, `fotoRecebimentoUrl`, `itensCount`, `statusConferencia`.
4. **Ferramenta**: `id`, `obraId`, `codigo`, `nome`, `categoria` (Teste Elétrico, Mecânica, Solda, Içamento), `marcaModelo`, `numeroSerie`, `status` (`DISPONIVEL` | `CAUTELADA` | `MANUTENCAO`), `responsavelAtual`, `dataPrevistaDevolucao`.
5. **Cautela de Ferramenta**: `id`, `ferramentaId`, `obraId`, `nomeSolicitante`, `funcao`, `frenteServico`, `dataSaida`, `dataPrevistaDevolucao`, `dataDevolucao`, `status` (`ABERTA` | `DEVOLVIDA` | `ATRASADA`), `fotoSaidaUrl`, `fotoDevolucaoUrl`.
6. **Atividade em Tempo Real**: `id`, `obraId`, `tipo`, `descricao`, `usuario`, `perfil`, `timestamp`, `detalhes`.
7. **Usuário / RBAC**: `id`, `nome`, `email`, `perfil` (`ADMIN`, `GESTOR_CAMPO`, `GESTOR_ALMOXARIFADO`, `SUPERVISOR_CAMPO`, `ALMOXARIFE`), `permissoes`.

---

### Verificação do Plano

- **Compilação**: Aplicação full-stack React 19 + TypeScript + Vite + Express + Tailwind CSS v4 testada com `compile_applet`.
- **Validação de Recursos**:
  1. Alternância fluida entre obras (Nobres Moagem Z3 + criação de nova obra).
  2. Bipagem/leitura via câmera e busca por TAG.
  3. Modos online e offline simuláveis com sincronização da fila.
  4. Upload de fotos com preview em Estoque e em Campo.
  5. Cautela de ferramentas com cálculo de devoluções pendentes.
  6. Curva S e exportação de Relatório Diário de Obra (RDO).
