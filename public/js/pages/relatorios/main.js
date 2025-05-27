/**
 * relatorios/main.js
 * Controlador principal da página de Relatórios
 * Dependências: api.js, utils.js, notifications.js
 * Localização: public/js/pages/relatorios/main.js
 * Tamanho alvo: <200 linhas
 */

import { API } from '../../core/api.js';
import { Utils } from '../../core/utils.js';
import { showToast } from '../../components/notifications.js';

// Estado da página
let currentPeriod = 'month';
let chartInstances = {};

// Função principal de inicialização
export async function init() {
    console.log('Inicializando Relatórios...');
    
    // Bind dos eventos
    bindEvents();
    
    // Carregar dados
    await loadReportData();
}

// Bind dos eventos
function bindEvents() {
    // Seletor de período
    document.querySelectorAll('.period-btn').forEach(btn => {
        btn.addEventListener('click', () => selectPeriod(btn));
    });
    
    // Botões de exportação
    document.querySelector('.btn-ghost:has(span:contains("PDF"))')
        ?.addEventListener('click', exportPDF);
    
    document.querySelector('.btn-ghost:has(span:contains("Excel"))')
        ?.addEventListener('click', exportExcel);
    
    // Seletor de métrica
    const metricSelect = document.querySelector('.chart-metric');
    if (metricSelect) {
        metricSelect.addEventListener('change', updatePlatformChart);
    }
}

// Carregar dados do relatório
async function loadReportData() {
    try {
        // Simular carregamento
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Dados mockados
        const data = {
            kpis: {
                totalPosts: { value: 42, change: 15.3 },
                totalEngagement: { value: 3847, change: 23.5 },
                growthRate: { value: 18.7, change: 5.2 },
                creditsUsed: { value: 87, total: 150 }
            },
            platformData: {
                instagram: { posts: 25, engagement: 2150, reach: 15420 },
                linkedin: { posts: 10, engagement: 890, reach: 8930 },
                facebook: { posts: 7, engagement: 807, reach: 5200 }
            },
            themeData: {
                consumidor: 45,
                familia: 28,
                trabalhista: 15,
                empresarial: 12
            },
            topPosts: [
                {
                    title: 'Direitos do Consumidor Online',
                    platform: 'Instagram',
                    date: '2025-01-15',
                    engagement: 450,
                    reach: 3200,
                    rate: '14.1%'
                },
                {
                    title: 'Guarda Compartilhada: Guia Completo',
                    platform: 'LinkedIn',
                    date: '2025-01-18',
                    engagement: 280,
                    reach: 2100,
                    rate: '13.3%'
                }
            ]
        };
        
        // Atualizar UI
        updateKPIs(data.kpis);
        createCharts(data);
        renderTopPosts(data.topPosts);
        
    } catch (error) {
        console.error('Erro ao carregar dados:', error);
        showToast('Erro ao carregar relatórios', 'error');
    }
}

// Atualizar KPIs
function updateKPIs(kpis) {
    // Total de posts
    const totalPosts = document.getElementById('total-posts');
    if (totalPosts) {
        totalPosts.textContent = kpis.totalPosts.value;
        const change = totalPosts.nextElementSibling;
        if (change) {
            change.textContent = `+${kpis.totalPosts.change}%`;
            change.className = 'change positive';
        }
    }
    
    // Engajamento
    const totalEngagement = document.getElementById('total-engagement');
    if (totalEngagement) {
        totalEngagement.textContent = kpis.totalEngagement.value.toLocaleString();
        const change = totalEngagement.nextElementSibling;
        if (change) {
            change.textContent = `+${kpis.totalEngagement.change}%`;
            change.className = 'change positive';
        }
    }
    
    // Taxa de crescimento
    const growthRate = document.getElementById('growth-rate');
    if (growthRate) {
        growthRate.textContent = `${kpis.growthRate.value}%`;
        const change = growthRate.nextElementSibling;
        if (change) {
            change.textContent = `+${kpis.growthRate.change}%`;
            change.className = 'change positive';
        }
    }
    
    // Créditos
    const creditsUsed = document.getElementById('credits-used');
    const creditsTotal = document.getElementById('credits-total');
    const creditsProgress = document.getElementById('credits-progress');
    
    if (creditsUsed) creditsUsed.textContent = kpis.creditsUsed.value;
    if (creditsTotal) creditsTotal.textContent = kpis.creditsUsed.total;
    if (creditsProgress) {
        const percentage = (kpis.creditsUsed.value / kpis.creditsUsed.total) * 100;
        creditsProgress.style.width = `${percentage}%`;
    }
}

