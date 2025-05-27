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
                },
                {
                    id: 3,
                    type: 'usage',
                    description: 'Pesquisa jurídica',
                    credits: -3,
                    date: '2025-01-22',
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
    const container = document.querySelector('.history-list');
    if (!container) return;
    
    container.innerHTML = '';
    
    transactionHistory.forEach(tx => {
        const item = document.createElement('div');
        item.className = 'transaction-item';
        
        const isCredit = tx.type === 'purchase';
        const amount = tx.amount || Math.abs(tx.credits);
        
        item.innerHTML = `
            <div class="transaction-info">
                <div class="transaction-description">${tx.description}</div>
                <div class="transaction-date">${Utils.formatDate(tx.date, 'DD/MM/YYYY')}</div>
            </div>
            <div class="transaction-amount ${isCredit ? 'credit' : 'debit'}">
                ${isCredit ? '+' : ''}${amount} ${tx.amount ? 'BRL' : 'créditos'}
            </div>
        `;
        
        container.appendChild(item);
    });
}

// Renderizar faturas
function renderInvoices() {
    const tbody = document.getElementById('invoices-tbody');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    invoices.forEach(invoice => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${invoice.id}</td>
            <td>${Utils.formatDate(invoice.date, 'DD/MM/YYYY')}</td>
            <td>${invoice.description}</td>
            <td>${Utils.formatCurrency(invoice.amount)}</td>
            <td>
                <span class="status-badge ${invoice.status}">
                    ${invoice.status === 'paid' ? 'Pago' : 'Pendente'}
                </span>
            </td>
            <td>
                <button class="btn-icon" onclick="downloadInvoice('${invoice.id}')">
                    ⬇️
                </button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

// Comprar créditos
async function handleCreditPurchase(e) {
    const card = e.target.closest('.package-card');
    const packageName = card.querySelector('h4').textContent;
    const credits = card.querySelector('.package-credits').textContent;
    const price = card.querySelector('.package-price').textContent;
    
    if (confirm(`Confirma a compra de ${credits} por ${price}?`)) {
        const btn = e.target;
        const originalText = btn.textContent;
        btn.disabled = true;
        btn.textContent = 'Processando...';
        
        try {
            // Simular processamento
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            // TODO: Integrar com gateway de pagamento real
            showToast('Compra realizada com sucesso!', 'success');
            
            // Recarregar dados
            await loadFinanceData();
            
        } catch (error) {
            showToast('Erro ao processar pagamento', 'error');
        } finally {
            btn.disabled = false;
            btn.textContent = originalText;
        }
    }
}

// Mudar plano
async function handlePlanChange(e) {
    const planCard = e.target.closest('.plan-card');
    const planName = planCard.querySelector('h4').textContent;
    
    if (confirm(`Deseja mudar para o ${planName}?`)) {
        const btn = e.target;
        const originalText = btn.textContent;
        btn.disabled = true;
        btn.textContent = 'Processando...';
        
        try {
            // Simular processamento
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            showToast(`Plano alterado para ${planName}!`, 'success');
            
            // Recarregar página para atualizar UI
            setTimeout(() => {
                window.location.reload();
            }, 1000);
            
        } catch (error) {
            showToast('Erro ao alterar plano', 'error');
            btn.disabled = false;
            btn.textContent = originalText;
        }
    }
}

// Alterar forma de pagamento
function changePaymentMethod() {
    showToast('Abrindo configurações de pagamento...', 'info');
    // TODO: Abrir modal ou redirecionar para página de pagamento
}

// Download de fatura (função global para onclick)
window.downloadInvoice = function(invoiceId) {
    showToast(`Baixando fatura ${invoiceId}...`, 'info');
    
    // Simular download
    setTimeout(() => {
        const link = document.createElement('a');
        link.download = `${invoiceId}.pdf`;
        link.href = '#';
        link.click();
        showToast('Fatura baixada com sucesso!', 'success');
    }, 1000);
};