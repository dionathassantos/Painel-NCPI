document.addEventListener('DOMContentLoaded', function() {
  // Initialize the dashboard
  initializeDashboard();
});

function initializeDashboard() {
  // Toggle sidebar
  const sidebar = document.getElementById('sidebar');
  const sidebarToggle = document.getElementById('sidebar-toggle');
  
  sidebarToggle.addEventListener('click', function() {
    sidebar.classList.toggle('collapsed');
    const icon = this.querySelector('i');
    if (sidebar.classList.contains('collapsed')) {
      icon.classList.remove('fa-chevron-left');
      icon.classList.add('fa-chevron-right');
    } else {
      icon.classList.remove('fa-chevron-right');
      icon.classList.add('fa-chevron-left');
    }
  });

  // Dashboard submenu toggle
  const dashboardMenu = document.getElementById('dashboard-menu');
  const dashboardSubmenu = document.getElementById('dashboard-submenu');
  
  dashboardMenu.addEventListener('click', function() {
    const arrow = this.querySelector('.menu-arrow i');
    if (dashboardSubmenu.style.display === 'none') {
      dashboardSubmenu.style.display = 'flex';
      arrow.classList.remove('fa-chevron-down');
      arrow.classList.add('fa-chevron-up');
    } else {
      dashboardSubmenu.style.display = 'none';
      arrow.classList.remove('fa-chevron-up');
      arrow.classList.add('fa-chevron-down');
    }
  });

  // Notifications dropdown
  const notificationsBtn = document.getElementById('notifications-btn');
  const notificationsDropdown = document.getElementById('notifications-dropdown');
  
  notificationsBtn.addEventListener('click', function() {
    notificationsDropdown.classList.toggle('hidden');
  });

  // Close notifications when clicking outside
  document.addEventListener('click', function(event) {
    if (!notificationsBtn.contains(event.target) && !notificationsDropdown.contains(event.target)) {
      notificationsDropdown.classList.add('hidden');
    }
  });

  // Handle notification actions
  const approveButtons = document.querySelectorAll('.approve-btn');
  const rejectButtons = document.querySelectorAll('.reject-btn');
  
  approveButtons.forEach(button => {
    button.addEventListener('click', function() {
      const notificationItem = this.closest('.notification-item');
      notificationItem.remove();
      updateNotificationBadge();
    });
  });
  
  rejectButtons.forEach(button => {
    button.addEventListener('click', function() {
      const notificationItem = this.closest('.notification-item');
      notificationItem.remove();
      updateNotificationBadge();
    });
  });

  function updateNotificationBadge() {
    const notificationItems = document.querySelectorAll('.notification-item');
    const badge = document.querySelector('.notifications-badge');
    
    if (notificationItems.length === 0) {
      badge.classList.add('hidden');
    } else {
      badge.textContent = notificationItems.length;
    }
  }

  // Logout button
  const logoutBtn = document.getElementById('logout-btn');
  
  logoutBtn.addEventListener('click', function() {
    // In a real app, you would handle logout logic here
    alert('Logout clicked. In a real app, this would log you out.');
  });

  // Porta selector
  const portaButtons = document.querySelectorAll('.porta-btn');
  const portaTitle = document.getElementById('porta-title');
  
  portaButtons.forEach(button => {
    button.addEventListener('click', function() {
      const porta = this.dataset.porta;
      
      // Update active button
      portaButtons.forEach(btn => btn.classList.remove('active'));
      this.classList.add('active');
      
      // Update title
      portaTitle.textContent = `PORTA PARA ${porta.toUpperCase()} | 2025 - 2027`;
      
      // Update initiatives
      loadInitiatives(porta);
    });
  });

  // Submenu porta selector
  const submenuItems = document.querySelectorAll('.submenu-item');
  
  submenuItems.forEach(item => {
    item.addEventListener('click', function(e) {
      e.preventDefault();
      const porta = this.dataset.porta;
      
      // Update active submenu item
      submenuItems.forEach(item => item.classList.remove('active'));
      this.classList.add('active');
      
      // Update porta buttons
      portaButtons.forEach(btn => {
        if (btn.dataset.porta === porta) {
          btn.classList.add('active');
        } else {
          btn.classList.remove('active');
        }
      });
      
      // Update title
      portaTitle.textContent = `PORTA PARA ${porta.toUpperCase()} | 2025 - 2027`;
      
      // Update initiatives
      loadInitiatives(porta);
    });
  });

  // New Initiative Modal
  const newInitiativeBtn = document.getElementById('new-initiative-btn');
  const newInitiativeModal = document.getElementById('new-initiative-modal');
  const newInitiativeModalClose = document.getElementById('new-initiative-modal-close');
  const initiativeCancelBtn = document.getElementById('initiative-cancel-btn');
  const newInitiativeForm = document.getElementById('new-initiative-form');
  
  newInitiativeBtn.addEventListener('click', function() {
    newInitiativeModal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
  });
  
  function closeNewInitiativeModal() {
    newInitiativeModal.classList.add('hidden');
    document.body.style.overflow = 'auto';
    newInitiativeForm.reset();
    clearFormErrors();
  }
  
  newInitiativeModalClose.addEventListener('click', closeNewInitiativeModal);
  initiativeCancelBtn.addEventListener('click', closeNewInitiativeModal);
  
  newInitiativeForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    if (validateInitiativeForm()) {
      // In a real app, you would send this data to your backend
      setTimeout(() => {
        alert('Iniciativa criada com sucesso!');
        closeNewInitiativeModal();
        
        // Reload initiatives
        const activePorta = document.querySelector('.porta-btn.active').dataset.porta;
        loadInitiatives(activePorta);
      }, 800);
    }
  });
  
  function validateInitiativeForm() {
    let isValid = true;
    clearFormErrors();
    
    const title = document.getElementById('initiative-title').value.trim();
    const description = document.getElementById('initiative-description').value.trim();
    const responsible = document.getElementById('initiative-responsible').value.trim();
    
    if (!title) {
      document.getElementById('title-error').textContent = 'O título da iniciativa é obrigatório';
      isValid = false;
    }
    
    if (!description) {
      document.getElementById('description-error').textContent = 'A descrição da iniciativa é obrigatória';
      isValid = false;
    }
    
    if (!responsible) {
      document.getElementById('responsible-error').textContent = 'O responsável é obrigatório';
      isValid = false;
    }
    
    return isValid;
  }
  
  function clearFormErrors() {
    document.getElementById('title-error').textContent = '';
    document.getElementById('description-error').textContent = '';
    document.getElementById('responsible-error').textContent = '';
    document.getElementById('submit-error').textContent = '';
    document.getElementById('submit-error').classList.add('hidden');
  }

  // Meta Modal
  const metaModal = document.getElementById('meta-modal');
  const metaModalClose = document.getElementById('meta-modal-close');
  const metaModalCloseBtn = document.getElementById('meta-modal-close-btn');
  
  function closeMetaModal() {
    metaModal.classList.add('hidden');
    document.body.style.overflow = 'auto';
  }
  
  metaModalClose.addEventListener('click', closeMetaModal);
  metaModalCloseBtn.addEventListener('click', closeMetaModal);
  
  // Meta Edit Modal
  const metaEditModal = document.getElementById('meta-edit-modal');
  const metaEditModalClose = document.getElementById('meta-edit-modal-close');
  const metaEditCancel = document.getElementById('meta-edit-cancel');

  function openMetaEditModal(meta) {
    // Populate modal fields with meta data
    document.getElementById('meta-iniciativa').value = meta.iniciativa || '';
    document.getElementById('meta-resultado').value = meta.resultado || '';
    document.getElementById('meta-description').value = meta.description || '';
    document.getElementById('meta-responsible').value = meta.responsible || '';
    document.getElementById('meta-status').value = meta.status || 'satisfatorio';
    document.getElementById('meta-alcance').value = meta.alcance || 0;
    document.getElementById('meta-parecer').value = meta.parecer || '';

    // Show modal
    metaEditModal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
  }

  function closeMetaEditModal() {
    metaEditModal.classList.add('hidden');
    document.body.style.overflow = 'auto';
  }

  metaEditModalClose.addEventListener('click', closeMetaEditModal);
  metaEditCancel.addEventListener('click', closeMetaEditModal);

  // Assign click event to meta rows
  document.addEventListener('click', function(event) {
    const metaRow = event.target.closest('.meta-row');
    if (metaRow) {
      const meta = {
        iniciativa: metaRow.dataset.iniciativa,
        resultado: metaRow.dataset.resultado,
        description: metaRow.dataset.description,
        responsible: metaRow.dataset.responsible,
        status: metaRow.dataset.status,
        alcance: parseInt(metaRow.dataset.alcance, 10),
        parecer: metaRow.dataset.parecer,
      };
      openMetaEditModal(meta);
    }
  });

  // Modal Tabs
  const modalTabs = document.querySelectorAll('.modal-tab');
  const tabContents = document.querySelectorAll('.modal-tab-content');
  
  modalTabs.forEach(tab => {
    tab.addEventListener('click', function() {
      const tabName = this.dataset.tab;
      
      // Update active tab
      modalTabs.forEach(tab => tab.classList.remove('active'));
      this.classList.add('active');
      
      // Show corresponding content
      tabContents.forEach(content => {
        if (content.id === `${tabName}-tab`) {
          content.classList.add('active');
        } else {
          content.classList.remove('active');
        }
      });
    });
  });

  // History Navigation
  const historyPrev = document.getElementById('history-prev');
  const historyNext = document.getElementById('history-next');
  const historyIndicator = document.getElementById('history-indicator');
  let currentHistoryIndex = 0;
  let historyItems = [];
  
  historyPrev.addEventListener('click', function() {
    if (currentHistoryIndex < historyItems.length - 1) {
      currentHistoryIndex++;
      updateHistoryView();
    }
  });
  
  historyNext.addEventListener('click', function() {
    if (currentHistoryIndex > 0) {
      currentHistoryIndex--;
      updateHistoryView();
    }
  });
  
  function updateHistoryView() {
    // Update navigation buttons
    if (currentHistoryIndex >= historyItems.length - 1) {
      historyPrev.classList.add('disabled');
    } else {
      historyPrev.classList.remove('disabled');
    }
    
    if (currentHistoryIndex <= 0) {
      historyNext.classList.add('disabled');
    } else {
      historyNext.classList.remove('disabled');
    }
    
    // Update indicator text
    if (currentHistoryIndex === 0) {
      historyIndicator.textContent = 'Atual';
    } else {
      historyIndicator.textContent = `Histórico ${currentHistoryIndex}/${historyItems.length - 1}`;
    }
    
    // Update history content
    const item = historyItems[currentHistoryIndex];
    document.getElementById('history-status-indicator').style.backgroundColor = getStatusColor(item.status);
    document.getElementById('history-status-text').textContent = getStatusText(item.status);
    document.getElementById('history-date').textContent = item.date;
    document.getElementById('history-parecer').textContent = item.parecer;
    
    // Update timeline
    const timelineItems = document.querySelectorAll('.timeline-item');
    timelineItems.forEach((item, index) => {
      if (index === currentHistoryIndex) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });
  }

  // Load initial data
  loadInitiatives('fora');
}

