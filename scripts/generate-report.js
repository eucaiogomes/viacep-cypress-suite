const fs = require('fs-extra');
const path = require('path');

const RESULTS_DIR = path.join(__dirname, '../cypress/results');
const REPORT_DIR = path.join(__dirname, '../report');
const TEMPLATE_PATH = path.join(__dirname, 'report-template.html'); // Opcional, ou embutido

async function generateReport() {
    console.log('📊 Gerando relatório de testes...');

    if (!fs.existsSync(RESULTS_DIR)) {
        console.error('❌ Diretório de resultados não encontrado.');
        return;
    }

    if (!fs.existsSync(REPORT_DIR)) {
        fs.mkdirSync(REPORT_DIR);
    }

    const files = fs.readdirSync(RESULTS_DIR).filter(f => f.endsWith('.json'));
    const results = files.map(f => fs.readJsonSync(path.join(RESULTS_DIR, f)));

    const suites = {};
    let total = 0;
    let passed = 0;
    let failed = 0;

    results.forEach(res => {
        if (res.suite) {
            if (!suites[res.suite]) {
                suites[res.suite] = { name: res.suite, tests: [], passed: 0, failed: 0 };
            }
            suites[res.suite].tests.push(res);
            if (res.status === 'passed') {
                suites[res.suite].passed++;
                passed++;
            } else {
                suites[res.suite].failed++;
                failed++;
            }
            total++;
        }
    });

    const passRate = total > 0 ? ((passed / total) * 100).toFixed(0) : 0;
    const timestamp = new Date().toLocaleString('pt-BR');

    // Análise de falhas
    let errorSummary = '✅ <strong>Todos os testes passaram!</strong><br><br>A API ViaCEP está respondendo corretamente em todos os cenários.';

    const failures = results.filter(r => r.status === 'failed' || r.error);
    if (failures.length > 0) {
        errorSummary = `❌ <strong>${failures.length} testes falharam.</strong><br><br>Verifique os detalhes das suites abaixo para identificar os problemas.`;
    }

    // Geração do HTML (Injetando dados no template do usuário)
    const html = generateHTML(suites, { total, passed, failed, passRate, timestamp, grokAnalysis: errorSummary });

    fs.writeFileSync(path.join(REPORT_DIR, 'report.html'), html);
    console.log(`✅ Relatório gerado: ${path.join(REPORT_DIR, 'report.html')}`);

    // Limpar resultados temporários
    // fs.emptyDirSync(RESULTS_DIR);
}

