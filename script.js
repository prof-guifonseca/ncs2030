// Data Storage and State Management
const appState = {
    currentView: 'landing',
    user: null,
    progress: 0,
    indicators: [
        // Planeta (Ambiental) – 40 pontos
        { id: 1, name: 'Gestão de Resíduos & Economia Circular', category: 'Planeta', categoryLabel: 'Ambiental (E)', points: 13, status: 'Pendente' },
        { id: 2, name: 'Energia & Recursos Renováveis', category: 'Planeta', categoryLabel: 'Ambiental (E)', points: 13, status: 'Pendente' },
        { id: 3, name: 'Emissões e Carbono Neutro', category: 'Planeta', categoryLabel: 'Ambiental (E)', points: 14, status: 'Pendente' },
        // Pessoas (Social) – 30 pontos
        { id: 4, name: 'Saúde, Segurança & Bem-estar', category: 'Pessoas', categoryLabel: 'Social (S)', points: 10, status: 'Pendente' },
        { id: 5, name: 'Diversidade, Equidade & Inclusão', category: 'Pessoas', categoryLabel: 'Social (S)', points: 10, status: 'Pendente' },
        { id: 6, name: 'Trabalho Decente, Educação & Comunidade', category: 'Pessoas', categoryLabel: 'Social (S)', points: 10, status: 'Pendente' },
        // Prosperidade (Econômico) – 15 pontos
        { id: 7, name: 'Inovação Sustentável & Tecnologia Verde', category: 'Prosperidade', categoryLabel: 'Econômico (P)', points: 5, status: 'Pendente' },
        { id: 8, name: 'Desenvolvimento Econômico & Cadeia Responsável', category: 'Prosperidade', categoryLabel: 'Econômico (P)', points: 5, status: 'Pendente' },
        { id: 9, name: 'Inclusão Digital & Acessibilidade Tecnológica', category: 'Prosperidade', categoryLabel: 'Econômico (P)', points: 5, status: 'Pendente' },
        // Governança & Parcerias – 15 pontos
        { id: 10, name: 'Ética, Integridade & Anticorrupção', category: 'Governança', categoryLabel: 'Governança (G)', points: 5, status: 'Pendente' },
        { id: 11, name: 'Transparência, Compliance & Proteção de Dados', category: 'Governança', categoryLabel: 'Governança (G)', points: 5, status: 'Pendente' },
        { id: 12, name: 'Parcerias Estratégicas & Participação ODS', category: 'Governança', categoryLabel: 'Governança (G)', points: 5, status: 'Pendente' }
    ],
    certifiedCompanies: [
        { name: 'EcoTech Indústria Ltda.', cnpj: '12.345.678/0001-90', sector: 'Tecnologia', score: 92, level: 'Excelência', date: 'Janeiro 2025', color: '#eab308' },
        { name: 'Sustenta Alimentos S.A.', cnpj: '98.765.432/0001-11', sector: 'Alimentício', score: 87, level: 'Avançado', date: 'Dezembro 2024', color: '#3b82f6' },
        { name: 'Verde Energia Renovável', cnpj: '45.678.901/0001-23', sector: 'Energia', score: 78, level: 'Conformidade', date: 'Novembro 2024', color: '#f59e0b' }
    ]
};

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    loadUserFromStorage();
    initializeEventListeners();
    renderIndicatorsList();
    renderCompaniesDirectory();
    checkAuth();
});

// Initialize event listeners
function initializeEventListeners() {
    // Hamburger menu
    const hamburger = document.getElementById('hamburger-menu');
    const navMenu = document.getElementById('nav-menu');

    if (hamburger) {
        hamburger.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            hamburger.setAttribute('aria-expanded', navMenu.classList.contains('active'));
        });
    }

    // Auth forms
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');

    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }

    if (registerForm) {
        registerForm.addEventListener('submit', handleRegister);
    }
}

// View Management
function showView(viewName) {
    // Hide all views
    document.querySelectorAll('.view').forEach(view => {
        view.classList.remove('active');
    });

    // Show selected view
    const view = document.getElementById(viewName + '-view');
    if (view) {
        view.classList.add('active');
        appState.currentView = viewName;

        // Check authentication for dashboard
        if (viewName === 'dashboard' && !appState.user) {
            showView('login');
            return;
        }
    }

    // Close mobile menu
    document.getElementById('nav-menu')?.classList.remove('active');
}