// Sample data
const initiatives = {
  fora: [
    {
      id: "1",
      title: "1. NCPI Dissemina",
      description: "O NCPI Dissemina é a iniciativa voltada a ampliar a capacidade do NCPI disseminar evidências e conhecimentos científicos plurais com potencial de impacto sobre o desenho e a implementação de políticas públicas voltadas às Primeiras Infâncias.",
      responsible: "Ana Silva",
      metasCount: 11,
      statusCounts: {
        satisfatorio: 2,
        alerta: 3,
        critico: 4,
        concluido: 1,
        naoMonitorado: 1,
      },
      defaultOpen: false,
    },
    {
      id: "2",
      title: "2. NCPI Conecta",
      description: "Canais e produtos voltados a levar evidências científicas para formuladores de políticas e agentes de implementação que atuam para aterrissar as políticas públicas e para desenvolver serviços públicos para as crianças na primeira infância.",
      responsible: "Ana Silva",
      metasCount: 11,
      statusCounts: {
        satisfatorio: 2,
        alerta: 3,
        critico: 4,
        concluido: 1,
        naoMonitorado: 1,
      },
      resultados: [
        {
          id: "1.1",
          title: "1.1. NCPI visto como top referência sobre evidências para desenho e implementação de PPPI",
          defaultOpen: true,
          metas: [
            {
              id: "1.1.1",
              status: "satisfatorio",
              description: "Manter o site do NCPI entre os 3 primeiros colocados no Google em buscas de expressões prioritárias",
              responsible: "Ana Silva",
              alcance: 78,
              date: "Abr 2025",
              parecer: "O site do NCPI tem mantido bom posicionamento nas buscas por palavras-chave prioritárias, mas ainda há oportunidades de melhoria para alcançar o primeiro lugar em algumas expressões específicas.",
              statusHistory: [
                {
                  date: "Jan 2025",
                  status: "alerta",
                  parecer: "O site do NCPI caiu para a 5ª posição em algumas buscas importantes. É necessário revisar a estratégia de SEO urgentemente.",
                },
                {
                  date: "Fev 2025",
                  status: "alerta",
                  parecer: "Após ajustes iniciais, o site recuperou algumas posições, mas ainda está abaixo da meta. Continuamos monitorando e implementando melhorias.",
                },
                {
                  date: "Mar 2025",
                  status: "satisfatorio",
                  parecer: "Houve melhora significativa no posicionamento. O site agora aparece entre os 3 primeiros resultados para 70% das palavras-chave prioritárias.",
                },
              ],
              encaminhamentos: [
                {
                  id: "e1",
                  description: "Revisar estratégia de SEO para melhorar posicionamento",
                  prazo: "30/06/2025",
                  responsavel: "Ana Silva",
                },
                {
                  id: "e2",
                  description: "Implementar novas palavras-chave no site",
                  prazo: "15/07/2025",
                  responsavel: "Carlos Mendes",
                },
              ],
            },
            {
              id: "1.1.2",
              status: "alerta",
              description: "Aumentar a diversidade étnico-racial e regional de fontes sugeridas para entrevistas a veículos Tier 1",
              responsible: "Ana Silva",
              alcance: 37,
              date: "Abr 2025",
              parecer: "Houve avanço na diversidade de fontes, mas ainda estamos abaixo da meta estabelecida. É necessário ampliar o banco de especialistas e intensificar o contato com pesquisadores de diferentes regiões do país.",
              statusHistory: [
                {
                  date: "Jan 2025",
                  status: "critico",
                  parecer: "Menos de 20% das fontes sugeridas representam diversidade étnico-racial e regional. Precisamos de uma estratégia mais agressiva.",
                },
                {
                  date: "Fev 2025",
                  status: "critico",
                  parecer: "Iniciamos o mapeamento de novos especialistas, mas o progresso ainda é lento. Apenas 25% de diversidade alcançada.",
                },
                {
                  date: "Mar 2025",
                  status: "alerta",
                  parecer: "Houve melhora para 30% de diversidade, mas ainda estamos longe da meta. O novo banco de dados de especialistas está em desenvolvimento.",
                },
              ],
              encaminhamentos: [
                {
                  id: "e3",
                  description: "Mapear novos especialistas em regiões sub-representadas",
                  prazo: "15/08/2025",
                  responsavel: "Mariana Oliveira",
                },
                {
                  id: "e4",
                  description: "Realizar workshop de mídia para novos porta-vozes",
                  prazo: "30/09/2025",
                  responsavel: "Ana Silva",
                },
              ],
            },
            {
              id: "1.1.3",
              status: "critico",
              description: "Obter espaço editorial fixo para ao menos 2 integrantes do CC, com diversidade étnico-racial, regional e epistemológica",
              responsible: "Ana Silva",
              alcance: 19,
              date: "Abr 2025",
              parecer: "Meta em situação crítica. Apenas um espaço editorial foi conquistado até o momento, e não há negociações avançadas com outros veículos. É necessário revisar a estratégia e intensificar contatos com editores.",
              statusHistory: [
                {
                  date: "Jan 2025",
                  status: "critico",
                  parecer: "Nenhum espaço editorial fixo conquistado até o momento. Contatos iniciais com veículos não avançaram.",
                },
                {
                  date: "Fev 2025",
                  status: "critico",
                  parecer: "Continuamos sem avanços significativos. Estamos revisando a abordagem com os veículos.",
                },
                {
                  date: "Mar 2025",
                  status: "critico",
                  parecer: "Um espaço editorial foi conquistado, mas ainda estamos longe da meta de dois espaços com diversidade.",
                },
              ],
              encaminhamentos: [
                {
                  id: "e5",
                  description: "Agendar reuniões com editores de veículos prioritários",
                  prazo: "30/07/2025",
                  responsavel: "Ana Silva",
                },
                {
                  id: "e6",
                  description: "Desenvolver propostas de colunas temáticas para apresentar aos veículos",
                  prazo: "15/08/2025",
                  responsavel: "Pedro Almeida",
                },
              ],
            },
            {
              id: "1.1.4",
              status: "concluido",
              description: "Aumentar base de inscrições na newsletter em X% ao ano com taxa média de abertura de 20% ao ano",
              responsible: "Ana Silva",
              alcance: 100,
              date: "Abr 2025",
              parecer: "Meta concluída com sucesso. A base de inscritos cresceu acima do esperado e a taxa de abertura se manteve em 23%, superando a meta de 20%. As estratégias de conteúdo e segmentação mostraram-se eficazes.",
              statusHistory: [
                {
                  date: "Jan 2025",
                  status: "satisfatorio",
                  parecer: "Crescimento de inscritos está em 80% da meta, com taxa de abertura de 18%. Estamos no caminho certo.",
                },
                {
                  date: "Fev 2025",
                  status: "satisfatorio",
                  parecer: "Crescimento atingiu 90% da meta e taxa de abertura subiu para 21%. Estratégias de conteúdo estão funcionando bem.",
                },
                {
                  date: "Mar 2025",
                  status: "concluido",
                  parecer: "Meta atingida! Crescimento superou o esperado e taxa de abertura está em 22%. Continuaremos monitorando para manter o desempenho.",
                },
              ],
              encaminhamentos: [
                {
                  id: "e7",
                  description: "Documentar estratégias bem-sucedidas para replicação",
                  prazo: "15/07/2025",
                  responsavel: "Ana Silva",
                },
                {
                  id: "e8",
                  description: "Definir novas metas de crescimento para o próximo ciclo",
                  prazo: "30/07/2025",
                  responsavel: "Comitê Estratégico",
                },
              ],
            },
            {
              id: "1.1.5",
              status: "naoMonitorado",
              description: "5 X% de crescimento de menções ao NCPI e seus produtos na imprensa",
              responsible: "Ana Silva",
              alcance: 0,
              date: "Abr 2025",
              parecer: "Meta ainda não monitorada. É necessário implementar ferramentas de monitoramento de mídia para acompanhar as menções ao NCPI e seus produtos na imprensa.",
              statusHistory: [],
              encaminhamentos: [
                {
                  id: "e9",
                  description: "Contratar serviço de clipping e monitoramento de mídia",
                  prazo: "30/08/2025",
                  responsavel: "Ana Silva",
                },
                {
                  id: "e10",
                  description: "Definir linha de base e métricas de acompanhamento",
                  prazo: "15/09/2025",
                  responsavel: "Equipe de Comunicação",
                },
              ],
            },
          ],
        },
        {
          id: "1.2",
          title: "1.2. NCPI visto como top referência sobre evidências para desenho e implementação de PPPI",
          metas: [],
        },
      ],
      defaultOpen: true,
    },
  ],
  dentro: [
    {
      id: "3",
      title: "3. NCPI Inova",
      description: "Iniciativa focada em desenvolver soluções inovadoras para os desafios da primeira infância, integrando tecnologia e metodologias avançadas para melhorar a qualidade dos serviços.",
      responsible: "Carlos Mendes",
      metasCount: 8,
      statusCounts: {
        satisfatorio: 3,
        alerta: 2,
        critico: 1,
        concluido: 2,
        naoMonitorado: 0,
      },
      defaultOpen: false,
    },
  ],
};

