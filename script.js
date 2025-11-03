// =====================================
// DATA STORAGE & STATE MANAGEMENT
// =====================================
const appState = {
    currentView: 'landing',
    currentDashboardTab: 'overview',
    user: null,
    progress: 0,
    indicators: [
        // Planeta (Ambiental) – 40 pontos
        {
            id: 1,
            name: 'Gestão de Resíduos & Economia Circular',
            category: 'Planeta',
            categoryLabel: 'Ambiental (E)',
            points: 13,
            status: 'Pendente'
        },
        {
            id: 2,
            name: 'Energia & Recursos Renováveis',
            category: 'Planeta',
            categoryLabel: 'Ambiental (E)',
            points: 13,
            status: 'Pendente'
        },
        {
            id: 3,
            name: 'Emissões e Carbono Neutro',
            category: 'Planeta',
            categoryLabel: 'Ambiental (E)',
            points: 14,
            status: 'Pendente'
        },
        // Pessoas (Social) – 30 pontos
        {
            id: 4,
            name: 'Saúde, Segurança & Bem-estar',
            category: 'Pessoas',
            categoryLabel: 'Social (S)',
            points: 10,
            status: 'Pendente'
        },
        {
            id: 5,
            name: 'Diversidade, Equidade & Inclusão',
            category: 'Pessoas',
            categoryLabel: 'Social (S)',
            points: 10,
            status: 'Pendente'
        },
        {
            id: 6,
            name: 'Trabalho Decente, Educação & Comunidade',
            category: 'Pessoas',
            categoryLabel: 'Social (S)',
            points: 10,
            status: 'Pendente'
        },
        // Prosperidade (Econômico) – 15 pontos
        {
            id: 7,
            name: 'Inovação Sustentável & Tecnologia Verde',
            category: 'Prosperidade',
            categoryLabel: 'Econômico (P)',
            points: 5,
            status: 'Pendente'
        },
        {
            id: 8,
            name: 'Desenvolvimento Econômico & Cadeia Responsável',
            category: 'Prosperidade',
            categoryLabel: 'Econômico (P)',
            points: 5,
            status: 'Pendente'
        },
        {
            id: 9,
            name: 'Inclusão Digital & Acessibilidade Tecnológica',
            category: 'Prosperidade',
            categoryLabel: 'Econômico (P)',
            points: 5,
            status: 'Pendente'
        },
        // Governança & Parcerias – 15 pontos
        {
            id: 10,
            name: 'Ética, Integridade & Anticorrupção',
            category: 'Governanca',
            categoryLabel: 'Governança (G)',
            points: 5,
            status: 'Pendente'
        },
        {
            id: 11,
            name: 'Transparência, Compliance & Proteção de Dados',
            category: 'Governanca',
            categoryLabel: 'Governança (G)',
            points: 5,
            status: 'Pendente'
        },
        {
            id: 12,
            name: 'Parcerias Estratégicas & Participação ODS',
            category: 'Governanca',
            categoryLabel: 'Governança (G)',
            points: 5,
            status: 'Pendente'
        }
    ],
    evidence: {},
    reports: [],
    feedback: [
        {
            id: 1,
            date: new Date().toISOString(),
            author: 'Sistema de Análise',
            type: 'Sugestão',
            message: 'Bem-vindo ao NCS 2030! Comece preenchendo seus indicadores de sustentabilidade.',
            read: false
        }
    ],
    certifiedCompanies: [
        {
            name: 'EcoTech Indústria Ltda.',
            cnpj: '12.345.678/0001-90',
            sector: 'Tecnologia',
            score: 92,
            level: 'Excelência',
            date: 'Janeiro 2025',
            color: '#eab308'
        },
        {
            name: 'Sustenta Alimentos S.A.',
            cnpj: '98.765.432/0001-11',
            sector: 'Alimentício',
            score: 87,
            level: 'Avançado',
            date: 'Dezembro 2024',
            color: '#3b82f6'
        },
        {
            name: 'Verde Energia Renovável',
            cnpj: '45.678.901/0001-23',
            sector: 'Energia',
            score: 78,
            level: 'Conformidade',
            date: 'Novembro 2024',
            color: '#f59e0b'
        }
    ]
};

// =====================================
// INITIALIZATION
// =====================================
document.addEventListener('DOMContentLoaded', () => {
    loadUserFromStorage();
    initializeEventListeners();
    renderCompaniesDirectory();
    checkAuth();
    updateDate();
});