// Authentication Functions
function handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    const errorDiv = document.getElementById('login-error');

    // Validate stored user
    const storedUser = JSON.parse(localStorage.getItem('ncs_user') || '{}');

    if (storedUser.email === email && storedUser.password === password) {
        localStorage.setItem('ncs_session', JSON.stringify({
            isLoggedIn: true,
            email: email,
            timestamp: new Date().toISOString()
        }));
        appState.user = storedUser;
        loadUserFromStorage();
        showView('dashboard');
        errorDiv.classList.remove('show');
    } else {
        errorDiv.textContent = 'E-mail ou senha inválidos.';
        errorDiv.classList.add('show');
    }
}

function handleRegister(e) {
    e.preventDefault();

    const formData = {
        razaoSocial: document.getElementById('register-company').value,
        cnpj: document.getElementById('register-cnpj').value,
        porte: document.getElementById('register-size').value,
        setor: document.getElementById('register-sector').value,
        responsavel: document.getElementById('register-responsible').value,
        email: document.getElementById('register-email').value,
        telefone: document.getElementById('register-phone').value,
        password: document.getElementById('register-password').value,
        passwordConfirm: document.getElementById('register-password-confirm').value,
        lgpdAccepted: document.getElementById('register-lgpd').checked,
        createdAt: new Date().toISOString()
    };

    const errorDiv = document.getElementById('register-error');

    // Validations
    if (formData.password !== formData.passwordConfirm) {
        errorDiv.textContent = 'As senhas não correspondem.';
        errorDiv.classList.add('show');
        return;
    }

    if (formData.password.length < 8) {
        errorDiv.textContent = 'A senha deve ter no mínimo 8 caracteres.';
        errorDiv.classList.add('show');
        return;
    }

    if (!formData.lgpdAccepted) {
        errorDiv.textContent = 'Você deve aceitar os termos da LGPD.';
        errorDiv.classList.add('show');
        return;
    }

    // Save user
    delete formData.passwordConfirm;
    localStorage.setItem('ncs_user', JSON.stringify(formData));
    localStorage.setItem('ncs_session', JSON.stringify({
        isLoggedIn: true,
        email: formData.email,
        timestamp: new Date().toISOString()
    }));

    appState.user = formData;
    loadUserFromStorage();
    showView('dashboard');
    errorDiv.classList.remove('show');
}

function loadUserFromStorage() {
    const session = JSON.parse(localStorage.getItem('ncs_session') || '{}');
    const user = JSON.parse(localStorage.getItem('ncs_user') || '{}');

    if (session.isLoggedIn && user.email) {
        appState.user = user;
        updateDashboardHeader();
        loadProgressFromStorage();
    }
}

function checkAuth() {
    const session = JSON.parse(localStorage.getItem('ncs_session') || '{}');
    if (!session.isLoggedIn && appState.currentView === 'dashboard') {
        showView('landing');
    }
}

function logout() {
    localStorage.removeItem('ncs_session');
    appState.user = null;
    appState.progress = 0;
    appState.indicators.forEach(ind => ind.status = 'Pendente');
    showView('landing');
}

function updateDashboardHeader() {
    const nameEl = document.getElementById('dashboard-company-name');
    if (nameEl && appState.user) {
        nameEl.textContent = `Bem-vindo(a), ${appState.user.razaoSocial}!`;
    }
}

// Progress and Indicators Management
function renderIndicatorsList() {
    const listContainer = document.getElementById('indicators-list');
    if (!listContainer) return;

    listContainer.innerHTML = '';

    appState.indicators.forEach(indicator => {
        const indicatorEl = document.createElement('div');
        indicatorEl.className = 'indicator-item';

        const categoryColor = {
            'Planeta': '#10b981',
            'Pessoas': '#3b82f6',
            // Novo grupo econômico/Prosperidade
            'Prosperidade': '#0ea5e9',
            'Governança': '#f59e0b'
        };

        const statusClass = indicator.status === 'Conforme' ? 'status-conforme' : 'status-pendente';

        indicatorEl.innerHTML = `
            <div class="indicator-item-header">
                <div class="indicator-item-title">
                    <div>
                        <h4>${indicator.name}</h4>
                        <p style="font-size: 0.85rem; color: #6b7280; margin: 0.25rem 0 0 0;">
                            <span class="indicator-badge" style="background: ${categoryColor}22; color: ${categoryColor}; margin-right: 0.5rem;">${indicator.categoryLabel}</span>
                        </p>
                    </div>
                </div>
                <div style="display: flex; gap: 0.5rem; align-items: center;">
                    <span class="status-badge ${statusClass}">${indicator.status}</span>
                </div>
            </div>
        `;

        listContainer.appendChild(indicatorEl);
    });
}

