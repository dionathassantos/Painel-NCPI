document.addEventListener('DOMContentLoaded', function() {
    const token = localStorage.getItem('authToken');
    if (!token) {
        window.location.href = 'login.html'; // Redireciona para login se o token não existir
    }

    // Initialize porta selector
    const portaButtons = document.querySelectorAll('.porta-button');
    
    portaButtons.forEach(button => {
        button.addEventListener('click', function() {
            const porta = this.getAttribute('data-porta');
            
            // Update active button
            portaButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Filter initiatives
            filterInitiatives(porta);
        });
    });
    
    // Initialize initiative toggles
    const initiativeCards = document.querySelectorAll('.initiative-card');
    
    initiativeCards.forEach(card => {
        const toggle = card.querySelector('.initiative-toggle');
        
        toggle.addEventListener('click', function() {
            card.classList.toggle('expanded');
            
            // Update toggle icon
            const icon = this.querySelector('.toggle-icon');
            if (card.classList.contains('expanded')) {
                icon.innerHTML = `
                    <path d="M4.5 6.75L9 11.25L13.5 6.75" stroke="#04695E" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                `;
            } else {
                icon.innerHTML = `
                    <path d="M6.75 13.5L11.25 9L6.75 4.5" stroke="#04695E" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                `;
            }
        });
    });
    
    // Initialize resultado toggles
    const resultadoAccordions = document.querySelectorAll('.resultado-accordion');
    
    resultadoAccordions.forEach(accordion => {
        const header = accordion.querySelector('.resultado-header');
        
        header.addEventListener('click', function() {
            accordion.classList.toggle('expanded');
            
            // Update toggle icon
            const icon = accordion.querySelector('.toggle-icon');
            if (accordion.classList.contains('expanded')) {
                icon.innerHTML = `
                    <path d="M4 6L8 10L12 6" stroke="#04695E" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                `;
            } else {
                icon.innerHTML = `
                    <path d="M6 10L10 6L14 10" stroke="#04695E" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                `;
            }
        });
    });
    
    // Initialize progress circles
    const progressCircles = document.querySelectorAll('.progress-circle');
    
    progressCircles.forEach(circle => {
        const progress = parseInt(circle.getAttribute('data-progress'));
        const circumference = 2 * Math.PI * 18; // radius is 18
        const offset = circumference - (progress / 100) * circumference;
        
        const progressElement = circle.querySelector('.progress');
        progressElement.style.strokeDasharray = circumference;
        progressElement.style.strokeDashoffset = offset;
        
        // Change color based on progress
        if (progress === 100) {
            progressElement.style.stroke = '#03B51A';
        } else if (progress === 0) {
            progressElement.style.stroke = '#E5E5E5';
        } else {
            progressElement.style.stroke = '#909090';
        }
    });
    
    // Initialize meta rows
    const metaRows = document.querySelectorAll('.meta-row');
    
    metaRows.forEach(row => {
        row.addEventListener('click', function() {
            const metaId = this.getAttribute('data-id');
            openMetaModal(metaId);
        });
    });
    
    // Initialize edit buttons
    const editButtons = document.querySelectorAll('.edit-button');
    
    editButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.stopPropagation();
            const metaId = this.closest('.meta-row').getAttribute('data-id');
            openMetaEditModal(metaId);
        });
    });
    
    // Initialize new initiative button
    const newInitiativeButton = document.getElementById('newInitiativeButton');
    
    if (newInitiativeButton) {
        newInitiativeButton.addEventListener('click', function() {
            toggleModal('newInitiativeModal', true);
        });
    }
});

// Filter initiatives by porta
function filterInitiatives(porta) {
    const initiatives = document.querySelectorAll('.initiative-card');
    
    initiatives.forEach(initiative => {
        const initiativePorta = initiative.getAttribute('data-porta');
        
        if (initiativePorta === porta) {
            initiative.style.display = 'block';
        } else {
            initiative.style.display = 'none';
        }
    });
    
    // Update metrics
    updateMetrics(porta);
}