// Initialize event listeners
function initializeEventListeners() {
    const hamburger = document.getElementById('hamburger-menu');
    const navMenu = document.getElementById('nav-menu');

    if (hamburger) {
        hamburger.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            hamburger.setAttribute('aria-expanded', navMenu.classList.contains('active'));
        });
    }

    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');

    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }

    if (registerForm) {
        registerForm.addEventListener('submit', handleRegister);
    }

    window.addEventListener('click', (e) => {
        const infoModal = document.getElementById('info-modal');
        if (e.target === infoModal) {
            infoModal.classList.remove('show');
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeModal();
        }
    });
}

// =====================================
// VIEW MANAGEMENT
// =====================================
function showView(viewName) {
    document.querySelectorAll('.view').forEach(view => {
        view.classList.remove('active');
    });

    const view = document.getElementById(viewName + '-view');
    if (view) {
        view.classList.add('active');
        appState.currentView = viewName;

        if (viewName === 'dashboard' && !appState.user) {
            showView('login');
            return;
        }

        if (viewName === 'dashboard' && appState.user) {
            updateDashboard();
        }
    }

    document.getElementById('nav-menu')?.classList.remove('active');
}

function switchDashboardTab(tabName) {
    document.querySelectorAll('.dashboard-tab').forEach(tab => {
        tab.classList.remove('active');
    });

    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.remove('active');
    });

    const tab = document.getElementById(tabName + '-tab');
    if (tab) {
        tab.classList.add('active');
        appState.currentDashboardTab = tabName;
    }

    event.target.classList.add('active');

    if (tabName === 'evidence') {
        renderEvidenceList();
    } else if (tabName === 'feedback') {
        renderFeedbackList();
    } else if (tabName === 'certifications') {
        renderCertificationCard();
    } else if (tabName === 'reports') {
        renderReports();
    }
}

// =====================================
// AUTHENTICATION
// =====================================
function handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    const errorDiv = document.getElementById('login-error');

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
        updateSidebarInfo();
        updateNavigation();
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

function updateSidebarInfo() {
    if (appState.user) {
        document.getElementById('sidebar-company').textContent = appState.user.razaoSocial;
        document.getElementById('sidebar-cnpj').textContent = appState.user.cnpj;
        document.getElementById('sidebar-porte').textContent = appState.user.porte;
        document.getElementById('sidebar-setor').textContent = appState.user.setor;
    }
}

function updateNavigation() {
    const dashboardLink = document.getElementById('nav-dashboard-link');
    const logoutLink = document.getElementById('nav-logout-link');
    const authLink = document.getElementById('nav-auth-link');

    if (appState.user) {
        dashboardLink.style.display = 'block';
        logoutLink.style.display = 'block';
        authLink.style.display = 'none';
    } else {
        dashboardLink.style.display = 'none';
        logoutLink.style.display = 'none';
        authLink.style.display = 'block';
    }
}

// =====================================
// DASHBOARD UPDATE
// =====================================
function updateDashboard() {
    calculateProgress();
    renderProgress();
    renderIndicatorsList();
    renderActivitiesFeed();
    updateDate();
}

function calculateProgress() {
    let totalPoints = 0;
    let earnedPoints = 0;

    appState.indicators.forEach(ind => {
        totalPoints += ind.points;
        if (ind.status === 'Conforme') {
            earnedPoints += ind.points;
        }
    });

    appState.progress = Math.round((earnedPoints / totalPoints) * 100);
}

function renderProgress() {
    const percentage = appState.progress;
    const earnedPoints = appState.indicators
        .filter(ind => ind.status === 'Conforme')
        .reduce((sum, ind) => sum + ind.points, 0);

    const conformes = appState.indicators.filter(ind => ind.status === 'Conforme').length;
    const pendentes = appState.indicators.filter(ind => ind.status !== 'Conforme').length;

    document.getElementById('progress-percentage').textContent = percentage;
    document.getElementById('progress-score').textContent = earnedPoints;
    document.getElementById('progress-fill').style.width = percentage + '%';

    let level = 'Não Conforme';
    if (percentage >= 90) level = 'Excelência';
    else if (percentage >= 70) level = 'Avançado';
    else if (percentage >= 40) level = 'Conformidade';

    document.getElementById('progress-level').textContent = level;

    // Stats
    document.getElementById('stat-conformes').textContent = conformes;
    document.getElementById('stat-pendentes').textContent = pendentes;
    document.getElementById('stat-pontos').textContent = earnedPoints;

    // Category progress
    const categories = {
        'Planeta': { earned: 0, total: 40 },
        'Pessoas': { earned: 0, total: 30 },
        'Prosperidade': { earned: 0, total: 15 },
        'Governanca': { earned: 0, total: 15 }
    };

    appState.indicators.forEach(ind => {
        const cat = ind.category;
        if (categories[cat]) {
            if (ind.status === 'Conforme') {
                categories[cat].earned += ind.points;
            }
        }
    });

    Object.keys(categories).forEach(cat => {
        const earned = categories[cat].earned;
        const total = categories[cat].total;
        const pct = Math.round((earned / total) * 100);

        document.getElementById('cat-' + cat.toLowerCase()).textContent = 
            earned + ' / ' + total;

        const fillEl = document.getElementById('cat-' + cat.toLowerCase() + '-fill');
        if (fillEl) {
            fillEl.style.width = pct + '%';
        }
    });
}

