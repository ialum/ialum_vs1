/**
 * dashboard/main.js
 * Controlador principal do Dashboard
 * Dependências: api.js, ui.js, formatters.js, notifications.js, router.js
 * Localização: public/js/pages/dashboard/main.js
 * Tamanho alvo: <150 linhas
 */

// Importar dependências
import { Router } from '../../core/router.js';
import { API } from '../../core/api.js';
import { behaviors } from '../../components/ui/behaviors.js';
import { format } from '../../components/forms/formatters.js';
import { showToast } from '../../components/layout/notifications.js';

// Função principal de inicialização
export async function init(params = {}) {
    console.log('Inicializando Dashboard...');
    
    // Setup inicial
    setupPage();
    
    // Carregar dados
    await loadDashboardData();
    
    // Bind eventos
    bindEvents();
    
    // Animar números
    animateNumbers();
}

// Configuração inicial da página
function setupPage() {
    const container = document.querySelector('.dashboard-container');
    if (container) {
        container.classList.add('loaded');
    }
}

// Carregar dados do dashboard
async function loadDashboardData() {
    try {
        // Por enquanto, usar dados mockados
        // TODO: Substituir por chamada real à API
        const mockData = {
            credits: {
                balance: 150,
                used: 50,
                total: 200
            },
            posts: {
                count: 24,
                change: '+20%',
                changeType: 'positive'
            },
            engagement: {
                rate: '4.8%',
                change: '+0.5%',
                changeType: 'positive'
            },
            scheduled: {
                count: 8
            },
            recentPosts: [
                {
                    id: 1,
                    title: 'Direitos do Consumidor em Compras Online',
                    platform: 'Instagram Carrossel',
                    status: 'published',
                    publishedAt: 'há 2 dias',
                    stats: { likes: 145, comments: 23 }
                },
                {
                    id: 2,
                    title: 'Nova Lei de Proteção de Dados',
                    platform: 'LinkedIn',
                    status: 'scheduled',
                    scheduledFor: 'amanhã'
                },
                {
                    id: 3,
                    title: '5 Dicas sobre Contratos Digitais',
                    platform: 'Instagram Reels',
                    status: 'draft'
                }
            ]
        };
        
        // Simular delay de rede
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Atualizar UI com os dados
        updateDashboardUI(mockData);
        
        // Quando API estiver pronta:
        // const response = await API.data.getDashboardStats();
        // updateDashboardUI(response.data);
        
    } catch (error) {
        console.error('Erro ao carregar dados do dashboard:', error);
        showToast('Erro ao carregar dados', 'error');
    }
}

// Atualizar UI com os dados
function updateDashboardUI(data) {
    // Créditos
    const creditBalance = document.getElementById('credit-balance');
    const creditUsageBar = document.getElementById('credit-usage-bar');
    const creditUsageText = document.getElementById('credit-usage-text');
    
    if (creditBalance) creditBalance.textContent = data.credits.balance;
    if (creditUsageBar) {
        const percentage = (data.credits.used / data.credits.total) * 100;
        creditUsageBar.style.width = `${percentage}%`;
    }
    if (creditUsageText) {
        creditUsageText.textContent = `${data.credits.used} de ${data.credits.total} usados este mês`;
    }
    
    // Posts
    const postsCount = document.getElementById('posts-count');
    const postsChange = document.getElementById('posts-change');
    
    if (postsCount) postsCount.textContent = data.posts.count;
    if (postsChange) {
        postsChange.textContent = data.posts.change;
        postsChange.className = `stat-change ${data.posts.changeType}`;
    }
    
    // Engajamento
    const engagementRate = document.getElementById('engagement-rate');
    const engagementChange = document.getElementById('engagement-change');
    
    if (engagementRate) engagementRate.textContent = data.engagement.rate;
    if (engagementChange) {
        engagementChange.textContent = data.engagement.change;
        engagementChange.className = `stat-change ${data.engagement.changeType}`;
    }
    
    // Agendados
    const scheduledCount = document.getElementById('scheduled-count');
    if (scheduledCount) scheduledCount.textContent = data.scheduled.count;
    
    // Posts recentes
    renderRecentPosts(data.recentPosts);
}

// Renderizar posts recentes
function renderRecentPosts(posts) {
    const container = document.getElementById('recent-posts-list');
    if (!container) return;
    
    container.innerHTML = '';
    
    posts.forEach(post => {
        const postElement = createPostElement(post);
        container.appendChild(postElement);
    });
}

// Criar elemento de post
function createPostElement(post) {
    const div = document.createElement('div');
    div.className = 'post-item';
    div.dataset.postId = post.id;
    
    const platformIcon = {
        'Instagram Carrossel': '📷',
        'Instagram Reels': '🎥',
        'LinkedIn': '📝'
    };
    
    const statusBadge = post.status === 'scheduled' ? 
        `<div class="post-status"><span class="status-badge scheduled">Agendado</span></div>` :
        post.status === 'draft' ?
        `<div class="post-status"><span class="status-badge draft">Rascunho</span></div>` :
        `<div class="post-stats"><span>❤️ ${post.stats.likes}</span><span>💬 ${post.stats.comments}</span></div>`;
    
    const timeInfo = post.publishedAt || `Agendado para ${post.scheduledFor}` || 'Em rascunho';
    
    div.innerHTML = `
        <div class="post-thumb">
            <span class="post-type">${platformIcon[post.platform] || '📄'}</span>
        </div>
        <div class="post-info">
            <h4>${post.title}</h4>
            <p>${post.platform} • ${timeInfo}</p>
        </div>
        ${statusBadge}
    `;
    
    return div;
}

// Bind dos eventos
function bindEvents() {
    // Ações rápidas
    const actionCards = document.querySelectorAll('.action-card');
    actionCards.forEach(card => {
        card.addEventListener('click', handleQuickAction);
    });
    
    // Clique nos posts recentes (delegação de eventos)
    const container = document.getElementById('recent-posts-list');
    if (container) {
        container.addEventListener('click', (e) => {
            const postItem = e.target.closest('.post-item');
            if (postItem) {
                const postId = postItem.dataset.postId;
                console.log('Abrir post:', postId);
                // TODO: Navegar para o post específico
                showToast('Abrindo post...', 'info');
            }
        });
    }
}

// Handler das ações rápidas
function handleQuickAction(e) {
    const action = e.currentTarget.dataset.action;
    
    switch(action) {
        case 'new-idea':
            Router.navigate('topicos', { action: 'new' });
            break;
            
        case 'upload-image':
            Router.navigate('banco-imagens', { action: 'upload' });
            break;
            
        case 'view-calendar':
            Router.navigate('agendamentos');
            break;
            
        case 'monthly-report':
            Router.navigate('relatorios');
            break;
            
        default:
            console.log('Ação não implementada:', action);
            showToast(`Ação '${action}' em desenvolvimento`, 'info');
    }
}

// Animar números
function animateNumbers() {
    const numbers = document.querySelectorAll('.stat-number, .credit-number');
    
    numbers.forEach(element => {
        const finalValue = parseInt(element.textContent);
        if (isNaN(finalValue)) return;
        
        const duration = 1000;
        const steps = 30;
        const stepDuration = duration / steps;
        const increment = finalValue / steps;
        
        let currentValue = 0;
        element.textContent = '0';
        
        const timer = setInterval(() => {
            currentValue += increment;
            
            if (currentValue >= finalValue) {
                currentValue = finalValue;
                clearInterval(timer);
            }
            
            element.textContent = Math.floor(currentValue);
        }, stepDuration);
    });
}