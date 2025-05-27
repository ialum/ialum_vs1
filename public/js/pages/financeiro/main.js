/**
 * financeiro/main.js
 * Controlador principal da página Financeiro
 * Dependências: api.js, utils.js, notifications.js
 * Localização: public/js/pages/financeiro/main.js
 * Tamanho alvo: <200 linhas
 */

import { API } from '../../core/api.js';
import { Utils } from '../../core/utils.js';
import { showToast } from '../../components/notifications.js';

// Estado da página
let currentTab = 'creditos';
let transactionHistory = [];
let invoices = [];

// Função principal de inicialização
export async function init() {
    console.log('Inicializando Financeiro...');
    
    // Bind dos eventos
    bindEvents();
    
    // Carregar dados iniciais
    await loadFinanceData();
}

// Bind dos eventos
function bindEvents() {
    // Tabs
    document.querySelectorAll('.finance-tab').forEach(tab => {
        tab.addEventListener('click', () => switchTab(tab));
    });
    
    // Botões de compra de créditos
    document.querySelectorAll('.package-card button').forEach(btn => {
        btn.addEventListener('click', (e) => handleCreditPurchase(e));
    });
    
    // Botões de planos
    document.querySelectorAll('.plan-card button:not(:disabled)').forEach(btn => {
        btn.addEventListener('click', (e) => handlePlanChange(e));
    });
    
    // Alterar forma de pagamento
    const paymentBtn = document.querySelector('.payment-method button');
    if (paymentBtn) {
        paymentBtn.addEventListener('click', changePaymentMethod);
    }
}

// Carregar dados financeiros
async function loadFinanceData() {
    try {
        // Simular carregamento
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Dados mockados
        const mockData = {
            credits: {
                balance: 150,
                expiry: '31/12/2025',
                usage: {
                    research: 23,
                    content: 45,
                    images: 32
                }
            },
            transactions: [
                {
                    id: 1,
                    type: 'purchase',
                    description: 'Pacote Pro - 150 créditos',
                    amount: 129.90,
                    date: '2025-01-15',
                    status: 'completed'
                },
                {
                    id: 2,
                    type: 'usage',
                    description: 'Geração de conteúdo',
                    credits: -5,
                    date: '2025-01-20',
                    status: 'completed'
                }
            ],
            invoices: [
                {
                    id: 'INV-2025-001',
                    date: '2025-01-01',
                    description: 'Plano Profissional - Janeiro',
                    amount: 197.00,
                    status: 'paid'
                },
                {
                    id: 'INV-2024-012',
                    date: '2024-12-01',
                    description: 'Plano Profissional - Dezembro',
                    amount: 197.00,
                    status: 'paid'
                }
            ]
        };
        
        // Atualizar UI
        updateCreditsDisplay(mockData.credits);
        transactionHistory = mockData.transactions;
        invoices = mockData.invoices;
        
        // Renderizar histórico
        renderTransactionHistory();
        renderInvoices();
        
    } catch (error) {
        console.error('Erro ao carregar dados financeiros:', error);
        showToast('Erro ao carregar dados financeiros', 'error');
    }
}

// Alternar entre tabs
function switchTab(tabElement) {
    const tabName = tabElement.dataset.tab;
    
    // Atualizar tabs
    document.querySelectorAll('.finance-tab').forEach(tab => {
        tab.classList.toggle('active', tab.dataset.tab === tabName);
    });
    
    // Atualizar conteúdo
    document.querySelectorAll('.finance-pane').forEach(pane => {
        pane.classList.toggle('active', pane.id === `tab-${tabName}`);
    });
    
    currentTab = tabName;
}

// Atualizar display de créditos
function updateCreditsDisplay(credits) {
    // Saldo atual
    const currentCredits = document.getElementById('current-credits');
    if (currentCredits) currentCredits.textContent = credits.balance;
    
    // Validade
    const creditsExpiry = document.getElementById('credits-expiry');
    if (creditsExpiry) creditsExpiry.textContent = credits.expiry;
    
    // Uso detalhado
    const usageItems = document.querySelectorAll('.usage-item');
    if (usageItems.length >= 3) {
        usageItems[0].querySelector('.usage-count').textContent = credits.usage.research;
        usageItems[1].querySelector('.usage-count').textContent = credits.usage.content;
        usageItems[2].querySelector('.usage-count').textContent = credits.usage.images;
    }
    
    // Total usado
    const totalUsed = Object.values(credits.usage).reduce((a, b) => a + b, 0);
    const usageTotal = document.querySelector('.usage-total span:last-child');
    if (usageTotal) usageTotal.textContent = `${totalUsed} créditos`;
}

// Renderizar histórico de transações
function renderTransactionHistory() {
    const historyContainer = document.getElementById('transaction-history');
    if (!historyContainer) return;
    
    historyContainer.innerHTML = '';
    
    transactionHistory.forEach(tx => {
        const txElement = document.createElement('div');
        txElement.className = 'transaction-item';
        txElement.innerHTML = `
            <div class="transaction-date">${Utils.formatDate(tx.date)}</div>
            <div class="transaction-description">${tx.description}</div>
            <div class="transaction-amount ${tx.type === 'purchase' ? 'positive' : 'negative'}">
                ${tx.type === 'purchase' ? '+' : ''}${tx.amount || tx.credits} créditos
            </div>
            <div class="transaction-status">${tx.status}</div>
        `;
        historyContainer.appendChild(txElement);
    });
}