function renderIndicatorsList() {
    const container = document.getElementById('indicators-list');
    if (!container) return;

    const table = document.createElement('table');
    table.className = 'indicators-table';

    const thead = document.createElement('thead');
    thead.innerHTML = `
        <tr>
            <th>Nome</th>
            <th>Categoria</th>
            <th>Pontos</th>
            <th>Status</th>
            <th>Ações</th>
        </tr>
    `;
    table.appendChild(thead);

    const tbody = document.createElement('tbody');
    appState.indicators.forEach(ind => {
        const tr = document.createElement('tr');
        const categoryColors = {
            'Planeta': 'badge-planeta',
            'Pessoas': 'badge-pessoas',
            'Prosperidade': 'badge-prosperidade',
            'Governanca': 'badge-governanca'
        };

        const statusClass = ind.status === 'Conforme' ? 'status-conforme' : 
                          ind.status === 'Em Análise' ? 'status-analise' : 'status-pendente';

        tr.innerHTML = `
            <td>${ind.name}</td>
            <td><span class="badge ${categoryColors[ind.category]}">${ind.categoryLabel}</span></td>
            <td><strong>${ind.points}</strong></td>
            <td><span class="badge ${statusClass}">${ind.status}</span></td>
            <td>
                <div class="table-actions">
                    <button class="btn btn-primary btn-small" onclick="toggleIndicatorStatus(${ind.id})">
                        ${ind.status === 'Conforme' ? '✓' : '→'} Marcar
                    </button>
                </div>
            </td>
        `;
        tbody.appendChild(tr);
    });
    table.appendChild(tbody);

    container.innerHTML = '';
    container.appendChild(table);
}

function toggleIndicatorStatus(id) {
    const indicator = appState.indicators.find(ind => ind.id === id);
    if (indicator) {
        const statuses = ['Pendente', 'Em Análise', 'Conforme'];
        const currentIndex = statuses.indexOf(indicator.status);
        indicator.status = statuses[(currentIndex + 1) % statuses.length];
        updateDashboard();
    }
}

function filterIndicators() {
    const category = document.getElementById('filter-category')?.value;
    const status = document.getElementById('filter-status')?.value;

    let filtered = appState.indicators;
    if (category) {
        filtered = filtered.filter(ind => ind.category === category);
    }
    if (status) {
        filtered = filtered.filter(ind => ind.status === status);
    }

    const container = document.getElementById('indicators-list');
    if (!container) return;

    const table = document.createElement('table');
    table.className = 'indicators-table';

    const thead = document.createElement('thead');
    thead.innerHTML = `
        <tr>
            <th>Nome</th>
            <th>Categoria</th>
            <th>Pontos</th>
            <th>Status</th>
            <th>Ações</th>
        </tr>
    `;
    table.appendChild(thead);

    const tbody = document.createElement('tbody');
    filtered.forEach(ind => {
        const tr = document.createElement('tr');
        const categoryColors = {
            'Planeta': 'badge-planeta',
            'Pessoas': 'badge-pessoas',
            'Prosperidade': 'badge-prosperidade',
            'Governanca': 'badge-governanca'
        };

        const statusClass = ind.status === 'Conforme' ? 'status-conforme' : 
                          ind.status === 'Em Análise' ? 'status-analise' : 'status-pendente';

        tr.innerHTML = `
            <td>${ind.name}</td>
            <td><span class="badge ${categoryColors[ind.category]}">${ind.categoryLabel}</span></td>
            <td><strong>${ind.points}</strong></td>
            <td><span class="badge ${statusClass}">${ind.status}</span></td>
            <td>
                <div class="table-actions">
                    <button class="btn btn-primary btn-small" onclick="toggleIndicatorStatus(${ind.id})">
                        ${ind.status === 'Conforme' ? '✓' : '→'} Marcar
                    </button>
                </div>
            </td>
        `;
        tbody.appendChild(tr);
    });
    table.appendChild(tbody);

    container.innerHTML = '';
    container.appendChild(table);
}

