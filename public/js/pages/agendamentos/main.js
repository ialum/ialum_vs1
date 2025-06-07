/**
 * agendamentos/main.js
 * Controlador principal da página de Agendamentos
 * Dependências: api.js, ui.js, formatters.js, notifications.js
 * Localização: public/js/pages/agendamentos/main.js
 * Tamanho alvo: <200 linhas
 */

import { API } from '../../core/api.js';
import { behaviors } from '../../components/ui/behaviors.js';
import { format } from '../../components/forms/formatters.js';
import { showToast } from '../../components/layout/notifications.js';

// Estado da página
let currentView = 'calendar';
let currentDate = new Date();
let selectedDate = null;
let scheduledPosts = [];

// Função principal de inicialização
export async function init() {
    console.log('Inicializando Agendamentos...');
    
    // Setup inicial
    setupCalendar();
    
    // Bind dos eventos
    bindEvents();
    
    // Carregar posts agendados
    await loadScheduledPosts();
}

// Configurar calendário
function setupCalendar() {
    updateMonthDisplay();
    renderCalendar();
}

// Bind dos eventos
function bindEvents() {
    // Navegação do mês
    const prevMonth = document.getElementById('prev-month');
    const nextMonth = document.getElementById('next-month');
    
    if (prevMonth) prevMonth.addEventListener('click', () => changeMonth(-1));
    if (nextMonth) nextMonth.addEventListener('click', () => changeMonth(1));
    
    // Toggle de visualização
    document.querySelectorAll('.view-btn').forEach(btn => {
        btn.addEventListener('click', () => toggleView(btn.dataset.view));
    });
    
    // Botão agendar
    const btnAgendar = document.querySelector('.btn-primary');
    if (btnAgendar) {
        btnAgendar.addEventListener('click', handleNewSchedule);
    }
    
    // Fechar sidebar
    const closeSidebar = document.getElementById('close-sidebar');
    if (closeSidebar) {
        closeSidebar.addEventListener('click', () => hideSidebar());
    }
}

// Carregar posts agendados
async function loadScheduledPosts() {
    try {
        // Simular delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Dados mockados
        scheduledPosts = [
            {
                id: 1,
                title: 'Direitos do Consumidor Online',
                platform: 'instagram',
                platform_name: 'Instagram',
                scheduled_date: '2025-01-28',
                scheduled_time: '19:00',
                status: 'scheduled'
            },
            {
                id: 2,
                title: 'Guarda Compartilhada',
                platform: 'linkedin',
                platform_name: 'LinkedIn',
                scheduled_date: '2025-01-30',
                scheduled_time: '10:00',
                status: 'scheduled'
            },
            {
                id: 3,
                title: 'Direitos Trabalhistas',
                platform: 'facebook',
                platform_name: 'Facebook',
                scheduled_date: '2025-02-01',
                scheduled_time: '14:00',
                status: 'scheduled'
            }
        ];
        
        // Renderizar baseado na view atual
        if (currentView === 'calendar') {
            renderCalendar();
        } else {
            renderListView();
        }
        
    } catch (error) {
        console.error('Erro ao carregar agendamentos:', error);
        showToast('Erro ao carregar agendamentos', 'error');
    }
}

// Renderizar calendário
function renderCalendar() {
    const grid = document.getElementById('calendar-grid');
    if (!grid) return;
    
    grid.innerHTML = '';
    
    // Primeiro dia do mês
    const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const lastDay = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    
    // Dias do mês anterior
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    
    // Gerar 42 dias (6 semanas)
    for (let i = 0; i < 42; i++) {
        const date = new Date(startDate);
        date.setDate(startDate.getDate() + i);
        
        const dayEl = createDayElement(date, firstDay, lastDay);
        grid.appendChild(dayEl);
    }
}

// Criar elemento de dia
function createDayElement(date, firstDay, lastDay) {
    const dayEl = document.createElement('div');
    dayEl.className = 'calendar-day';
    dayEl.dataset.date = format.date(date, 'YYYY-MM-DD');
    
    // Classes especiais
    if (date < firstDay || date > lastDay) {
        dayEl.classList.add('other-month');
    }
    
    if (isToday(date)) {
        dayEl.classList.add('today');
    }
    
    // Número do dia
    const dayNumber = document.createElement('div');
    dayNumber.className = 'day-number';
    dayNumber.textContent = date.getDate();
    dayEl.appendChild(dayNumber);
    
    // Posts do dia
    const dayPosts = getPostsForDate(date);
    if (dayPosts.length > 0) {
        dayEl.classList.add('has-posts');
        
        const preview = document.createElement('div');
        preview.className = 'day-posts-preview';
        
        dayPosts.slice(0, 3).forEach(post => {
            const dot = document.createElement('div');
            dot.className = 'post-dot';
            dot.style.background = getPlatformColor(post.platform);
            preview.appendChild(dot);
        });
        
        dayEl.appendChild(preview);
        
        if (dayPosts.length > 3) {
            const count = document.createElement('span');
            count.className = 'post-count';
            count.textContent = `+${dayPosts.length - 3}`;
            dayEl.appendChild(count);
        }
    }
    
    // Evento de clique
    dayEl.addEventListener('click', () => selectDate(date));
    
    return dayEl;
}

// Renderizar view de lista
function renderListView() {
    const listView = document.getElementById('list-view');
    const listContainer = listView.querySelector('.scheduled-posts-list');
    
    if (!listContainer) return;
    
    listContainer.innerHTML = '';
    
    // Agrupar por data
    const grouped = groupPostsByDate(scheduledPosts);
    
    Object.keys(grouped).forEach(date => {
        // Header da data
        const dateHeader = document.createElement('h3');
        dateHeader.className = 'date-header';
        dateHeader.textContent = formatDateHeader(date);
        listContainer.appendChild(dateHeader);
        
        // Posts do dia
        grouped[date].forEach(post => {
            const postEl = createPostElement(post);
            listContainer.appendChild(postEl);
        });
    });
}