// Criar gráficos
function createCharts(data) {
    // Simular criação de gráficos
    // Em produção, usar Chart.js ou similar
    
    // Sparklines dos KPIs
    createSparkline('posts-sparkline');
    createSparkline('engagement-sparkline');
    createSparkline('growth-sparkline');
    
    // Gráfico de plataformas
    createPlatformChart(data.platformData);
    
    // Gráfico de temas
    createThemeChart(data.themeData);
}

// Criar sparkline simples (simulado)
function createSparkline(canvasId) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    canvas.width = canvas.offsetWidth;
    canvas.height = 40;
    
    // Desenhar linha simples
    ctx.strokeStyle = '#2563eb';
    ctx.lineWidth = 2;
    ctx.beginPath();
    
    // Pontos aleatórios para simulação
    const points = Array.from({length: 10}, () => Math.random() * 30 + 5);
    points.forEach((y, x) => {
        const xPos = (x / 9) * canvas.width;
        if (x === 0) ctx.moveTo(xPos, y);
        else ctx.lineTo(xPos, y);
    });
    
    ctx.stroke();
}

// Criar gráfico de plataformas (simulado)
function createPlatformChart(data) {
    const canvas = document.getElementById('platform-chart');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    canvas.width = canvas.offsetWidth;
    canvas.height = 300;
    
    // Limpar
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Simular barras
    const platforms = Object.keys(data);
    const barWidth = (canvas.width - 100) / platforms.length;
    
    platforms.forEach((platform, index) => {
        const value = data[platform].posts;
        const height = (value / 30) * 250; // Normalizar
        const x = 50 + index * barWidth;
        const y = canvas.height - height - 30;
        
        // Barra
        ctx.fillStyle = getBarColor(platform);
        ctx.fillRect(x, y, barWidth * 0.6, height);
        
        // Label
        ctx.fillStyle = '#333';
        ctx.font = '12px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(platform, x + barWidth * 0.3, canvas.height - 10);
        ctx.fillText(value, x + barWidth * 0.3, y - 5);
    });
}

// Criar gráfico de temas (simulado)
function createThemeChart(data) {
    const canvas = document.getElementById('themes-chart');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    canvas.width = canvas.offsetWidth;
    canvas.height = 300;
    
    // Simular gráfico de pizza
    const total = Object.values(data).reduce((a, b) => a + b, 0);
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = 100;
    
    let currentAngle = -Math.PI / 2;
    
    Object.entries(data).forEach(([theme, value], index) => {
        const sliceAngle = (value / total) * 2 * Math.PI;
        
        // Desenhar fatia
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.arc(centerX, centerY, radius, currentAngle, currentAngle + sliceAngle);
        ctx.closePath();
        
        ctx.fillStyle = getSliceColor(index);
        ctx.fill();
        
        currentAngle += sliceAngle;
    });
}

// Renderizar top posts
function renderTopPosts(posts) {
    const tbody = document.getElementById('top-posts-tbody');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    posts.forEach(post => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${post.title}</td>
            <td>${post.platform}</td>
            <td>${Utils.formatDate(post.date, 'DD/MM')}</td>
            <td>${post.engagement}</td>
            <td>${post.reach.toLocaleString()}</td>
            <td><strong>${post.rate}</strong></td>
        `;
        tbody.appendChild(tr);
    });
}

// Selecionar período
function selectPeriod(btn) {
    // Remover active de todos
    document.querySelectorAll('.period-btn').forEach(b => 
        b.classList.remove('active'));
    
    // Adicionar active
    btn.classList.add('active');
    
    // Atualizar período
    currentPeriod = btn.dataset.period;
    
    // Recarregar dados
    showToast(`Carregando dados: ${btn.textContent}`, 'info');
    loadReportData();
}

// Exportar PDF
function exportPDF() {
    showToast('Gerando PDF...', 'info');
    // TODO: Implementar exportação real
    setTimeout(() => {
        showToast('PDF gerado com sucesso!', 'success');
    }, 2000);
}

// Exportar Excel
function exportExcel() {
    showToast('Gerando Excel...', 'info');
    // TODO: Implementar exportação real
    setTimeout(() => {
        showToast('Excel gerado com sucesso!', 'success');
    }, 2000);
}

// Atualizar gráfico de plataforma
function updatePlatformChart() {
    const metric = document.querySelector('.chart-metric')?.value;
    console.log('Mudando métrica para:', metric);
    // TODO: Recriar gráfico com nova métrica
}

// Helpers
function getBarColor(platform) {
    const colors = {
        instagram: '#E4405F',
        linkedin: '#0077B5',
        facebook: '#1877F2'
    };
    return colors[platform] || '#666';
}

function getSliceColor(index) {
    const colors = ['#2563eb', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];
    return colors[index % colors.length];
}