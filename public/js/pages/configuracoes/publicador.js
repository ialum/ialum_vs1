/**
 * configuracoes/publicador.js
 * Lógica da aba Publicador - Horários e Frequências
 * Dependências: api.js, notifications.js
 * Localização: public/js/pages/configuracoes/publicador.js
 * Tamanho alvo: <150 linhas
 */

export async function init() {
    const container = document.getElementById('tab-publicador');
    
    try {
        container.innerHTML = getTemplate();
        await loadScheduleData();
        bindEvents();
    } catch (error) {
        console.error('Erro ao inicializar publicador:', error);
        container.innerHTML = '<p class="error">Erro ao carregar configurações</p>';
    }
}

function getTemplate() {
    return `
        <div class="config-section">
            <h3>Horários de Publicação</h3>
            <p class="section-description">
                Configure os melhores horários para publicar em cada rede social
            </p>
            
            <form id="form-horarios" class="config-form">
                <div class="schedule-grid">
                    <!-- Segunda -->
                    <div class="schedule-day">
                        <label class="checkbox-label">
                            <input type="checkbox" name="seg_active" checked>
                            <span>Segunda-feira</span>
                        </label>
                        <input type="time" name="seg_time" value="19:00" class="form-input">
                    </div>
                    
                    <!-- Terça -->
                    <div class="schedule-day">
                        <label class="checkbox-label">
                            <input type="checkbox" name="ter_active" checked>
                            <span>Terça-feira</span>
                        </label>
                        <input type="time" name="ter_time" value="19:00" class="form-input">
                    </div>
                    
                    <!-- Quarta -->
                    <div class="schedule-day">
                        <label class="checkbox-label">
                            <input type="checkbox" name="qua_active" checked>
                            <span>Quarta-feira</span>
                        </label>
                        <input type="time" name="qua_time" value="19:00" class="form-input">
                    </div>
                    
                    <!-- Quinta -->
                    <div class="schedule-day">
                        <label class="checkbox-label">
                            <input type="checkbox" name="qui_active" checked>
                            <span>Quinta-feira</span>
                        </label>
                        <input type="time" name="qui_time" value="19:00" class="form-input">
                    </div>
                    
                    <!-- Sexta -->
                    <div class="schedule-day">
                        <label class="checkbox-label">
                            <input type="checkbox" name="sex_active" checked>
                            <span>Sexta-feira</span>
                        </label>
                        <input type="time" name="sex_time" value="18:00" class="form-input">
                    </div>
                    
                    <!-- Sábado -->
                    <div class="schedule-day">
                        <label class="checkbox-label">
                            <input type="checkbox" name="sab_active">
                            <span>Sábado</span>
                        </label>
                        <input type="time" name="sab_time" value="10:00" class="form-input" disabled>
                    </div>
                    
                    <!-- Domingo -->
                    <div class="schedule-day">
                        <label class="checkbox-label">
                            <input type="checkbox" name="dom_active">
                            <span>Domingo</span>
                        </label>
                        <input type="time" name="dom_time" value="10:00" class="form-input" disabled>
                    </div>
                </div>
                
                <div class="form-actions">
                    <button type="submit" class="btn btn-primary">
                        Salvar Horários
                    </button>
                </div>
            </form>
        </div>
        
        <div class="config-section">
            <h3>Frequência de Publicação</h3>
            <form id="form-frequencia" class="config-form">
                <div class="form-group">
                    <label class="form-label">Posts por semana</label>
                    <select name="posts_per_week" class="form-select">
                        <option value="1">1 post</option>
                        <option value="2">2 posts</option>
                        <option value="3" selected>3 posts</option>
                        <option value="5">5 posts</option>
                        <option value="7">7 posts (diário)</option>
                    </select>
                </div>
                
                <div class="form-group">
                    <label class="form-label">Intervalo mínimo entre posts</label>
                    <select name="min_interval" class="form-select">
                        <option value="1">1 dia</option>
                        <option value="2" selected>2 dias</option>
                        <option value="3">3 dias</option>
                        <option value="7">1 semana</option>
                    </select>
                </div>
                
                <div class="form-group">
                    <label class="checkbox-label">
                        <input type="checkbox" name="auto_schedule" checked>
                        <span>Agendar automaticamente posts aprovados</span>
                    </label>
                </div>
                
                <div class="form-group">
                    <label class="checkbox-label">
                        <input type="checkbox" name="skip_holidays">
                        <span>Não publicar em feriados</span>
                    </label>
                </div>
                
                <div class="form-actions">
                    <button type="submit" class="btn btn-primary">
                        Salvar Frequência
                    </button>
                </div>
            </form>
        </div>
    `;
}