function loadInitiatives(porta) {
  const initiativesContainer = document.getElementById('initiatives-container');
  initiativesContainer.innerHTML = '';
  
  const filteredInitiatives = initiatives[porta] || [];
  
  // Update metrics
  updateMetrics(filteredInitiatives);
  
  if (filteredInitiatives.length === 0) {
    initiativesContainer.innerHTML = `
      <div class="bg-white rounded-lg shadow-sm p-8 text-center">
        <p class="text-gray-500">Nenhuma iniciativa encontrada para esta porta.</p>
      </div>
    `;
    return;
  }
  
  filteredInitiatives.forEach(initiative => {
    const initiativeCard = createInitiativeCard(initiative);
    initiativesContainer.appendChild(initiativeCard);
  });
}

function updateMetrics(initiatives) {
  // Calculate total metrics
  const totalMetrics = {
    iniciativas: initiatives.length,
    resultados: initiatives.reduce((acc, initiative) => acc + (initiative.resultados?.length || 0), 0),
    metas: initiatives.reduce((acc, initiative) => acc + initiative.metasCount, 0),
    status: {
      satisfatorio: initiatives.reduce((acc, initiative) => acc + initiative.statusCounts.satisfatorio, 0),
      alerta: initiatives.reduce((acc, initiative) => acc + initiative.statusCounts.alerta, 0),
      critico: initiatives.reduce((acc, initiative) => acc + initiative.statusCounts.critico, 0),
      concluido: initiatives.reduce((acc, initiative) => acc + initiative.statusCounts.concluido, 0),
      naoMonitorado: initiatives.reduce((acc, initiative) => acc + initiative.statusCounts.naoMonitorado, 0),
    },
  };
  
  // Update metrics in the UI
  document.getElementById('iniciativas-count').textContent = totalMetrics.iniciativas;
  document.getElementById('resultados-count').textContent = totalMetrics.resultados;
  document.getElementById('metas-count').textContent = totalMetrics.metas;
  document.getElementById('satisfatorio-count').textContent = totalMetrics.status.satisfatorio;
  document.getElementById('alerta-count').textContent = totalMetrics.status.alerta;
  document.getElementById('critico-count').textContent = totalMetrics.status.critico;
  document.getElementById('concluido-count').textContent = totalMetrics.status.concluido;
  document.getElementById('naoMonitorado-count').textContent = totalMetrics.status.naoMonitorado;
}

