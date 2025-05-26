/**
 * router-redirect.js
 * Redirecionador automático para adicionar .html
 * Usado em: Todas as páginas
 * Tamanho alvo: <50 linhas
 */

// Lista de rotas conhecidas (sem .html)
const routes = [
    '/login',
    '/registro',
    '/recuperar-senha',
    '/termos',
    '/privacidade',
    '/contato'
];

// Verificar se estamos em uma rota sem .html
const currentPath = window.location.pathname;

if (routes.includes(currentPath)) {
    // Redirecionar para versão com .html
    window.location.replace(currentPath + '.html' + window.location.search + window.location.hash);
}