function renderActivitiesFeed() {
    const feed = document.getElementById('activities-feed');
    if (!feed) return;

    feed.innerHTML = '';
    const activities = [
        'Dashboard acessado com sucesso',
        'Empresa vinculada à conta',
        'Indicadores carregados'
    ];

    activities.forEach((activity, index) => {
        const item = document.createElement('div');
        item.className = 'activity-item';
        item.innerHTML = `
            <div class="activity-title">${activity}</div>
            <div class="activity-time">${new Date().toLocaleDateString('pt-BR')} às ${new Date().toLocaleTimeString('pt-BR')}</div>
        `;
        feed.appendChild(item);
    });
}

// =====================================
// EVIDENCE
// =====================================
function renderEvidenceList() {
    const container = document.getElementById('evidence-list');
    if (!container) return;

    container.innerHTML = '';

    appState.indicators.forEach(ind => {
        const evidenceItem = document.createElement('div');
        evidenceItem.className = 'evidence-item';

        const fileList = appState.evidence[ind.id] || [];
        const filesHTML = fileList.length > 0 
            ? fileList.map(file => `
                <div class="file-item">
                    <div class="file-info">
                        <span class="file-name">📄 ${file.name}</span>
                        <span class="file-meta">${file.size} KB • ${new Date(file.date).toLocaleDateString('pt-BR')}</span>
                    </div>
                    <div class="file-actions">
                        <button class="btn btn-secondary btn-small" onclick="removeFile(${ind.id}, '${file.name}')">🗑️ Deletar</button>
                    </div>
                </div>
            `).join('')
            : '<p style="color: #6b7280;">Nenhum arquivo enviado</p>';

        evidenceItem.innerHTML = `
            <div class="evidence-header">
                <div>
                    <div class="evidence-title">${ind.name}</div>
                    <span class="badge badge-${ind.category.toLowerCase()}">${ind.categoryLabel}</span>
                </div>
            </div>
            <div class="upload-area" onclick="document.getElementById('file-input-${ind.id}').click()">
                <input type="file" id="file-input-${ind.id}" onchange="uploadFile(${ind.id}, event)">
                <p>📤 Clique ou arraste aqui para enviar um arquivo</p>
            </div>
            <div class="file-list">
                ${filesHTML}
            </div>
        `;

        container.appendChild(evidenceItem);
    });
}

function uploadFile(indicatorId, event) {
    const file = event.target.files[0];
    if (file) {
        if (!appState.evidence[indicatorId]) {
            appState.evidence[indicatorId] = [];
        }

        appState.evidence[indicatorId].push({
            name: file.name,
            size: (file.size / 1024).toFixed(2),
            date: new Date().toISOString(),
            hash: generateHash()
        });

        renderEvidenceList();
    }
}

function removeFile(indicatorId, fileName) {
    if (appState.evidence[indicatorId]) {
        appState.evidence[indicatorId] = appState.evidence[indicatorId]
            .filter(f => f.name !== fileName);
        renderEvidenceList();
    }
}

function generateHash() {
    return 'SHA-' + Math.random().toString(36).substr(2, 12).toUpperCase();
}

// =====================================
// REPORTS
// =====================================
function generateReport(type) {
    const report = {
        id: appState.reports.length + 1,
        type: type,
        name: type === 'consolidado' ? 'Relatório Consolidado' : `Relatório - ${type}`,
        date: new Date().toISOString()
    };

    appState.reports.unshift(report);
    renderReports();
    alert(`Relatório "${report.name}" gerado com sucesso!`);
}

function renderReports() {
    const container = document.getElementById('reports-history');
    if (!container) return;

    container.innerHTML = '<h4>Relatórios Gerados</h4>';

    if (appState.reports.length === 0) {
        container.innerHTML += '<p style="color: #6b7280;">Nenhum relatório gerado ainda.</p>';
        return;
    }

    const reportsList = document.createElement('div');
    appState.reports.forEach(report => {
        const item = document.createElement('div');
        item.className = 'report-item';
        item.innerHTML = `
            <div class="report-info">
                <div class="report-name">${report.name}</div>
                <div class="report-date">${new Date(report.date).toLocaleDateString('pt-BR')} às ${new Date(report.date).toLocaleTimeString('pt-BR')}</div>
            </div>
            <button class="btn btn-primary btn-small" onclick="alert('Download do relatório em desenvolvimento')">⬇️ Download</button>
        `;
        reportsList.appendChild(item);
    });

    container.appendChild(reportsList);
}