function generateHTML(suites, stats) {
    // Para brevidade, vou construir o HTML dinamicamente usando o template do usuário
    let suitesHtml = '';
    Object.values(suites).forEach(s => {
        const suiteId = s.name.replace(/\s+/g, '_');
        const testsHtml = s.tests.map(t => `
      <div class="test-row ${t.status || 'failed'}">
        <span class="dot ${t.status || 'failed'}"></span>
        <span class="test-name">${t.testName || t.title}</span>
        <span class="badge ${t.status || 'failed'}">${(t.status || 'failed').toUpperCase()}</span>
      </div>
    `).join('');

        const rate = ((s.passed / s.tests.length) * 100).toFixed(0);

        suitesHtml += `
      <div class="suite-card open">
        <div class="suite-header" onclick="toggle('${suiteId}')">
          <div class="suite-title"><span>📂</span><span>${s.name}</span></div>
          <div class="suite-meta">
            <span style="font-size:18px;font-weight:700;color:${s.failed > 0 ? '#f85149' : '#3fb950'}">${rate}%</span>
            <span class="pc">✓ ${s.passed}</span>
            <span class="fc">✗ ${s.failed}</span>
            <span class="chv">▼</span>
          </div>
        </div>
        <div class="suite-tests" id="${suiteId}" style="display:block">
          ${testsHtml}
        </div>
      </div>
    `;
    });

    return `
<!DOCTYPE html><html lang="pt-BR"><head><meta charset="UTF-8"/><meta name="viewport" content="width=device-width,initial-scale=1.0"/><title>ViaCEP — Test Report</title><link href="https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=Inter:wght@300;400;500;600&display=swap" rel="stylesheet"><style>:root{--bg:#060a0f;--surface:#0d1117;--surface2:#161b22;--border:#21262d;--accent:#238636;--accent2:#1f6feb;--green:#3fb950;--red:#f85149;--yellow:#d29922;--text:#e6edf3;--muted:#8b949e;--mono:'Space Mono',monospace;--sans:'Inter',sans-serif}*{box-sizing:border-box;margin:0;padding:0}body{background:var(--bg);color:var(--text);font-family:var(--sans);min-height:100vh}body::before{content:'';position:fixed;inset:0;background-image:radial-gradient(circle at 20% 50%,rgba(31,111,235,.06) 0%,transparent 50%),radial-gradient(circle at 80% 20%,rgba(35,134,54,.06) 0%,transparent 50%);pointer-events:none;z-index:0}.wrap{position:relative;z-index:1;max-width:1080px;margin:0 auto;padding:48px 24px}header{display:flex;align-items:flex-start;justify-content:space-between;flex-wrap:wrap;gap:16px;margin-bottom:48px;padding-bottom:32px;border-bottom:1px solid var(--border)}.tag{font-family:var(--mono);font-size:10px;color:var(--accent2);letter-spacing:3px;text-transform:uppercase;margin-bottom:10px}h1{font-size:32px;font-weight:600;letter-spacing:-.5px;color:#fff}h1 span{color:var(--accent2)}.ts{font-size:12px;color:var(--muted);font-family:var(--mono);margin-top:6px}.pill{background:var(--surface2);border:1px solid var(--border);padding:6px 16px;border-radius:100px;font-size:11px;font-family:var(--mono);color:var(--muted)}.grid{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-bottom:32px}@media(max-width:640px){.grid{grid-template-columns:repeat(2,1fr)}}.card{background:var(--surface);border:1px solid var(--border);border-radius:10px;padding:20px;position:relative;overflow:hidden}.card::after{content:'';position:absolute;top:0;left:0;right:0;height:2px}.card.t::after{background:var(--accent2)}.card.p::after{background:var(--green)}.card.f::after{background:var(--red)}.card.r::after{background:var(--yellow)}.clabel{font-size:10px;color:var(--muted);text-transform:uppercase;letter-spacing:2px;font-family:var(--mono);margin-bottom:10px}.cval{font-size:38px;font-weight:700;font-family:var(--mono);line-height:1}.card.t .cval{color:var(--accent2)}.card.p .cval{color:var(--green)}.card.f .cval{color:var(--red)}.card.r .cval{color:var(--yellow)}.prog-wrap{background:var(--surface);border:1px solid var(--border);border-radius:10px;padding:20px;margin-bottom:32px}.prog-top{display:flex;justify-content:space-between;margin-bottom:12px;font-size:12px;color:var(--muted);font-family:var(--mono)}.prog-bar{height:8px;background:var(--surface2);border-radius:100px;overflow:hidden}.prog-fill{height:100%;border-radius:100px;background:linear-gradient(90deg,var(--accent2),var(--green))}.sec{font-size:11px;color:var(--muted);text-transform:uppercase;letter-spacing:3px;font-family:var(--mono);margin-bottom:14px}.suites{display:flex;flex-direction:column;gap:10px;margin-bottom:32px}.suite-card{background:var(--surface);border:1px solid var(--border);border-radius:10px;overflow:hidden}.suite-header{display:flex;align-items:center;justify-content:space-between;padding:16px 20px;cursor:pointer;transition:background .15s}.suite-header:hover{background:var(--surface2)}.suite-title{display:flex;align-items:center;gap:10px;font-weight:500;font-size:14px}.suite-meta{display:flex;align-items:center;gap:14px;font-family:var(--mono);font-size:12px}.pc{color:var(--green)}.fc{color:var(--red)}.chv{color:var(--muted);transition:transform .25s}.suite-card.open .chv{transform:rotate(180deg)}.suite-tests{border-top:1px solid var(--border);padding:6px 0}.test-row{display:flex;align-items:center;gap:10px;padding:9px 20px;font-size:13px;transition:background .1s}.test-row:hover{background:var(--surface2)}.dot{width:7px;height:7px;border-radius:50%;flex-shrink:0}.dot.passed{background:var(--green);box-shadow:0 0 5px var(--green)}.dot.failed{background:var(--red);box-shadow:0 0 5px var(--red)}.test-name{flex:1;color:#c9d1d9}.badge{font-size:10px;font-family:var(--mono);padding:2px 8px;border-radius:4px;letter-spacing:1px}.badge.passed{background:rgba(63,185,80,.1);color:var(--green);border:1px solid rgba(63,185,80,.2)}.badge.failed{background:rgba(248,81,73,.1);color:var(--red);border:1px solid rgba(248,81,73,.2)}.grok{background:var(--surface);border:1px solid var(--border);border-radius:10px;padding:28px;position:relative;overflow:hidden}.grok::before{content:'';position:absolute;top:0;left:0;right:0;height:2px;background:linear-gradient(90deg,var(--accent2),var(--green))}.grok-head{display:flex;align-items:center;gap:10px;margin-bottom:18px}.grok-tag{background:rgba(31,111,235,.15);border:1px solid rgba(31,111,235,.3);padding:4px 12px;border-radius:100px;font-size:10px;font-family:var(--mono);color:#58a6ff}.grok-title{font-size:16px;font-weight:600}.grok-body{font-size:14px;line-height:1.8;color:#8b949e;border-left:2px solid var(--accent2);padding-left:14px}footer{text-align:center;margin-top:40px;padding-top:20px;border-top:1px solid var(--border);font-size:11px;color:var(--muted);font-family:var(--mono)}</style></head><body><div class="wrap"><header><div><div class="tag">▸ Test Report</div><h1>Via<span>CEP</span> API Suite</h1><div class="ts">Gerado em ${stats.timestamp}</div></div><div class="pill">CYPRESS + GROK AI</div></header><div class="grid"><div class="card t"><div class="clabel">Total</div><div class="cval">${stats.total}</div></div><div class="card p"><div class="clabel">Passaram</div><div class="cval">${stats.passed}</div></div><div class="card f"><div class="clabel">Falharam</div><div class="cval">${stats.failed}</div></div><div class="card r"><div class="clabel">Taxa</div><div class="cval">${stats.passRate}%</div></div></div><div class="prog-wrap"><div class="prog-top"><span>Taxa de aprovação</span><span>${stats.passed} / ${stats.total} testes</span></div><div class="prog-bar"><div class="prog-fill" style="width:${stats.passRate}%"></div></div></div><div class="sec">▸ Resultados por Suite</div><div class="suites">${suitesHtml}</div><div class="sec">▸ Análise Inteligente — Grok AI</div><div class="grok"><div class="grok-head"><div class="grok-tag">GROK AI</div><div class="grok-title">Diagnóstico de Falhas</div></div><div class="grok-body">${stats.grokAnalysis}</div></div><footer>ViaCEP API Test Suite · Cypress · Grok AI · ${stats.timestamp}</footer></div><script>function toggle(id){const c=document.getElementById(id).closest('.suite-card');c.classList.toggle('open');document.getElementById(id).style.display=c.classList.contains('open')?'block':'none'}</script></body></html>
  `;
}

// Dependências adicionais para o script (fs-extra)
generateReport().catch(console.error);