// Criar elemento de post
function createPostElement(post) {
    const template = document.getElementById('scheduled-post-template');
    if (!template) return document.createElement('div');
    
    const el = template.content.cloneNode(true);
    
    el.querySelector('.scheduled-post').dataset.id = post.id;
    el.querySelector('.post-time').textContent = post.scheduled_time;
    el.querySelector('.platform-icon').textContent = getPlatformIcon(post.platform);
    el.querySelector('.platform-name').textContent = post.platform_name;
    el.querySelector('.post-title').textContent = post.title;
    
    // Bind ações
    const editBtn = el.querySelector('[title="Editar"]');
    const removeBtn = el.querySelector('[title="Remover"]');
    
    if (editBtn) editBtn.addEventListener('click', () => editPost(post.id));
    if (removeBtn) removeBtn.addEventListener('click', () => removePost(post.id));
    
    return el;
}

// Navegar meses
function changeMonth(direction) {
    currentDate.setMonth(currentDate.getMonth() + direction);
    updateMonthDisplay();
    renderCalendar();
}

// Atualizar display do mês
function updateMonthDisplay() {
    const monthEl = document.getElementById('current-month');
    if (monthEl) {
        const options = { month: 'long', year: 'numeric' };
        monthEl.textContent = currentDate.toLocaleDateString('pt-BR', options);
    }
}

// Toggle de visualização
function toggleView(view) {
    currentView = view;
    
    // Atualizar botões
    document.querySelectorAll('.view-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.view === view);
    });
    
    // Mostrar/esconder views
    const calendarView = document.getElementById('calendar-view');
    const listView = document.getElementById('list-view');
    
    if (calendarView) calendarView.style.display = view === 'calendar' ? 'block' : 'none';
    if (listView) listView.style.display = view === 'list' ? 'block' : 'none';
    
    // Renderizar conteúdo
    if (view === 'calendar') {
        renderCalendar();
    } else {
        renderListView();
    }
}

// Selecionar data
function selectDate(date) {
    selectedDate = date;
    
    // Atualizar visual
    document.querySelectorAll('.calendar-day').forEach(day => {
        day.classList.remove('selected');
    });
    
    const selectedEl = document.querySelector(`[data-date="${format.date(date, 'YYYY-MM-DD')}"]`);
    if (selectedEl) selectedEl.classList.add('selected');
    
    // Mostrar sidebar
    showSidebar(date);
}

// Mostrar sidebar
function showSidebar(date) {
    const sidebar = document.getElementById('schedule-sidebar');
    if (!sidebar) return;
    
    // Atualizar título
    const dateEl = document.getElementById('selected-date');
    if (dateEl) {
        dateEl.textContent = format.date(date, 'DD/MM');
    }
    
    // Carregar posts do dia
    const dayPosts = getPostsForDate(date);
    const container = document.getElementById('day-posts');
    
    if (container) {
        container.innerHTML = '';
        
        if (dayPosts.length === 0) {
            container.innerHTML = '<p class="empty-message">Nenhum post agendado</p>';
        } else {
            dayPosts.forEach(post => {
                const postEl = createPostElement(post);
                container.appendChild(postEl);
            });
        }
    }
    
    // Mostrar sidebar
    sidebar.style.display = 'block';
    setTimeout(() => sidebar.classList.add('active'), 10);
}

// Esconder sidebar
function hideSidebar() {
    const sidebar = document.getElementById('schedule-sidebar');
    if (sidebar) {
        sidebar.classList.remove('active');
        setTimeout(() => sidebar.style.display = 'none', 300);
    }
}

// Helpers
function isToday(date) {
    const today = new Date();
    return date.toDateString() === today.toDateString();
}

function getPostsForDate(date) {
    const dateStr = format.date(date, 'YYYY-MM-DD');
    return scheduledPosts.filter(post => post.scheduled_date === dateStr);
}

function groupPostsByDate(posts) {
    return posts.reduce((groups, post) => {
        const date = post.scheduled_date;
        if (!groups[date]) groups[date] = [];
        groups[date].push(post);
        return groups;
    }, {});
}

function formatDateHeader(dateStr) {
    const date = new Date(dateStr);
    const options = { weekday: 'long', day: 'numeric', month: 'long' };
    return date.toLocaleDateString('pt-BR', options);
}

function getPlatformColor(platform) {
    const colors = {
        instagram: 'var(--primary)',
        linkedin: '#0077b5',
        facebook: '#1877f2',
        tiktok: '#000000'
    };
    return colors[platform] || 'var(--gray-400)';
}

function getPlatformIcon(platform) {
    const icons = {
        instagram: '📷',
        linkedin: '💼',
        facebook: '📘',
        tiktok: '🎵'
    };
    return icons[platform] || '📱';
}

// Ações
function handleNewSchedule() {
    showToast('Abrindo formulário de agendamento...', 'info');
    // TODO: Abrir modal ou navegar para criação
}

function editPost(id) {
    console.log('Editar post:', id);
    showToast(`Editando post ${id}...`, 'info');
    // TODO: Abrir editor
}

function removePost(id) {
    if (confirm('Deseja remover este agendamento?')) {
        console.log('Remover post:', id);
        showToast('Agendamento removido', 'success');
        // TODO: Chamar API e recarregar
    }
    }