function createInitiativeCard(initiative) {
  const card = document.createElement('div');
  card.className = 'initiative-card';
  
  // Header
  const header = document.createElement('div');
  header.className = 'initiative-header';
  
  const titleContainer = document.createElement('div');
  titleContainer.className = 'initiative-title-container';
  
  const titleLeft = document.createElement('div');
  titleLeft.className = 'initiative-title-left';
  
  const toggle = document.createElement('button');
  toggle.className = 'initiative-toggle';
  toggle.innerHTML = '<i class="fas fa-chevron-right"></i>';
  if (initiative.defaultOpen) {
    toggle.classList.add('open');
    toggle.querySelector('i').classList.remove('fa-chevron-right');
    toggle.querySelector('i').classList.add('fa-chevron-down');
  }
  
  const title = document.createElement('div');
  title.className = 'initiative-title';
  title.textContent = initiative.title;
  
  titleLeft.appendChild(toggle);
  titleLeft.appendChild(title);
  
  const metrics = document.createElement('div');
  metrics.className = 'initiative-metrics';
  
  const count = document.createElement('div');
  count.className = 'initiative-count';
  count.textContent = `${initiative.metasCount} METAS`;
  
  const status = document.createElement('div');
  status.className = 'initiative-status';
  
  // Add status indicators
  const statusTypes = ['satisfatorio', 'alerta', 'critico', 'concluido', 'naoMonitorado'];
  const statusColors = {
    satisfatorio: '#03B51A',
    alerta: '#FFB001',
    critico: '#FF0028',
    concluido: '#04A2F3',
    naoMonitorado: '#CCCCCC',
  };
  
  statusTypes.forEach(type => {
    const statusItem = document.createElement('div');
    statusItem.className = 'initiative-status-item';
    statusItem.style.backgroundColor = statusColors[type];
    statusItem.textContent = initiative.statusCounts[type];
    status.appendChild(statusItem);
  });
  
  metrics.appendChild(count);
  metrics.appendChild(status);
  
  titleContainer.appendChild(titleLeft);
  titleContainer.appendChild(metrics);
  
  const responsible = document.createElement('div');
  responsible.className = 'initiative-responsible';
  responsible.innerHTML = `<span>${initiative.responsible}</span>`;
  
  header.appendChild(titleContainer);
  header.appendChild(responsible);
  
  card.appendChild(header);
  
  // Content (only shown if defaultOpen is true)
  if (initiative.defaultOpen) {
    const content = document.createElement('div');
    content.className = 'initiative-content';
    
    const description = document.createElement('p');
    description.className = 'initiative-description';
    description.textContent = initiative.description;
    description.style.marginLeft = '24px';
    description.style.marginBottom = '24px';
    
    content.appendChild(description);
    
    // Action Buttons
    const actions = document.createElement('div');
    actions.className = 'initiative-actions';
    
    const newResultadoBtn = document.createElement('button');
    newResultadoBtn.className = 'new-resultado-btn';
    newResultadoBtn.innerHTML = 'Novo Resultado <i class="fas fa-plus"></i>';
    
    const newMetaBtn = document.createElement('button');
    newMetaBtn.className = 'new-meta-btn';
    newMetaBtn.innerHTML = 'Nova Meta <i class="fas fa-plus"></i>';
    
    actions.appendChild(newResultadoBtn);
    actions.appendChild(newMetaBtn);
    
    content.appendChild(actions);
    
    // Resultados Section (if any)
    if (initiative.resultados && initiative.resultados.length > 0) {
      const resultadosSection = document.createElement('div');
      resultadosSection.className = 'resultados-section';
      
      const resultadosTitle = document.createElement('h4');
      resultadosTitle.className = 'resultados-title';
      resultadosTitle.textContent = 'Resultados';
      
      resultadosSection.appendChild(resultadosTitle);
      
      // Create resultado accordions
      initiative.resultados.forEach(resultado => {
        const resultadoAccordion = createResultadoAccordion(resultado);
        resultadosSection.appendChild(resultadoAccordion);
      });
      
      content.appendChild(resultadosSection);
    }
    
    card.appendChild(content);
  }
  
  // Toggle functionality
  toggle.addEventListener('click', function() {
    this.classList.toggle('open');
    const icon = this.querySelector('i');
    
    if (this.classList.contains('open')) {
      icon.classList.remove('fa-chevron-right');
      icon.classList.add('fa-chevron-down');
      
      // If content doesn't exist yet, create it
      if (!card.querySelector('.initiative-content')) {
        const content = document.createElement('div');
        content.className = 'initiative-content';
        
        const description = document.createElement('p');
        description.className = 'initiative-description';
        description.textContent = initiative.description;
        description.style.marginLeft = '24px';
        description.style.marginBottom = '24px';
        
        content.appendChild(description);
        
        // Action Buttons
        const actions = document.createElement('div');
        actions.className = 'initiative-actions';
        
        const newResultadoBtn = document.createElement('button');
        newResultadoBtn.className = 'new-resultado-btn';
        newResultadoBtn.innerHTML = 'Novo Resultado <i class="fas fa-plus"></i>';
        
        const newMetaBtn = document.createElement('button');
        newMetaBtn.className = 'new-meta-btn';
        newMetaBtn.innerHTML = 'Nova Meta <i class="fas fa-plus"></i>';
        
        actions.appendChild(newResultadoBtn);
        actions.appendChild(newMetaBtn);
        
        content.appendChild(actions);
        
        // Resultados Section (if any)
        if (initiative.resultados && initiative.resultados.length > 0) {
          const resultadosSection = document.createElement('div');
          resultadosSection.className = 'resultados-section';
          
          const resultadosTitle = document.createElement('h4');
          resultadosTitle.className = 'resultados-title';
          resultadosTitle.textContent = 'Resultados';
          
          resultadosSection.appendChild(resultadosTitle);
          
          // Create resultado accordions
          initiative.resultados.forEach(resultado => {
            const resultadoAccordion = createResultadoAccordion(resultado);
            resultadosSection.appendChild(resultadoAccordion);
          });
          
          content.appendChild(resultadosSection);
        }
        
        card.appendChild(content);
      } else {
        // If content exists, just show it
        card.querySelector('.initiative-content').style.display = 'block';
      }
    } else {
      icon.classList.remove('fa-chevron-down');
      icon.classList.add('fa-chevron-right');
      
      // Hide content
      card.querySelector('.initiative-content').style.display = 'none';
    }
  });
  
  return card;
}