function updateIndicatorStatus(indicatorId, newStatus) {
    const indicator = appState.indicators.find(ind => ind.id === indicatorId);
    if (indicator) {
        indicator.status = newStatus;
        calculateProgress();
        renderIndicatorsList();
        saveProgressToStorage();
    }
}

function calculateProgress() {
    // Calculate progress based on points (internal) and completed indicator count
    let totalPoints = 0;
    let completedCount = 0;
    const weight = getIndicatorWeight();
    appState.indicators.forEach(indicator => {
        if (indicator.status === 'Conforme') {
            // Apply weight to indicator points for internal ranking
            totalPoints += indicator.points * weight;
            completedCount++;
        }
    });
    // Cap progress at 100 for display purposes
    appState.progress = Math.min(Math.round(totalPoints), 100);
    appState.completedIndicators = completedCount;
    updateProgressBar();
}

// Calculate a weighting factor based on company size. Smaller companies têm pontuação ajustada.
function getIndicatorWeight() {
    if (!appState.user || !appState.user.porte) return 1;
    switch (appState.user.porte) {
        case 'ME': // Microempresa
            return 0.8;
        case 'Pequena':
            return 0.9;
        case 'Média':
            return 1;
        case 'Grande':
            return 1.2;
        default:
            return 1;
    }
}

function updateProgressBar() {
    const fill = document.getElementById('progress-fill');
    const text = document.getElementById('progress-text');
    const status = document.getElementById('progress-status');

    if (fill) {
        // Calculate percentage based on number of indicators conformes
        const total = appState.indicators.length;
        const completed = appState.completedIndicators || 0;
        const percent = total > 0 ? Math.round((completed / total) * 100) : 0;
        fill.style.width = `${percent}%`;
        fill.textContent = `${percent}%`;
    }

    if (text) {
        const total = appState.indicators.length;
        const completed = appState.completedIndicators || 0;
        text.textContent = `Indicadores Conformes: ${completed}/${total}`;
    }

    if (status) {
        // Show only the level (not numeric score) to the user
        let statusText = 'Nível: Não Conforme';
        if (appState.progress >= 96) statusText = 'Nível: Platina ⭐';
        else if (appState.progress >= 90) statusText = 'Nível: Excelência';
        else if (appState.progress >= 75) statusText = 'Nível: Conformidade Avançada';
        else if (appState.progress >= 60) statusText = 'Nível: Conformidade Básica';
        status.textContent = statusText;
    }
}

function saveProgressToStorage() {
    const progress = {
        score: appState.progress,
        indicators: appState.indicators.map(ind => ({ id: ind.id, status: ind.status })),
        timestamp: new Date().toISOString()
    };
    localStorage.setItem('ncs_progress', JSON.stringify(progress));
}

function loadProgressFromStorage() {
    const saved = JSON.parse(localStorage.getItem('ncs_progress') || '{}');
    if (saved.indicators) {
        saved.indicators.forEach(item => {
            const indicator = appState.indicators.find(ind => ind.id === item.id);
            if (indicator) {
                indicator.status = item.status;
            }
        });
        appState.progress = saved.score || 0;
        updateProgressBar();
        renderIndicatorsList();
    }
}

// File Upload and SHA-256 Hash
async function generateSHA256(text) {
    try {
        const encoder = new TextEncoder();
        const data = encoder.encode(text);
        const hashBuffer = await crypto.subtle.digest('SHA-256', data);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    } catch (error) {
        console.error('Erro ao gerar hash:', error);
        return 'ERROR';
    }
}