// =====================================
// CERTIFICATIONS
// =====================================
function renderCertificationCard() {
    const container = document.getElementById('certification-card');
    if (!container) return;

    const percentage = appState.progress;
    const earnedPoints = appState.indicators
        .filter(ind => ind.status === 'Conforme')
        .reduce((sum, ind) => sum + ind.points, 0);

    let level = 'Não Conforme';
    let color = '#ef4444';
    if (percentage >= 90) {
        level = 'Excelência';
        color = '#eab308';
    } else if (percentage >= 70) {
        level = 'Avançado';
        color = '#3b82f6';
    } else if (percentage >= 40) {
        level = 'Conformidade';
        color = '#f59e0b';
    }

    const isEligible = earnedPoints >= 40;

    container.innerHTML = `
        <div class="cert-card" style="background: linear-gradient(135deg, ${color}, #0ea5e9);">
            <div class="cert-number">NCS-2024-${Math.random().toString().substr(2, 5).toUpperCase()}</div>
            <div class="cert-level">${level}</div>
            <div class="cert-details">
                <div class="cert-detail">
                    <div class="cert-detail-label">Pontuação</div>
                    <div class="cert-detail-value">${earnedPoints}/100</div>
                </div>
                <div class="cert-detail">
                    <div class="cert-detail-label">Percentual</div>
                    <div class="cert-detail-value">${percentage}%</div>
                </div>
                <div class="cert-detail">
                    <div class="cert-detail-label">Status</div>
                    <div class="cert-detail-value">${isEligible ? 'Ativo' : 'Inelegível'}</div>
                </div>
            </div>
        </div>

        <div class="cert-criteria">
            <h4>Critérios de Conformidade:</h4>
            <div class="criteria-list">
                <div class="criteria-item${earnedPoints >= 40 ? '' : ' pending'}">
                    ✓ Mínimo de 40 pontos alcançados (${earnedPoints}/40)
                </div>
                <div class="criteria-item${appState.indicators.filter(i => i.status === 'Conforme').length >= 5 ? '' : ' pending'}">
                    ✓ Pelo menos 5 indicadores conformes (${appState.indicators.filter(i => i.status === 'Conforme').length}/5)
                </div>
                <div class="criteria-item${Object.keys(appState.evidence).length > 0 ? '' : ' pending'}">
                    ✓ Documentação enviada (${Object.keys(appState.evidence).length} indicador(es) com arquivos)
                </div>
            </div>

            ${isEligible ? `
                <div class="next-level">
                    🎯 Próximo Nível: Avançado (requer 70 pontos)
                </div>
            ` : `
                <div class="next-level">
                    ⚠️ Continue preenchendo seus indicadores para alcançar a certificação.
                </div>
            `}
        </div>
    `;
}

// =====================================
// FEEDBACK
// =====================================
function renderFeedbackList() {
    const container = document.getElementById('feedback-list');
    if (!container) return;

    if (appState.feedback.length === 0) {
        container.innerHTML = '<p style="color: #6b7280;">Nenhuma mensagem de feedback.</p>';
        return;
    }

    container.innerHTML = '';
    appState.feedback.forEach(fb => {
        const item = document.createElement('div');
        item.className = 'feedback-item';

        const typeClass = 'type-' + fb.type.toLowerCase().replace(/ã/g, 'a').replace(/á/g, 'a');

        item.innerHTML = `
            <div class="feedback-header">
                <div class="feedback-meta">
                    <span class="feedback-author">${fb.author}</span>
                    <span class="feedback-type">${fb.type}</span>
                </div>
            </div>
            <div class="feedback-message">${fb.message}</div>
            <div class="feedback-time">${new Date(fb.date).toLocaleDateString('pt-BR')} às ${new Date(fb.date).toLocaleTimeString('pt-BR')}</div>
        `;

        container.appendChild(item);
    });
}