function createResultadoAccordion(resultado) {
  const accordion = document.createElement('div');
  accordion.className = 'resultado-accordion';
  
  const header = document.createElement('div');
  header.className = 'resultado-header';
  
  const toggle = document.createElement('button');
  toggle.className = 'resultado-toggle';
  toggle.innerHTML = '<i class="fas fa-chevron-right"></i>';
  if (resultado.defaultOpen) {
    toggle.classList.add('open');
    toggle.querySelector('i').classList.remove('fa-chevron-right');
    toggle.querySelector('i').classList.add('fa-chevron-down');
  }
  
  const title = document.createElement('h5');
  title.className = 'resultado-title';
  title.textContent = resultado.title;
  
  header.appendChild(toggle);
  header.appendChild(title);
  
  accordion.appendChild(header);
  
  // Content (only shown if defaultOpen is true)
  if (resultado.defaultOpen) {
    const content = document.createElement('div');
    content.className = 'resultado-content';
    
    // Metas Table
    content.appendChild(createMetasTable(resultado.metas));
    
    accordion.appendChild(content);
  }
  
  // Toggle functionality
  toggle.addEventListener('click', function() {
    this.classList.toggle('open');
    const icon = this.querySelector('i');
    
    if (this.classList.contains('open')) {
      icon.classList.remove('fa-chevron-right');
      icon.classList.add('fa-chevron-down');
      
      // If content doesn't exist yet, create it
      if (!accordion.querySelector('.resultado-content')) {
        const content = document.createElement('div');
        content.className = 'resultado-content';
        
        // Metas Table
        content.appendChild(createMetasTable(resultado.metas));
        
        accordion.appendChild(content);
      } else {
        // If content exists, just show it
        accordion.querySelector('.resultado-content').style.display = 'block';
      }
    } else {
      icon.classList.remove('fa-chevron-down');
      icon.classList.add('fa-chevron-right');
      
      // Hide content
      accordion.querySelector('.resultado-content').style.display = 'none';
    }
  });
  
  return accordion;
}