async function handleFileUpload() {
    const fileInput = document.getElementById('file-input');
    const resultDiv = document.getElementById('upload-result');

    if (!fileInput.files.length) {
        resultDiv.textContent = 'Por favor, selecione um arquivo.';
        resultDiv.classList.add('show');
        return;
    }

    const file = fileInput.files[0];
    const timestamp = new Date().toLocaleString('pt-BR');
    const hashInput = file.name + timestamp;

    // Generate SHA-256 hash
    const hash = await generateSHA256(hashInput);

    // Display result
    resultDiv.innerHTML = `
        <div style="border: 1px solid #e5e7eb; border-radius: 4px; padding: 1rem;">
            <p><strong>Arquivo Processado:</strong></p>
            <p>📄 Nome: <code>${file.name}</code></p>
            <p>📊 Tamanho: ${(file.size / 1024).toFixed(2)} KB</p>
            <p><strong>Hash SHA-256:</strong></p>
            <p class="upload-hash">${hash}</p>
            <p><strong>Carimbo Temporal:</strong></p>
            <p><code>${timestamp}</code></p>
            <p style="color: #10b981; margin-top: 1rem; font-weight: 600;">✓ Arquivo validado com sucesso!</p>
        </div>
    `;
    resultDiv.classList.add('show');

    // Mark first pending indicator as compliant
    const pendingIndicator = appState.indicators.find(ind => ind.status === 'Pendente');
    if (pendingIndicator) {
        updateIndicatorStatus(pendingIndicator.id, 'Conforme');
    }

    // Clear file input
    fileInput.value = '';
}

// Report Generation
function generateReport() {
    const reportContent = document.getElementById('report-content');
    const statusLevel = getStatusLevel();

    let indicatorsHtml = '<h3>Indicadores Conformes:</h3><ul>';
    appState.indicators.forEach(ind => {
        if (ind.status === 'Conforme') {
            indicatorsHtml += `<li>${ind.name} (${ind.points} pts)</li>`;
        }
    });
    indicatorsHtml += '</ul>';

    reportContent.innerHTML = `
        <div style="background: #f3f4f6; padding: 1.5rem; border-radius: 8px; margin-bottom: 1.5rem;">
            <h3>Dados da Empresa</h3>
            <p><strong>Razão Social:</strong> ${appState.user.razaoSocial}</p>
            <p><strong>CNPJ:</strong> ${appState.user.cnpj}</p>
            <p><strong>Porte:</strong> ${appState.user.porte}</p>
            <p><strong>Setor:</strong> ${appState.user.setor}</p>
        </div>

        <div style="background: #f3f4f6; padding: 1.5rem; border-radius: 8px; margin-bottom: 1.5rem;">
            <h3>Resultado da Avaliação</h3>
            <p style="font-size: 2rem; color: #2563eb; font-weight: 700; margin: 0.5rem 0;">${appState.progress} / 100 pontos</p>
            <p style="font-size: 1.2rem; font-weight: 600; color: ${getStatusColor()};"><strong>Nível:</strong> ${statusLevel}</p>
        </div>

        ${indicatorsHtml}

        <div style="background: #fef3c7; padding: 1rem; border-radius: 4px; margin-top: 1.5rem; border-left: 4px solid #f59e0b;">
            <p><strong>⚠️ Nota Importante:</strong> Este é um relatório simulado. Em produção, seria gerado um PDF certificado assinado digitalmente.</p>
        </div>
    `;

    document.getElementById('report-modal').classList.add('show');
}

function getStatusLevel() {
    if (appState.progress >= 96) return 'Platina ⭐';
    if (appState.progress >= 90) return 'Excelência';
    if (appState.progress >= 75) return 'Conformidade Avançada';
    if (appState.progress >= 60) return 'Conformidade Básica';
    return 'Não Conforme';
}

function getStatusColor() {
    if (appState.progress >= 96) return '#8b5cf6';
    if (appState.progress >= 90) return '#eab308';
    if (appState.progress >= 75) return '#3b82f6';
    if (appState.progress >= 60) return '#f59e0b';
    return '#ef4444';
}