// Update metrics based on filtered initiatives
function updateMetrics(porta) {
    // In a real application, you would fetch this data from the server
    // For this demo, we'll use hardcoded values
    
    let metrics = {
        iniciativas: 0,
        resultados: 0,
        metas: 0,
        status: {
            satisfatorio: 0,
            alerta: 0,
            critico: 0,
            concluido: 0,
            naoMonitorado: 0
        }
    };
    
    if (porta === 'fora') {
        metrics = {
            iniciativas: 2,
            resultados: 3,
            metas: 22,
            status: {
                satisfatorio: 4,
                alerta: 6,
                critico: 8,
                concluido: 2,
                naoMonitorado: 2
            }
        };
    } else if (porta === 'dentro') {
        metrics = {
            iniciativas: 1,
            resultados: 2,
            metas: 8,
            status: {
                satisfatorio: 3,
                alerta: 2,
                critico: 1,
                concluido: 2,
                naoMonitorado: 0
            }
        };
    }
    
    // Update DOM
    document.querySelector('.metric-value:nth-of-type(1)').textContent = metrics.iniciativas;
    document.querySelector('.metric-value:nth-of-type(2)').textContent = metrics.resultados;
    document.querySelector('.metric-value:nth-of-type(3)').textContent = metrics.metas;
    
    document.querySelector('.status-count:nth-of-type(1)').textContent = metrics.status.satisfatorio;
    document.querySelector('.status-count:nth-of-type(2)').textContent = metrics.status.alerta;
    document.querySelector('.status-count:nth-of-type(3)').textContent = metrics.status.critico;
    document.querySelector('.status-count:nth-of-type(4)').textContent = metrics.status.concluido;
    document.querySelector('.status-count:nth-of-type(5)').textContent = metrics.status.naoMonitorado;
}