function createMetasTable(metas) {
  const tableContainer = document.createElement('div');
  tableContainer.className = 'metas-table-container';
  
  const table = document.createElement('table');
  table.className = 'metas-table';
  
  // Table Header
  const thead = document.createElement('thead');
  thead.innerHTML = `
    <tr>
      <th>Status</th>
      <th>Meta</th>
      <th>Responsável</th>
      <th style="text-align: center;">Alcance</th>
      <th style="text-align: center;">Editar</th>
    </tr>
  `;
  
  // Table Body
  const tbody = document.createElement('tbody');
  
  if (metas.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="5" style="text-align: center; padding: 24px; color: #909090;">
          Nenhuma meta cadastrada para este resultado.
        </td>
      </tr>
    `;
  } else {
    metas.forEach(meta => {
      const tr = document.createElement('tr');
      tr.className = 'meta-row';
      
      // Status Cell
      const statusCell = document.createElement('td');
      statusCell.className = 'meta-status-cell';
      
      const statusIndicator = document.createElement('div');
      statusIndicator.className = 'status-indicator';
      statusIndicator.style.backgroundColor = getStatusColor(meta.status);
      
      const statusIndicatorInner = document.createElement('div');
      statusIndicatorInner.className = 'status-indicator-inner';
      
      statusIndicator.appendChild(statusIndicatorInner);
      statusCell.appendChild(statusIndicator);
      
      const statusDate = document.createElement('div');
      statusDate.className = 'meta-status-date';
      statusDate.textContent = meta.date;
      
      statusCell.appendChild(statusDate);
      
      // Description Cell
      const descriptionCell = document.createElement('td');
      descriptionCell.className = 'meta-description-cell';
      descriptionCell.textContent = meta.description;
      
      // Responsible Cell
      const responsibleCell = document.createElement('td');
      responsibleCell.className = 'meta-responsible-cell';
      responsibleCell.textContent = meta.responsible;
      
      // Alcance Cell
      const alcanceCell = document.createElement('td');
      alcanceCell.className = 'meta-alcance-cell';
      
      const progressCircle = document.createElement('div');
      progressCircle.className = 'progress-circle-container';
      
      const radius = 18;
      const circumference = 2 * Math.PI * radius;
      const strokeDashoffset = circumference - (meta.alcance / 100) * circumference;
      
      progressCircle.innerHTML = `
        <svg width="48" height="48" viewBox="0 0 48 48">
          <circle cx="24" cy="24" r="${radius}" fill="transparent" stroke="#E5E5E5" stroke-width="4" />
          <circle cx="24" cy="24" r="${radius}" fill="transparent" 
            stroke="${meta.alcance === 0 ? '#E5E5E5' : meta.alcance === 100 ? '#03B51A' : '#909090'}" 
            stroke-width="4" 
            stroke-dasharray="${circumference}" 
            stroke-dashoffset="${strokeDashoffset}" 
            stroke-linecap="round" 
            transform="rotate(-90 24 24)" />
        </svg>
        <span class="progress-value">${meta.alcance}%</span>
      `;
      
      alcanceCell.appendChild(progressCircle);
      
      // Edit Cell
      const editCell = document.createElement('td');
      editCell.className = 'meta-edit-cell';
      
      const editBtn = document.createElement('button');
      editBtn.className = 'meta-edit-btn';
      editBtn.innerHTML = '<i class="fas fa-edit"></i>';
      editBtn.setAttribute('aria-label', 'Editar meta');
      
      editCell.appendChild(editBtn);
      
      // Add cells to row
      tr.appendChild(statusCell);
      tr.appendChild(descriptionCell);
      tr.appendChild(responsibleCell);
      tr.appendChild(alcanceCell);
      tr.appendChild(editCell);
      
      // Add click event to row
      tr.addEventListener('click', function(e) {
        if (!e.target.closest('.meta-edit-btn')) {
          openMetaModal(meta);
        }
      });
      
      // Add click event to edit button
      editBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        openMetaEditModal(meta);
      });
      
      tbody.appendChild(tr);
    });
  }
  
  table.appendChild(thead);
  table.appendChild(tbody);
  tableContainer.appendChild(table);
  
  return tableContainer;
}

function openMetaModal(meta) {
  const metaModal = document.getElementById('meta-modal');
  
  // Set modal title and status indicator
  document.getElementById('meta-modal-title').textContent = meta.description;
  const statusIndicator = document.getElementById('meta-status-indicator');
  statusIndicator.style.backgroundColor = getStatusColor(meta.status);
  statusIndicator.classList.remove('animate');
  
  // Animate status indicator
  setTimeout(() => {
    statusIndicator.classList.add('animate');
  }, 300);
  
  // Set overview tab content
  document.getElementById('meta-iniciativa').textContent = meta.iniciativa || 'NCPI Conecta';
  document.getElementById('meta-resultado').textContent = meta.resultado || '1.1. NCPI visto como top referência sobre evidências para desenho e implementação de PPPI';
  document.getElementById('meta-responsible').textContent = meta.responsible;
  
  // Set progress circle
  const progressCircle = document.getElementById('meta-progress-circle');
  const radius = 24;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (meta.alcance / 100) * circumference;
  
  progressCircle.setAttribute('stroke-dasharray', circumference);
  progressCircle.setAttribute('stroke-dashoffset', circumference);
  progressCircle.setAttribute('stroke', meta.alcance === 0 ? '#E5E5E5' : meta.alcance === 100 ? '#03B51A' : '#909090');
  
  // Animate progress circle
  setTimeout(() => {
    progressCircle.style.transition = 'stroke-dashoffset 1s ease-out';
    progressCircle.setAttribute('stroke-dashoffset', strokeDashoffset);
  }, 300);
  
  document.getElementById('meta-alcance').textContent = `${meta.alcance}%`;
  
  // Set current status
  document.getElementById('current-status-indicator').style.backgroundColor = getStatusColor(meta.status);
  document.getElementById('meta-status-text').textContent = getStatusText(meta.status);
  document.getElementById('meta-date').textContent = meta.date;
  document.getElementById('meta-parecer').textContent = meta.parecer;
  
  // Set history tab content
  // Combine current status with history for navigation
  const currentStatus = {
    date: meta.date,
    status: meta.status,
    parecer: meta.parecer,
  };
  
  historyItems = [currentStatus, ...(meta.statusHistory || [])];
  currentHistoryIndex = 0;
  
  // Update history view
  updateHistoryView();
  
  // Create timeline
  createTimeline(historyItems);
  
  // Set encaminhamentos tab content
  const encaminhamentosList = document.getElementById('encaminhamentos-list');
  encaminhamentosList.innerHTML = '';
  
  if (meta.encaminhamentos && meta.encaminhamentos.length > 0) {
    meta.encaminhamentos.forEach(item => {
      const tr = document.createElement('tr');
      
      tr.innerHTML = `
        <td>${item.description}</td>
        <td>
          <div class="encaminhamento-prazo">
            <i class="fas fa-clock"></i>
            <span>${item.prazo}</span>
          </div>
        </td>
        <td>
          <div class="encaminhamento-responsavel">
            <div class="responsavel-avatar">${getInitials(item.responsavel)}</div>
            <span>${item.responsavel}</span>
          </div>
        </td>
      `;
      
      encaminhamentosList.appendChild(tr);
    });
  } else {
    encaminhamentosList.innerHTML = `
      <tr>
        <td colspan="3" style="text-align: center; padding: 24px; color: #909090;">
          Nenhum encaminhamento cadastrado para esta meta.
        </td>
      </tr>
    `;
  }
  
  // Show modal
  metaModal.classList.remove('hidden');
  document.body.style.overflow = 'hidden';
  
  // Reset to overview tab
  document.querySelectorAll('.modal-tab').forEach(tab => {
    if (tab.dataset.tab === 'overview') {
      tab.classList.add('active');
    } else {
      tab.classList.remove('active');
    }
  });
  
  document.querySelectorAll('.modal-tab-content').forEach(content => {
    if (content.id === 'overview-tab') {
      content.classList.add('active');
    } else {
      content.classList.remove('active');
    }
  });
}

function createTimeline(items) {
  const timelineContainer = document.getElementById('timeline-container');
  timelineContainer.innerHTML = '';
  
  if (items.length <= 1) {
    return;
  }
  
  const timelineTitle = document.createElement('h4');
  timelineTitle.className = 'timeline-title';
  timelineTitle.textContent = 'Linha do Tempo';
  
  const timeline = document.createElement('div');
  timeline.className = 'timeline';
  
  const timelineLine = document.createElement('div');
  timelineLine.className = 'timeline-line';
  
  timeline.appendChild(timelineLine);
  
  items.forEach((item, index) => {
    const timelineItem = document.createElement('div');
    timelineItem.className = 'timeline-item';
    if (index === currentHistoryIndex) {
      timelineItem.classList.add('active');
    }
    
    const timelineIndicator = document.createElement('div');
    timelineIndicator.className = 'timeline-indicator';
    timelineIndicator.style.backgroundColor = getStatusColor(item.status);
    
    const timelineIndicatorInner = document.createElement('div');
    timelineIndicatorInner.className = 'timeline-indicator-inner';
    
    timelineIndicator.appendChild(timelineIndicatorInner);
    
    const timelineContent = document.createElement('div');
    timelineContent.className = 'timeline-content';
    
    const timelineHeader = document.createElement('div');
    timelineHeader.className = 'timeline-header';
    
    const timelineTitle = document.createElement('span');
    timelineTitle.className = 'timeline-title';
    timelineTitle.textContent = index === 0 ? 'Status Atual' : `Status Anterior ${index}`;
    
    const timelineDate = document.createElement('span');
    timelineDate.className = 'timeline-date';
    timelineDate.textContent = item.date;
    
    timelineHeader.appendChild(timelineTitle);
    timelineHeader.appendChild(timelineDate);
    
    const timelineStatus = document.createElement('div');
    timelineStatus.className = 'timeline-status';
    
    const timelineStatusLabel = document.createElement('span');
    timelineStatusLabel.className = 'timeline-status-label';
    timelineStatusLabel.textContent = 'Status:';
    
    const timelineStatusValue = document.createElement('span');
    timelineStatusValue.textContent = getStatusText(item.status);
    
    timelineStatus.appendChild(timelineStatusLabel);
    timelineStatus.appendChild(timelineStatusValue);
    
    const timelineParecer = document.createElement('p');
    timelineParecer.className = 'timeline-parecer';
    timelineParecer.textContent = item.parecer;
    
    timelineContent.appendChild(timelineHeader);
    timelineContent.appendChild(timelineStatus);
    timelineContent.appendChild(timelineParecer);
    
    if (index !== currentHistoryIndex) {
      const timelineViewBtn = document.createElement('button');
      timelineViewBtn.className = 'timeline-view-btn';
      timelineViewBtn.textContent = 'Ver detalhes';
      timelineViewBtn.addEventListener('click', function() {
        currentHistoryIndex = index;
        updateHistoryView();
      });
      
      timelineContent.appendChild(timelineViewBtn);
    }
    
    timelineItem.appendChild(timelineIndicator);
    timelineItem.appendChild(timelineContent);
    
    timeline.appendChild(timelineItem);
  });
  
  timelineContainer.appendChild(timelineTitle);
  timelineContainer.appendChild(timeline);
}

function getStatusColor(status) {
  switch (status) {
    case 'satisfatorio':
      return '#03B51A';
    case 'alerta':
      return '#FFB001';
    case 'critico':
      return '#FF0028';
    case 'concluido':
      return '#04A2F3';
    case 'naoMonitorado':
      return '#CCCCCC';
    default:
      return '#CCCCCC';
  }
}

function getStatusText(status) {
  switch (status) {
    case 'satisfatorio':
      return 'Satisfatório';
    case 'alerta':
      return 'Alerta';
    case 'critico':
      return 'Crítico';
    case 'concluido':
      return 'Concluído';
    case 'naoMonitorado':
      return 'Não Monitorado';
    default:
      return 'Desconhecido';
  }
}

function getInitials(name) {
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();
}