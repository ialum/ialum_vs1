/**
 * dashboard.js
 * Lógica específica do dashboard
 * Dependências: app.js
 * Usado em: dashboard
 * Tamanho alvo: <150 linhas
 */

// Módulo do Dashboard
window.IalumModules = window.IalumModules || {};
window.IalumModules.Dashboard = {
    
    // Inicializar
    init() {
        this.bindActions();
        this.animateNumbers();
        this.loadRecentPosts();
    },
    
    // Bind das ações rápidas
    bindActions() {
        const actionCards = document.querySelectorAll('.action-card');
        
        actionCards.forEach(card => {
            card.addEventListener('click', () => {
                const action = card.querySelector('.action-text').textContent;
                console.log(`Ação clicada: ${action}`);
                
                // Simular ações
                switch(action) {
                    case 'Nova Ideia':
                        alert('Abrindo formulário de nova ideia...');
                        break;
                    case 'Upload de Imagem':
                        alert('Abrindo upload de imagens...');
                        break;
                    case 'Ver Agenda':
                        window.IalumApp.loadPage('agendamentos');
                        break;
                    case 'Relatório Mensal':
                        window.IalumApp.loadPage('relatorios');
                        break;
                }
            });
        });
    },
    
    // Animar números
    animateNumbers() {
        const numbers = document.querySelectorAll('.stat-number, .credit-number');
        
        numbers.forEach(num => {
            const final = parseInt(num.textContent);
            const duration = 1000;
            const start = 0;
            const increment = final / (duration / 16);
            let current = start;
            
            const timer = setInterval(() => {
                current += increment;
                if (current >= final) {
                    current = final;
                    clearInterval(timer);
                }
                num.textContent = Math.floor(current);
            }, 16);
        });
    },
    
    // Carregar posts recentes (simulado)
    loadRecentPosts() {
        console.log('Carregando posts recentes...');
        
        // Simular clique nos posts
        const postItems = document.querySelectorAll('.post-item');
        
        postItems.forEach(item => {
            item.style.cursor = 'pointer';
            item.addEventListener('click', () => {
                const title = item.querySelector('h4').textContent;
                alert(`Abrindo post: ${title}`);
            });
        });
    },
    
    // Atualizar dados (futura integração)
    updateData() {
        // TODO: Buscar dados reais do backend
        console.log('Atualizando dados do dashboard...');
    }
};

// Inicializar quando carregar
document.addEventListener('DOMContentLoaded', () => {
    window.IalumModules.Dashboard.init();
});