// Open meta modal
function openMetaModal(metaId) {
    // In a real application, you would fetch this data from the server
    // For this demo, we'll use hardcoded values
    
    const meta = {
        id: metaId,
        title: 'Manter o site do NCPI entre os 3 primeiros colocados no Google em buscas de expressões prioritárias',
        status: 'satisfatorio',
        responsible: 'Ana Silva',
        alcance: 78,
        date: 'Abr 2025',
        iniciativa: 'NCPI Dissemina',
        resultado: 'NCPI visto como top referência sobre evidências para desenho e implementação de PPPI',
        parecer: 'O site do NCPI tem mantido bom posicionamento nas buscas por palavras-chave prioritárias, mas ainda há oportunidades de melhoria para alcançar o primeiro lugar em algumas expressões específicas.',
        statusHistory: [
            {
                date: 'Jan 2025',
                status: 'alerta',
                parecer: 'O site do NCPI caiu para a 5ª posição em algumas buscas importantes. É necessário revisar a estratégia de SEO urgentemente.'
            },
            {
                date: 'Fev 2025',
                status: 'alerta',
                parecer: 'Após ajustes iniciais, o site recuperou algumas posições, mas ainda está abaixo da meta. Continuamos monitorando e implementando melhorias.'
            },
            {
                date: 'Mar 2025',
                status: 'satisfatorio',
                parecer: 'Houve melhora significativa no posicionamento. O site agora aparece entre os 3 primeiros resultados para 70% das palavras-chave prioritárias.'
            }
        ],
        encaminhamentos: [
            {
                id: 'e1',
                description: 'Revisar estratégia de SEO para melhorar posicionamento',
                prazo: '30/06/2025',
                responsavel: 'Ana Silva'
            },
            {
                id: 'e2',
                description: 'Implementar novas palavras-chave no site',
                prazo: '15/07/2025',
                responsavel: 'Carlos Mendes'
            }
        ]
    };
    
    // Update modal content
    const modal = document.getElementById('metaModal');
    const title = modal.querySelector('#metaTitle');
    const statusIndicator = modal.querySelector('.meta-status-indicator');
    
    title.textContent = meta.title;
    
    // Set status color
    switch (meta.status) {
        case 'satisfatorio':
            statusIndicator.style.backgroundColor = '#03B51A';
            break;
        case 'alerta':
            statusIndicator.style.backgroundColor = '#FFB001';
            break;
        case 'critico':
            statusIndicator.style.backgroundColor = '#FF0028';
            break;
        case 'concluido':
            statusIndicator.style.backgroundColor = '#04A2F3';
            break;
        case 'naoMonitorado':
            statusIndicator.style.backgroundColor = '#CCCCCC';
            break;
    }
    
    // Populate overview tab
    const overviewTab = modal.querySelector('#overviewTab');
    overviewTab.innerHTML = `
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div class="bg-white rounded-lg p-5 border border-gray-200 shadow-sm">
                <div class="mb-4">
                    <div class="flex items-center mb-2">
                        <div class="w-8 h-8 rounded-full bg-[#F4F4EF] flex items-center justify-center mr-2">
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                <path d="M14 2H2V14H14V2Z" stroke="#04695E" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                <path d="M4 4H12M4 8H12M4 12H8" stroke="#04695E" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                        </div>
                        <label class="text-sm font-medium text-gray-500">Iniciativa</label>
                    </div>
                    <div class="text-[#04695E] font-medium pl-10">${meta.iniciativa}</div>
                </div>

                <div class="mb-4">
                    <div class="flex items-center mb-2">
                        <div class="w-8 h-8 rounded-full bg-[#F4F4EF] flex items-center justify-center mr-2">
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                <path d="M14 8L8 14L2 8M14 2L8 8L2 2" stroke="#04695E" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                        </div>
                        <label class="text-sm font-medium text-gray-500">Resultado</label>
                    </div>
                    <div class="text-[#505050] pl-10">${meta.resultado}</div>
                </div>
            </div>

            <div class="bg-white rounded-lg p-5 border border-gray-200 shadow-sm">
                <div class="mb-4">
                    <div class="flex items-center mb-2">
                        <div class="w-8 h-8 rounded-full bg-[#F4F4EF] flex items-center justify-center mr-2">
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                <path d="M13.3333 14V12.6667C13.3333 11.9594 13.0524 11.2811 12.5523 10.781C12.0522 10.281 11.3739 10 10.6667 10H5.33333C4.62609 10 3.94781 10.281 3.44772 10.781C2.94762 11.2811 2.66666 11.9594 2.66666 12.6667V14" stroke="#04695E" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                <path d="M8.00001 7.33333C9.47277 7.33333 10.6667 6.13943 10.6667 4.66667C10.6667 3.19391 9.47277 2 8.00001 2C6.52725 2 5.33334 3.19391 5.33334 4.66667C5.33334 6.13943 6.52725 7.33333 8.00001 7.33333Z" stroke="#04695E" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                        </div>
                        <label class="text-sm font-medium text-gray-500">Responsável</label>
                    </div>
                    <div class="text-[#505050] font-medium pl-10">${meta.responsible}</div>
                </div>

                <div>
                    <div class="flex items-center mb-2">
                        <div class="w-8 h-8 rounded-full bg-[#F4F4EF] flex items-center justify-center mr-2">
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                <path d="M14 8H8V14H14V8Z" stroke="#04695E" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                <path d="M8 2H2V8H8V2Z" stroke="#04695E" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                <path d="M14 2H8V8H14V2Z" stroke="#04695E" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                <path d="M8 8H2V14H8V8Z" stroke="#04695E" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                        </div>
                        <label class="text-sm font-medium text-gray-500">Alcance</label>
                    </div>
                    <div class="flex items-center pl-10">
                        <div class="relative inline-flex items-center justify-center">
                            <svg width="60" height="60" viewBox="0 0 60 60">
                                <circle cx="30" cy="30" r="24" fill="transparent" stroke="#E5E5E5" stroke-width="6" />
                                <circle cx="30" cy="30" r="24" fill="transparent" stroke="${meta.alcance === 0 ? '#E5E5E5' : meta.alcance === 100 ? '#03B51A' : '#909090'}" stroke-width="6" stroke-dasharray="${2 * Math.PI * 24}" stroke-dashoffset="${2 * Math.PI * 24 - (meta.alcance / 100) * (2 * Math.PI * 24)}" stroke-linecap="round" transform="rotate(-90 30 30)" />
                            </svg>
                            <span class="absolute text-lg font-medium text-[#505050]">${meta.alcance}%</span>
                        </div>
                        <span class="ml-3 text-[#505050]">de conclusão</span>
                    </div>
                </div>
            </div>
        </div>

        <div class="bg-white rounded-lg p-5 border border-gray-200 shadow-sm">
            <h3 class="text-lg font-medium text-[#04695E] mb-4">Status Atual</h3>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                    <div class="flex items-center mb-2">
                        <div class="w-8 h-8 rounded-full bg-[#F4F4EF] flex items-center justify-center mr-2">
                            <div class="w-6 h-6 rounded-full ${getStatusColorClass(meta.status)} flex items-center justify-center">
                                <div class="w-3 h-3 rounded-full bg-white"></div>
                            </div>
                        </div>
                        <label class="text-sm font-medium text-gray-500">Status</label>
                    </div>
                    <div class="text-[#505050] font-medium pl-10">${getStatusText(meta.status)}</div>
                </div>

                <div>
                    <div class="flex items-center mb-2">
                        <div class="w-8 h-8 rounded-full bg-[#F4F4EF] flex items-center justify-center mr-2">
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                <path d="M12.6667 2.66666H3.33333C2.59695 2.66666 2 3.26361 2 3.99999V13.3333C2 14.0697 2.59695 14.6667 3.33333 14.6667H12.6667C13.403 14.6667 14 14.0697 14 13.3333V3.99999C14 3.26361 13.403 2.66666 12.6667 2.66666Z" stroke="#04695E" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                <path d="M10.6667 1.33334V4.00001" stroke="#04695E" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                <path d="M5.33333 1.33334V4.00001" stroke="#04695E" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                <path d="M2 6.66666H14" stroke="#04695E" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                        </div>
                        <label class="text-sm font-medium text-gray-500">Data</label>
                    </div>
                    <div class="text-[#505050] pl-10">${meta.date}</div>
                </div>

                <div class="md:col-span-3">
                    <div class="flex items-center mb-2">
                        <div class="w-8 h-8 rounded-full bg-[#F4F4EF] flex items-center justify-center mr-2">
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                <path d="M14 7.66667C14 11.3486 8 14.3333 8 14.3333C8 14.3333 2 11.3486 2 7.66667C2 6.07537 2.63214 4.54925 3.75736 3.42403C4.88258 2.29881 6.4087 1.66667 8 1.66667C9.5913 1.66667 11.1174 2.29881 12.2426 3.42403C13.3679 4.54925 14 6.07537 14 7.66667Z" stroke="#04695E" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                <path d="M8 10C9.10457 10 10 9.10457 10 8C10 6.89543 9.10457 6 8 6C6.89543 6 6 6.89543 6 8C6 9.10457 6.89543 10 8 10Z" stroke="#04695E" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                        </div>
                        <label class="text-sm font-medium text-gray-500">Parecer</label>
                    </div>
                    <div class="p-4 bg-white rounded-md text-[#505050] border border-gray-200 min-h-[100px] pl-10">
                        ${meta.parecer}
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Populate history tab
    const historyTab = modal.querySelector('#historyTab');
    historyTab.innerHTML = `
        <div class="bg-white rounded-lg p-5 border border-gray-200 shadow-sm mb-6">
            <div class="flex justify-between items-center mb-4">
                <h3 class="text-lg font-medium text-[#04695E]">Histórico de Status</h3>

                <div class="flex items-center space-x-2">
                    <button id="prevHistoryButton" class="p-1 rounded-full text-[#04695E] hover:bg-gray-200">
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                            <path d="M12.5 15L7.5 10L12.5 5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                    </button>
                    <span class="text-sm text-gray-500" id="historyCounter">Atual</span>
                    <button id="nextHistoryButton" class="p-1 rounded-full text-[#04695E] hover:bg-gray-200">
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                            <path d="M7.5 15L12.5 10L7.5 5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                    </button>
                </div>
            </div>

            <div id="historyContent">
                <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                        <div class="flex items-center mb-2">
                            <div class="w-8 h-8 rounded-full bg-[#F4F4EF] flex items-center justify-center mr-2">
                                <div class="w-6 h-6 rounded-full ${getStatusColorClass(meta.status)} flex items-center justify-center">
                                    <div class="w-3 h-3 rounded-full bg-white"></div>
                                </div>
                            </div>
                            <label class="text-sm font-medium text-gray-500">Status</label>
                        </div>
                        <div class="text-[#505050] font-medium pl-10">${getStatusText(meta.status)}</div>
                    </div>

                    <div>
                        <div class="flex items-center mb-2">
                            <div class="w-8 h-8 rounded-full bg-[#F4F4EF] flex items-center justify-center mr-2">
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                <path d="M12.6667 2.66666H3.33333C2.59695 2.66666 2 3.26361 2 3.99999V13.3333C2 14.0697 2.59695 14.6667 3.33333 14.6667H12.6667C13.403 14.6667 14 14.0697 14 13.3333V3.99999C14 3.26361 13.403 2.66666 12.6667 2.66666Z" stroke="#04695E" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                <path d="M10.6667 1.33334V4.00001" stroke="#04695E" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                <path d="M5.33333 1.33334V4.00001" stroke="#04695E" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                <path d="M2 6.66666H14" stroke="#04695E" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                            </div>
                            <label class="text-sm font-medium text-gray-500">Data</label>
                        </div>
                        <div class="text-[#505050] pl-10">${meta.date}</div>
                    </div>

                    <div class="md:col-span-3">
                        <div class="flex items-center mb-2">
                            <div class="w-8 h-8 rounded-full bg-[#F4F4EF] flex items-center justify-center mr-2">
                                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                    <path d="M14 7.66667C14 11.3486 8 14.3333 8 14.3333C8 14.3333 2 11.3486 2 7.66667C2 6.07537 2.63214 4.54925 3.75736 3.42403C4.88258 2.29881 6.4087 1.66667 8 1.66667C9.5913 1.66667 11.1174 2.29881 12.2426 3.42403C13.3679 4.54925 14 6.07537 14 7.66667Z" stroke="#04695E" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                    <path d="M8 10C9.10457 10 10 9.10457 10 8C10 6.89543 9.10457 6 8 6C6.89543 6 6 6.89543 6 8C6 9.10457 6.89543 10 8 10Z" stroke="#04695E" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                </svg>
                            </div>
                            <label class="text-sm font-medium text-gray-500">Parecer</label>
                        </div>
                        <div class="p-4 bg-white rounded-md text-[#505050] border border-gray-200 min-h-[100px] pl-10">
                            ${meta.parecer}
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="mt-8">
            <h4 class="text-md font-medium text-gray-700 mb-4">Linha do Tempo</h4>
            <div class="relative">
                <div class="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200"></div>
                
                <div class="relative pl-10 pb-6 opacity-100">
                    <div class="absolute left-0 w-8 h-8 rounded-full ${getStatusColorClass(meta.status)} flex items-center justify-center z-10 border-2 border-white">
                        <div class="w-4 h-4 rounded-full bg-white"></div>
                    </div>
                    <div class="p-4 rounded-lg bg-gray-50 border border-gray-200">
                        <div class="flex justify-between items-center mb-2">
                            <span class="font-medium text-gray-700">Status Atual</span>
                            <span class="text-sm text-gray-500">${meta.date}</span>
                        </div>
                        <div class="flex items-center mb-2">
                            <span class="text-sm font-medium text-gray-600 mr-2">Status:</span>
                            <span class="text-sm">${getStatusText(meta.status)}</span>
                        </div>
                        <p class="text-sm text-gray-600 line-clamp-2">${meta.parecer}</p>
                    </div>
                </div>
                
                ${meta.statusHistory.map((history, index) => `
                    <div class="relative pl-10 pb-6 opacity-60">
                        <div class="absolute left-0 w-8 h-8 rounded-full ${getStatusColorClass(history.status)} flex items-center justify-center z-10 border-2 border-white">
                            <div class="w-4 h-4 rounded-full bg-white"></div>
                        </div>
                        <div class="p-4 rounded-lg">
                            <div class="flex justify-between items-center mb-2">
                                <span class="font-medium text-gray-700">Status Anterior ${index + 1}</span>
                                <span class="text-sm text-gray-500">${history.date}</span>
                            </div>
                            <div class="flex items-center mb-2">
                                <span class="text-sm font-medium text-gray-600 mr-2">Status:</span>
                                <span class="text-sm">${getStatusText(history.status)}</span>
                            </div>
                            <p class="text-sm text-gray-600 line-clamp-2">${history.parecer}</p>
                            <button class="mt-2 text-xs text-[#04695E] hover:underline history-detail-button" data-index="${index + 1}">
                                Ver detalhes
                            </button>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
    
    // Populate actions tab
    const actionsTab = modal.querySelector('#actionsTab');
    actionsTab.innerHTML = `
        <div class="bg-white rounded-lg p-5 border border-gray-200 shadow-sm mb-6">
            <h3 class="text-lg font-medium text-[#04695E] mb-4">Encaminhamentos</h3>
            <div class="overflow-hidden rounded-lg border border-gray-200">
                <table class="w-full text-sm">
                    <thead class="bg-gray-50">
                        <tr>
                            <th class="py-3 px-4 text-left font-medium text-[#505050]">Encaminhamento</th>
                            <th class="py-3 px-4 text-left font-medium text-[#505050] w-32">Prazo</th>
                            <th class="py-3 px-4 text-left font-medium text-[#505050] w-40">Responsável</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${meta.encaminhamentos.map((item, index) => `
                            <tr class="border-t border-gray-200 hover:bg-gray-50 transition-colors">
                                <td class="py-3 px-4 text-[#505050]">${item.description}</td>
                                <td class="py-3 px-4">
                                    <div class="flex items-center">
                                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" class="mr-1 text-gray-400">
                                            <path d="M7 3.5V7L9.33333 8.16667" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                            <path d="M7.00001 12.8333C10.2217 12.8333 12.8333 10.2217 12.8333 6.99999C12.8333 3.77833 10.2217 1.16666 7.00001 1.16666C3.77834 1.16666 1.16667 3.77833 1.16667 6.99999C1.16667 10.2217 3.77834 12.8333 7.00001 12.8333Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                        </svg>
                                        <span class="text-[#505050]">${item.prazo}</span>
                                    </div>
                                </td>
                                <td class="py-3 px-4">
                                    <div class="flex items-center">
                                        <div class="w-6 h-6 rounded-full bg-[#04695E]/10 flex items-center justify-center mr-2 text-[#04695E] text-xs font-medium">
                                            ${item.responsavel.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
                                        </div>
                                        <span class="text-[#505050]">${item.responsavel}</span>
                                    </div>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        </div>
    `;
    
    // Initialize tabs
    const tabButtons = modal.querySelectorAll('.tab-button');
    const tabContents = modal.querySelectorAll('.tab-content');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const tab = this.getAttribute('data-tab');
            
            // Update active button
            tabButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Update active content
            tabContents.forEach(content => content.classList.remove('active'));
            modal.querySelector(`#${tab}Tab`).classList.add('active');
        });
    });
    
    // Initialize history navigation
    const prevHistoryButton = modal.querySelector('#prevHistoryButton');
    const nextHistoryButton = modal.querySelector('#nextHistoryButton');
    const historyCounter = modal.querySelector('#historyCounter');
    const historyContent = modal.querySelector('#historyContent');
    
    let currentHistoryIndex = 0;
    const allHistory = [
        {
            date: meta.date,
            status: meta.status,
            parecer: meta.parecer
        },
        ...meta.statusHistory
    ];
    
    prevHistoryButton.addEventListener('click', function() {
        if (currentHistoryIndex < allHistory.length - 1) {
            currentHistoryIndex++;
            updateHistoryView();
        }
    });
    
    nextHistoryButton.addEventListener('click', function() {
        if (currentHistoryIndex > 0) {
            currentHistoryIndex--;
            updateHistoryView();
        }
    });
    
    function updateHistoryView() {
        const history = allHistory[currentHistoryIndex];
        
        // Update counter
        if (currentHistoryIndex === 0) {
            historyCounter.textContent = 'Atual';
        } else {
            historyCounter.textContent = `Histórico ${currentHistoryIndex}/${allHistory.length - 1}`;
        }
        
        // Update content
        historyContent.innerHTML = `
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                    <div class="flex items-center mb-2">
                        <div class="w-8 h-8 rounded-full bg-[#F4F4EF] flex items-center justify-center mr-2">
                            <div class="w-6 h-6 rounded-full ${getStatusColorClass(history.status)} flex items-center justify-center">
                                <div class="w-3 h-3 rounded-full bg-white"></div>
                            </div>
                        </div>
                        <label class="text-sm font-medium text-gray-500">Status</label>
                    </div>
                    <div class="text-[#505050] font-medium pl-10">${getStatusText(history.status)}</div>
                </div>

                <div>
                    <div class="flex items-center mb-2">
                        <div class="w-8 h-8 rounded-full bg-[#F4F4EF] flex items-center justify-center mr-2">
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                <path d="M12.6667 2.66666H3.33333C2.59695 2.66666 2 3.26361 2 3.99999V13.3333C2 14.0697 2.59695 14.6667 3.33333 14.6667H12.6667C13.403 14.6667 14 14.0697 14 13.3333V3.99999C14 3.26361 13.403 2.66666 12.6667 2.66666Z" stroke="#04695E" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                <path d="M10.6667 1.33334V4.00001" stroke="#04695E" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                <path d="M5.33333 1.33334V4.00001" stroke="#04695E" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                <path d="M2 6.66666H14" stroke="#04695E" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                        </div>
                        <label class="text-sm font-medium text-gray-500">Data</label>
                    </div>
                    <div class="text-[#505050] pl-10">${history.date}</div>
                </div>

                <div class="md:col-span-3">
                    <div class="flex items-center mb-2">
                        <div class="w-8 h-8 rounded-full bg-[#F4F4EF] flex items-center justify-center mr-2">
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                <path d="M14 7.66667C14 11.3486 8 14.3333 8 14.3333C8 14.3333 2 11.3486 2 7.66667C2 6.07537 2.63214 4.54925 3.75736 3.42403C4.88258 2.29881 6.4087 1.66667 8 1.66667C9.5913 1.66667 11.1174 2.29881 12.2426 3.42403C13.3679 4.54925 14 6.07537 14 7.66667Z" stroke="#04695E" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                <path d="M8 10C9.10457 10 10 9.10457 10 8C10 6.89543 9.10457 6 8 6C6.89543 6 6 6.89543 6 8C6 9.10457 6.89543 10 8 10Z" stroke="#04695E" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                        </div>
                        <label class="text-sm font-medium text-gray-500">Parecer</label>
                    </div>
                    <div class="p-4 bg-white rounded-md text-[#505050] border border-gray-200 min-h-[100px] pl-10">
                        ${history.parecer}
                    </div>
                </div>
            </div>
        `;
        
        // Update buttons state
        prevHistoryButton.disabled = currentHistoryIndex >= allHistory.length - 1;
        prevHistoryButton.style.color = prevHistoryButton.disabled ? '#ccc' : '';
        
        nextHistoryButton.disabled = currentHistoryIndex <= 0;
        nextHistoryButton.style.color = nextHistoryButton.disabled ? '#ccc' : '';
    }
    
    // Initialize history detail buttons
    const historyDetailButtons = modal.querySelectorAll('.history-detail-button');
    
    historyDetailButtons.forEach(button => {
        button.addEventListener('click', function() {
            const index = parseInt(this.getAttribute('data-index'));
            currentHistoryIndex = index;
            
            // Switch to history tab
            tabButtons.forEach(btn => btn.classList.remove('active'));
            modal.querySelector('[data-tab="history"]').classList.add('active');
            
            tabContents.forEach(content => content.classList.remove('active'));
            modal.querySelector('#historyTab').classList.add('active');
            
            updateHistoryView();
        });
    });
    
    // Show modal
    toggleModal('metaModal', true);
    
    // Initialize close button
    const closeButton = modal.querySelector('.close-button');
    closeButton.addEventListener('click', function() {
        toggleModal('metaModal', false);
    });
    
    // Initialize cancel button
    const cancelButton = modal.querySelector('.cancel-button');
    cancelButton.addEventListener('click', function() {
        toggleModal('metaModal', false);
    });
}

// Open meta edit modal
function openMetaEditModal(metaId) {
    // In a real application, you would implement this function
    alert('Função de edição não implementada nesta versão.');
}

// Helper functions
function getStatusColorClass(status) {
    switch (status) {
        case 'satisfatorio':
            return 'bg-[#03B51A]';
        case 'alerta':
            return 'bg-[#FFB001]';
        case 'critico':
            return 'bg-[#FF0028]';
        case 'concluido':
            return 'bg-[#04A2F3]';
        case 'naoMonitorado':
            return 'bg-[#CCCCCC]';
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
    }
}

// Corrected the syntax error by removing the extra semicolon
function someFunction() {
    console.log("Function executed"); // Example fix
}