// =====================================
// COMPANIES DIRECTORY
// =====================================
function renderCompaniesDirectory() {
    const grid = document.getElementById('companies-grid');
    if (!grid) return;

    grid.innerHTML = '';
    appState.certifiedCompanies.forEach(company => {
        const card = document.createElement('div');
        card.className = 'company-card';

        // Determine level and associated emoji/color based on score ranges.  
        // 0‑39 → Não Conforme; 40‑69 → Conformidade; 70‑89 → Avançado; 90‑100 → Excelência.
        let level = 'Não Conforme';
        let color = '#ef4444'; // red for non‑conformity
        let levelEmoji = '⚠️';

        const score = Number(company.score);
        if (score >= 90) {
            level = 'Excelência';
            color = '#eab308';
            levelEmoji = '⭐';
        } else if (score >= 70) {
            level = 'Avançado';
            color = '#3b82f6';
            levelEmoji = '🏅';
        } else if (score >= 40) {
            level = 'Conformidade';
            color = '#f59e0b';
            levelEmoji = '✓';
        }

        card.innerHTML = `
            <div class="certification-seal" style="background: ${color};">
                ${levelEmoji}
            </div>
            <h3>${company.name}</h3>
            <div class="company-cnpj">${company.cnpj}</div>
            <div class="company-sector">${company.sector}</div>
            <!-- Pontuação omitida para garantir a privacidade. O nível é calculado a partir da pontuação interna. -->
            <div class="company-level" style="color: ${color};">${level}</div>
            <div class="company-date">Certificado em ${company.date}</div>
        `;

        grid.appendChild(card);
    });
}

// =====================================
// UTILITY FUNCTIONS
// =====================================
function switchAuthTab(tab) {
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const loginTab = document.getElementById('login-form-tab');
    const registerTab = document.getElementById('register-form-tab');
    const tabs = document.querySelectorAll('.tab-btn');

    if (tab === 'login') {
        loginTab.classList.add('active');
        registerTab.classList.remove('active');
        tabs[0].classList.add('active');
        tabs[0].setAttribute('aria-selected', 'true');
        tabs[1].classList.remove('active');
        tabs[1].setAttribute('aria-selected', 'false');
    } else {
        registerTab.classList.add('active');
        loginTab.classList.remove('active');
        tabs[1].classList.add('active');
        tabs[1].setAttribute('aria-selected', 'true');
        tabs[0].classList.remove('active');
        tabs[0].setAttribute('aria-selected', 'false');
    }
}

function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
    }
}

function closeModal() {
    document.getElementById('info-modal').classList.remove('show');
}

function showModal(type) {
    const modal = document.getElementById('info-modal');
    const body = document.getElementById('modal-body');

    if (type === 'terms') {
        body.innerHTML = `
            <h2>Termos de Uso</h2>
            <p>O Referencial NCS 2030 – Selo de Conformidade é uma plataforma de autoavaliação ESG alinhada aos Objetivos de Desenvolvimento Sustentável (ODS) da Agenda 2030.</p>
            <p>Ao utilizar esta plataforma, você concorda que:</p>
            <ul>
                <li>Todas as informações fornecidas são precisas e verídicas</li>
                <li>Você tem autoridade para representar a empresa</li>
                <li>Utilizará a plataforma em conformidade com todas as leis aplicáveis</li>
                <li>Todo conteúdo está protegido por leis de direitos autorais</li>
            </ul>
        `;
    } else if (type === 'privacy') {
        body.innerHTML = `
            <h2>Política de Privacidade</h2>
            <p>Estamos em conformidade com a Lei Geral de Proteção de Dados (LGPD - Lei 13.709/2018).</p>
            <p><strong>Coleta de Dados:</strong> Coletamos informações que você nos fornece voluntariamente, incluindo dados da empresa e responsável.</p>
            <p><strong>Uso de Dados:</strong> Seus dados são utilizados exclusivamente para:</p>
            <ul>
                <li>Processar sua autoavaliação ESG</li>
                <li>Gerar relatórios e certificações</li>
                <li>Melhorar nossos serviços</li>
            </ul>
            <p><strong>Segurança:</strong> Seus dados são armazenados de forma segura e não são compartilhados com terceiros sem seu consentimento.</p>
            <p><strong>Seus Direitos:</strong> Você tem direito a acessar, corrigir, deletar ou portabilidade de seus dados.</p>
        `;
    }

    modal.classList.add('show');
}

function updateDate() {
    const dateEl = document.getElementById('dashboard-date');
    if (dateEl) {
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        const date = new Date().toLocaleDateString('pt-BR', options);
        dateEl.textContent = date;
    }
}

window.addEventListener('click', (e) => {
    const infoModal = document.getElementById('info-modal');
    if (e.target === infoModal) {
        infoModal.classList.remove('show');
    }
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeModal();
    }
});