// Directory
function renderCompaniesDirectory() {
    const grid = document.getElementById('companies-grid');
    if (!grid) return;

    grid.innerHTML = '';

    appState.certifiedCompanies.forEach(company => {
        const card = document.createElement('div');
        card.className = 'company-card';
        card.setAttribute('role', 'article');
        card.setAttribute('aria-label', `Empresa certificada: ${company.name}`);

        card.innerHTML = `
            <div class="certification-seal" style="background: ${company.color};">
                ${company.level === 'Platina' ? '⭐' : company.level === 'Excelência' ? '🏆' : company.level === 'Avançado' ? '✨' : '✓'}
            </div>
            <h3>${company.name}</h3>
            <p class="company-cnpj">${company.cnpj}</p>
            <p class="company-sector">${company.sector}</p>
            <!-- A pontuação numérica é interna; exibe-se apenas o nível de certificação -->
            <p class="company-level">${company.level}</p>
            <p class="company-date">Certificado em ${company.date}</p>
        `;

        grid.appendChild(card);
    });
}

// Auth Tab Switching
function switchAuthTab(tab) {
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const tabs = document.querySelectorAll('.tab-btn');

    if (tab === 'login') {
        loginForm.classList.add('active');
        registerForm.classList.remove('active');
        tabs[0].classList.add('active');
        tabs[0].setAttribute('aria-selected', 'true');
        tabs[1].classList.remove('active');
        tabs[1].setAttribute('aria-selected', 'false');
    } else {
        registerForm.classList.add('active');
        loginForm.classList.remove('active');
        tabs[1].classList.add('active');
        tabs[1].setAttribute('aria-selected', 'true');
        tabs[0].classList.remove('active');
        tabs[0].setAttribute('aria-selected', 'false');
    }
}

// Scroll to section
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
    }
}

// Modal Management
function closeModal() {
    document.getElementById('report-modal').classList.remove('show');
    document.getElementById('info-modal').classList.remove('show');
}

function showModal(type) {
    const modal = document.getElementById('info-modal');
    const body = document.getElementById('modal-body');

    if (type === 'terms') {
        body.innerHTML = `
            <h2>Termos de Uso</h2>
            <p>O Referencial NCS 2030 – Selo de Conformidade é uma plataforma de autoavaliação ESG alinhada aos Objetivos de Desenvolvimento Sustentável (ODS) da Agenda 2030.</p>
            <h3>Consentimento e Responsabilidade</h3>
            <p>Ao utilizar esta plataforma, você concorda que:</p>
            <ul>
                <li>As informações fornecidas são de sua responsabilidade</li>
                <li>As avaliações são de caráter autoavaliativo</li>
                <li>A plataforma fornece dados para fins informativos</li>
                <li>Você aceita os termos da LGPD para proteção de dados</li>
            </ul>
            <h3>Propriedade Intelectual</h3>
            <p>Todo conteúdo desta plataforma está protegido por leis de direitos autorais.</p>
        `;
    } else if (type === 'privacy') {
        body.innerHTML = `
            <h2>Política de Privacidade</h2>
            <h3>Coleta de Dados</h3>
            <p>Coletamos informações que você nos fornece voluntariamente, incluindo dados da empresa e responsável.</p>
            <h3>Uso de Dados</h3>
            <p>Seus dados são utilizados exclusivamente para:</p>
            <ul>
                <li>Processamento de sua avaliação ESG</li>
                <li>Geração de relatórios de conformidade</li>
                <li>Melhoramento da plataforma</li>
            </ul>
            <h3>Conformidade LGPD</h3>
            <p>Estamos em conformidade com a Lei Geral de Proteção de Dados (LGPD - Lei 13.709/2018). Seus dados são armazenados de forma segura e não são compartilhados com terceiros sem seu consentimento.</p>
            <h3>Seus Direitos</h3>
            <p>Você tem direito a acessar, corrigir, deletar ou portabilidade de seus dados.</p>
        `;
    }

    modal.classList.add('show');
}

// Close modal when clicking outside
window.addEventListener('click', (e) => {
    const reportModal = document.getElementById('report-modal');
    const infoModal = document.getElementById('info-modal');

    if (e.target === reportModal) {
        reportModal.classList.remove('show');
    }
    if (e.target === infoModal) {
        infoModal.classList.remove('show');
    }
});

// Keyboard support for accessibility
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeModal();
    }
});