async function loadScheduleData() {
    try {
        // TODO: Carregar dados reais da API
        const mockData = {
            schedule: {
                seg: { active: true, time: '19:00' },
                ter: { active: true, time: '19:00' },
                qua: { active: true, time: '19:00' },
                qui: { active: true, time: '19:00' },
                sex: { active: true, time: '18:00' },
                sab: { active: false, time: '10:00' },
                dom: { active: false, time: '10:00' }
            },
            frequency: {
                posts_per_week: 3,
                min_interval: 2,
                auto_schedule: true,
                skip_holidays: false
            }
        };
        
        // Preencher formulário de frequência
        if (mockData.frequency) {
            const form = document.getElementById('form-frequencia');
            form.querySelector('[name="posts_per_week"]').value = mockData.frequency.posts_per_week;
            form.querySelector('[name="min_interval"]').value = mockData.frequency.min_interval;
            form.querySelector('[name="auto_schedule"]').checked = mockData.frequency.auto_schedule;
            form.querySelector('[name="skip_holidays"]').checked = mockData.frequency.skip_holidays;
        }
        
    } catch (error) {
        console.error('Erro ao carregar dados:', error);
    }
}

function bindEvents() {
    // Checkboxes dos dias - habilitar/desabilitar horário
    document.querySelectorAll('.schedule-day input[type="checkbox"]').forEach(checkbox => {
        checkbox.addEventListener('change', (e) => {
            const timeInput = e.target.closest('.schedule-day').querySelector('input[type="time"]');
            timeInput.disabled = !e.target.checked;
        });
    });
    
    // Form de horários
    document.getElementById('form-horarios').addEventListener('submit', handleHorariosSubmit);
    
    // Form de frequência
    document.getElementById('form-frequencia').addEventListener('submit', handleFrequenciaSubmit);
}

async function handleHorariosSubmit(e) {
    e.preventDefault();
    
    const btn = e.target.querySelector('button[type="submit"]');
    const originalText = btn.textContent;
    btn.disabled = true;
    btn.textContent = 'Salvando...';
    
    try {
        const formData = new FormData(e.target);
        const schedule = {};
        
        ['seg', 'ter', 'qua', 'qui', 'sex', 'sab', 'dom'].forEach(day => {
            schedule[day] = {
                active: formData.get(`${day}_active`) === 'on',
                time: formData.get(`${day}_time`)
            };
        });
        
        // TODO: Salvar via API
        console.log('Salvando horários:', schedule);
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        window.showToast('Horários salvos com sucesso!', 'success');
    } catch (error) {
        window.showToast('Erro ao salvar horários', 'error');
    } finally {
        btn.disabled = false;
        btn.textContent = originalText;
    }
}

async function handleFrequenciaSubmit(e) {
    e.preventDefault();
    
    const btn = e.target.querySelector('button[type="submit"]');
    const originalText = btn.textContent;
    btn.disabled = true;
    btn.textContent = 'Salvando...';
    
    try {
        const formData = new FormData(e.target);
        const frequency = {
            posts_per_week: parseInt(formData.get('posts_per_week')),
            min_interval: parseInt(formData.get('min_interval')),
            auto_schedule: formData.get('auto_schedule') === 'on',
            skip_holidays: formData.get('skip_holidays') === 'on'
        };
        
        // TODO: Salvar via API
        console.log('Salvando frequência:', frequency);
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        window.showToast('Frequência de publicação salva!', 'success');
    } catch (error) {
        window.showToast('Erro ao salvar frequência', 'error');
    } finally {
        btn.disabled = false;
        btn.textContent = originalText;
    }
}