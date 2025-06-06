// Teste independente para verificar se os submenus funcionam
// Execute este código no console do navegador

console.log('🧪 INICIANDO TESTE DOS SUBMENUS');

// Função de teste
function testSubmenus() {
    const submenus = document.querySelectorAll('.nav-item-submenu');
    console.log(`📋 Encontrados ${submenus.length} submenus`);
    
    submenus.forEach((submenu, index) => {
        const link = submenu.querySelector('.nav-link');
        const submenuDiv = submenu.querySelector('.nav-submenu');
        const arrow = submenu.querySelector('.nav-arrow');
        
        console.log(`🔍 Submenu ${index + 1}:`);
        console.log('  - Link:', link);
        console.log('  - Link href:', link?.getAttribute('href'));
        console.log('  - Submenu div:', submenuDiv);
        console.log('  - Arrow:', arrow);
        console.log('  - Expanded class:', submenu.classList.contains('expanded'));
        console.log('  - MaxHeight atual:', submenuDiv?.style.maxHeight);
    });
}

// Função para simular clique
function simulateClick(elementSelector) {
    const element = document.querySelector(elementSelector);
    if (element) {
        console.log(`🎯 Simulando clique em: ${elementSelector}`);
        element.click();
        return true;
    } else {
        console.error(`❌ Elemento não encontrado: ${elementSelector}`);
        return false;
    }
}

// Executar testes
testSubmenus();

console.log('');
console.log('🔧 Para testar manualmente:');
console.log('1. Execute: testSubmenus()');
console.log('2. Execute: simulateClick(".nav-item-submenu:first-child .nav-link")');
console.log('3. Verifique se o submenu expandiu');

// Disponibilizar funções globalmente
window.testSubmenus = testSubmenus;
window.simulateClick = simulateClick;