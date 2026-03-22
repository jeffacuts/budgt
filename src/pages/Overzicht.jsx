import { useMemo, useRef } from 'react';
import { useData, categoryColors } from '../data';
import { TrendingUp, TrendingDown, Wallet, Landmark, ArrowUpRight, Calendar, Download, Save } from 'lucide-react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from 'chart.js';
import { Doughnut, Bar } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

export default function Overzicht() {
  const { income, expenses, debts, contacts, selectedMonth, setSelectedMonth, refreshData } = useData();

  // Generate list of months from data
  const availableMonths = useMemo(() => {
    const months = new Set();
    [...income, ...expenses].forEach(t => {
      if (t.datum) months.add(t.datum.substring(0, 7));
    });
    // Add current month if not present
    const now = new Date();
    months.add(`${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`);
    return Array.from(months).sort().reverse();
  }, [income, expenses]);

  const filteredIncome = useMemo(() => 
    income.filter(i => i.datum.startsWith(selectedMonth)), 
  [income, selectedMonth]);

  const filteredExpenses = useMemo(() => 
    expenses.filter(e => e.datum.startsWith(selectedMonth)), 
  [expenses, selectedMonth]);

  const handleExport = () => {
    const printWindow = window.open('', '_blank');
    const now = new Date().toLocaleDateString('nl-NL', { day: 'numeric', month: 'long', year: 'numeric' });
    const [y, mm] = selectedMonth.split('-');
    const maandNaam = new Date(parseInt(y), parseInt(mm) - 1).toLocaleDateString('nl-NL', { month: 'long', year: 'numeric' });
    const maandLabel = maandNaam.charAt(0).toUpperCase() + maandNaam.slice(1);
    
    const filteredIncome = income.filter(i => i.datum.startsWith(selectedMonth));
    const filteredExpenses = expenses.filter(e => e.datum.startsWith(selectedMonth));
    
    const totalIncome = filteredIncome.reduce((sum, i) => sum + i.bedrag, 0);
    const totalExpenses = filteredExpenses.reduce((sum, e) => sum + e.bedrag, 0);
    const saldoReport = totalIncome - totalExpenses;
    const totalDebt = debts.reduce((sum, d) => sum + d.resterend, 0);
    const totalDebtOriginal = debts.reduce((sum, d) => sum + d.totaal, 0);

    const fmt = (n) => '€' + n.toLocaleString('nl-NL', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    const fmtDate = (d) => new Date(d).toLocaleDateString('nl-NL', { day: 'numeric', month: 'short', year: 'numeric' });

    const html = `
      <html>
        <head>
          <title>Budget Rapport - ${maandLabel}</title>
          <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { font-family: 'Inter', system-ui, sans-serif; color: #1a1a2e; padding: 0; line-height: 1.6; background: white; }
            
            .report { max-width: 800px; margin: 0 auto; padding: 48px 40px; }
            
            /* Header */
            .report-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 40px; padding-bottom: 24px; border-bottom: 3px solid #1a1a2e; }
            .report-brand { font-size: 32px; font-weight: 800; letter-spacing: -1px; color: #1a1a2e; }
            .report-brand span { color: #22c55e; }
            .report-title { font-size: 14px; color: #6b7280; margin-top: 4px; font-weight: 400; }
            .report-meta { text-align: right; font-size: 12px; color: #6b7280; line-height: 1.8; }
            .report-meta strong { color: #1a1a2e; font-weight: 600; }
            
            /* Summary Cards */
            .summary-strip { display: grid; grid-template-columns: repeat(4, 1fr); gap: 0; margin-bottom: 40px; border-radius: 12px; overflow: hidden; border: 1px solid #e5e7eb; }
            .s-card { padding: 20px; background: #fafafa; border-right: 1px solid #e5e7eb; }
            .s-card:last-child { border-right: none; }
            .s-card.highlight { background: #f0fdf4; }
            .s-card.danger { background: #fef2f2; }
            .s-label { font-size: 10px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.08em; color: #9ca3af; margin-bottom: 6px; }
            .s-value { font-size: 22px; font-weight: 700; color: #1a1a2e; }
            .s-value.green { color: #059669; }
            .s-value.red { color: #dc2626; }
            .s-sub { font-size: 10px; color: #9ca3af; margin-top: 4px; }
            
            /* Sections */
            .section { margin-bottom: 36px; }
            .section-header { display: flex; align-items: center; gap: 10px; margin-bottom: 14px; }
            .section-num { width: 28px; height: 28px; background: #1a1a2e; color: white; border-radius: 50%; font-size: 12px; font-weight: 700; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
            .section-title { font-size: 16px; font-weight: 700; color: #1a1a2e; }
            .section-subtitle { font-size: 11px; color: #9ca3af; margin-left: auto; }
            
            /* Tables */
            table { width: 100%; border-collapse: collapse; }
            thead th { text-align: left; padding: 10px 14px; font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em; color: #6b7280; background: #f8f9fa; border-bottom: 2px solid #e5e7eb; }
            thead th:last-child { text-align: right; }
            tbody td { padding: 12px 14px; font-size: 13px; color: #374151; border-bottom: 1px solid #f1f3f5; }
            tbody td:last-child { text-align: right; font-weight: 600; }
            tbody tr:hover { background: #fafbfc; }
            .total-row td { border-top: 2px solid #1a1a2e; border-bottom: none; font-weight: 700; font-size: 14px; color: #1a1a2e; padding-top: 14px; }
            .positive { color: #059669; }
            .negative { color: #dc2626; }
            .empty-row td { text-align: center !important; color: #9ca3af; font-style: italic; padding: 24px; }
            
            /* Progress bar */
            .progress-wrap { display: flex; align-items: center; gap: 10px; }
            .progress-bg { flex: 1; height: 8px; background: #e5e7eb; border-radius: 4px; overflow: hidden; }
            .progress-fg { height: 100%; background: #22c55e; border-radius: 4px; }
            .progress-pct { font-size: 12px; font-weight: 600; color: #374151; min-width: 40px; text-align: right; }
            
            /* Footer */
            .report-footer { margin-top: 48px; padding-top: 20px; border-top: 2px solid #f1f3f5; display: flex; justify-content: space-between; align-items: center; }
            .footer-left { font-size: 10px; color: #9ca3af; }
            .footer-right { font-size: 10px; color: #9ca3af; }
            .footer-brand { font-weight: 700; color: #6b7280; }
            
            /* Watermark */
            .watermark { position: fixed; bottom: 20px; right: 20px; font-size: 9px; color: #d1d5db; }
            
            /* Page break */
            .page-break { page-break-before: always; padding-top: 20px; }
            
            @media print {
              body { padding: 0; }
              .report { padding: 24px 20px; }
              .no-print { display: none; }
              tr { page-break-inside: avoid; }
              .section { page-break-inside: avoid; }
            }
          </style>
        </head>
        <body>
          <div class="report">
            <div class="report-header">
              <div>
                <div class="report-brand">Budget<span>.</span></div>
                <div class="report-title">Financieel Maandrapport</div>
              </div>
              <div class="report-meta">
                <strong>Periode:</strong> ${maandLabel}<br>
                <strong>Gegenereerd:</strong> ${now}<br>
                <strong>Door:</strong> Jeffrey Klein
              </div>
            </div>
            
            <div class="summary-strip">
              <div class="s-card highlight">
                <div class="s-label">Inkomsten</div>
                <div class="s-value green">${fmt(totalIncome)}</div>
                <div class="s-sub">${filteredIncome.length} transactie${filteredIncome.length !== 1 ? 's' : ''}</div>
              </div>
              <div class="s-card danger">
                <div class="s-label">Uitgaven</div>
                <div class="s-value red">${fmt(totalExpenses)}</div>
                <div class="s-sub">${filteredExpenses.length} transactie${filteredExpenses.length !== 1 ? 's' : ''}</div>
              </div>
              <div class="s-card">
                <div class="s-label">Netto Saldo</div>
                <div class="s-value ${saldoReport >= 0 ? 'green' : 'red'}">${fmt(saldoReport)}</div>
                <div class="s-sub">${saldoReport >= 0 ? 'Positief' : 'Negatief'}</div>
              </div>
              <div class="s-card">
                <div class="s-label">Openstaande Schuld</div>
                <div class="s-value red">${fmt(totalDebt)}</div>
                <div class="s-sub">van ${fmt(totalDebtOriginal)} totaal</div>
              </div>
            </div>

            <div class="section">
              <div class="section-header">
                <div class="section-num">1</div>
                <div class="section-title">Inkomsten</div>
                <div class="section-subtitle">Totaal: ${fmt(totalIncome)}</div>
              </div>
              <table>
                <thead><tr><th>Datum</th><th>Omschrijving</th><th>Categorie</th><th>Bedrag</th></tr></thead>
                <tbody>
                  ${filteredIncome.length === 0 ? '<tr class="empty-row"><td colspan="4">Geen inkomsten in deze periode</td></tr>' : ''}
                  ${filteredIncome.map(i => `
                    <tr>
                      <td>${fmtDate(i.datum)}</td>
                      <td>${i.omschrijving || i.naam}</td>
                      <td>${i.categorie}</td>
                      <td class="positive">${fmt(i.bedrag)}</td>
                    </tr>
                  `).join('')}
                  ${filteredIncome.length > 0 ? `<tr class="total-row"><td colspan="3">Subtotaal Inkomsten</td><td class="positive">${fmt(totalIncome)}</td></tr>` : ''}
                </tbody>
              </table>
            </div>

            <div class="section">
              <div class="section-header">
                <div class="section-num">2</div>
                <div class="section-title">Uitgaven</div>
                <div class="section-subtitle">Totaal: ${fmt(totalExpenses)}</div>
              </div>
              <table>
                <thead><tr><th>Datum</th><th>Omschrijving</th><th>Categorie</th><th>Bedrag</th></tr></thead>
                <tbody>
                  ${filteredExpenses.length === 0 ? '<tr class="empty-row"><td colspan="4">Geen uitgaven in deze periode</td></tr>' : ''}
                  ${filteredExpenses.map(e => `
                    <tr>
                      <td>${fmtDate(e.datum)}</td>
                      <td>${e.omschrijving || e.naam}</td>
                      <td>${e.categorie}</td>
                      <td class="negative">${fmt(e.bedrag)}</td>
                    </tr>
                  `).join('')}
                  ${filteredExpenses.length > 0 ? `<tr class="total-row"><td colspan="3">Subtotaal Uitgaven</td><td class="negative">${fmt(totalExpenses)}</td></tr>` : ''}
                </tbody>
              </table>
            </div>

            <div class="page-break"></div>

            <div class="section">
              <div class="section-header">
                <div class="section-num">3</div>
                <div class="section-title">Schulden Overzicht</div>
                <div class="section-subtitle">Resterend: ${fmt(totalDebt)}</div>
              </div>
              <table>
                <thead><tr><th>Schuldeiser</th><th>Oorspronkelijk</th><th>Resterend</th><th>Voortgang</th></tr></thead>
                <tbody>
                  ${debts.length === 0 ? '<tr class="empty-row"><td colspan="4">Geen schulden geregistreerd</td></tr>' : ''}
                  ${debts.map(d => {
                    const pct = Math.round((1 - d.resterend / d.totaal) * 100);
                    return `
                    <tr>
                      <td><strong>${d.schuldeiser}</strong>${d.subtekst ? '<br><span style="font-size:11px;color:#9ca3af">' + d.subtekst + '</span>' : ''}</td>
                      <td>${fmt(d.totaal)}</td>
                      <td class="negative">${fmt(d.resterend)}</td>
                      <td style="text-align:left">
                        <div class="progress-wrap">
                          <div class="progress-bg"><div class="progress-fg" style="width:${pct}%"></div></div>
                          <div class="progress-pct">${pct}%</div>
                        </div>
                      </td>
                    </tr>`;
                  }).join('')}
                  ${debts.length > 0 ? `<tr class="total-row"><td>Totaal</td><td>${fmt(totalDebtOriginal)}</td><td class="negative">${fmt(totalDebt)}</td><td></td></tr>` : ''}
                </tbody>
              </table>
            </div>

            <div class="section">
              <div class="section-header">
                <div class="section-num">4</div>
                <div class="section-title">Contacten</div>
                <div class="section-subtitle">${contacts.length} contact${contacts.length !== 1 ? 'en' : ''}</div>
              </div>
              <table>
                <thead><tr><th>Naam</th><th>IBAN</th><th>Contact</th><th>Kenmerk</th></tr></thead>
                <tbody>
                  ${contacts.length === 0 ? '<tr class="empty-row"><td colspan="4">Geen contacten geregistreerd</td></tr>' : ''}
                  ${contacts.map(c => `
                    <tr>
                      <td><strong>${c.naam}</strong></td>
                      <td style="font-family:monospace;font-size:12px">${c.iban || '—'}</td>
                      <td>${c.telefoon || ''}${c.telefoon && c.email ? '<br>' : ''}${c.email || ''}${!c.telefoon && !c.email ? '—' : ''}</td>
                      <td>${c.kenmerk || '—'}</td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>

            <div class="report-footer">
              <div class="footer-left">
                <span class="footer-brand">Budget</span> — Persoonlijk Financieel Beheer<br>
                Dit rapport is automatisch gegenereerd en dient uitsluitend ter informatie.
              </div>
              <div class="footer-right">
                Pagina 1 van 2<br>
                ${now}
              </div>
            </div>
          </div>
          
          <script>
            window.onload = () => { setTimeout(() => { window.print(); }, 600); };
          </script>
        </body>
      </html>
    `;

    printWindow.document.write(html);
    printWindow.document.close();
  };

  const handleDownloadCSV = () => {
    const filteredIncome = income.filter(i => i.datum.startsWith(selectedMonth));
    const filteredExpenses = expenses.filter(e => e.datum.startsWith(selectedMonth));

    const rows = [
      ["BUDGT FINANCIEEL RAPPORT"],
      ["Periode", selectedMonth],
      ["Gegenereerd op", new Date().toLocaleDateString('nl-NL')],
      [],
      ["1. INKOMSTEN"],
      ["Datum", "Omschrijving", "Categorie", "Bedrag"],
      ...filteredIncome.map(i => [i.datum, i.naam, i.categorie, i.bedrag.toFixed(2)]),
      [],
      ["2. UITGAVEN"],
      ["Datum", "Omschrijving", "Categorie", "Bedrag"],
      ...filteredExpenses.map(e => [e.datum, e.naam, e.categorie, e.bedrag.toFixed(2)]),
      [],
      ["3. SCHULDEN ANALYSIS"],
      ["Schuldeiser", "Totaal", "Resterend", "Afgelost %"],
      ...debts.map(d => [d.schuldeiser, d.totaal.toFixed(2), d.resterend.toFixed(2), ((1 - d.resterend / d.totaal) * 100).toFixed(0) + "%"]),
      [],
      ["4. CONTACTENLIST"],
      ["Naam", "Email", "Telefoon", "IBAN", "Kenmerk"],
      ...contacts.map(c => [c.naam, c.email || "-", c.telefoon || "-", c.iban || "-", c.kenmerk || "-"]),
    ];

    const csvContent = "data:text/csv;charset=utf-8," 
      + rows.map(e => e.join(",")).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `budgt_rapport_${selectedMonth}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const totaalInkomsten = filteredIncome.reduce((s, i) => s + i.bedrag, 0);
  const totaalUitgaven = filteredExpenses.reduce((s, i) => s + i.bedrag, 0);
  const saldo = totaalInkomsten - totaalUitgaven;
  const openstaandeSchuld = debts.reduce((s, d) => s + d.resterend, 0);

  const categorieData = useMemo(() => {
    const cats = {};
    filteredExpenses.forEach(e => {
      cats[e.categorie] = (cats[e.categorie] || 0) + e.bedrag;
    });
    return {
      labels: Object.keys(cats),
      datasets: [{
        data: Object.values(cats),
        backgroundColor: Object.keys(cats).map(c => categoryColors[c] || categoryColors.Overig),
        borderWidth: 0,
        cutout: '65%',
      }]
    };
  }, [filteredExpenses]);

  const barData = useMemo(() => {
    // Show last 3 months including selected one
    const date = new Date(selectedMonth + "-01");
    const monthKeys = [];
    for (let i = 2; i >= 0; i--) {
      const d = new Date(date.getFullYear(), date.getMonth() - i, 1);
      monthKeys.push(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`);
    }

    const incomeByMonth = monthKeys.map(m =>
      income.filter(i => i.datum.startsWith(m)).reduce((s, i) => s + i.bedrag, 0)
    );
    const expenseByMonth = monthKeys.map(m =>
      expenses.filter(i => i.datum.startsWith(m)).reduce((s, i) => s + i.bedrag, 0)
    );

    return {
      labels: monthKeys.map(m => {
        const [y, mm] = m.split('-');
        const d = new Date(parseInt(y), parseInt(mm) - 1);
        return d.toLocaleDateString('nl-NL', { month: 'short', year: '2-digit' });
      }),
      datasets: [
        {
          label: 'Inkomsten',
          data: incomeByMonth,
          backgroundColor: categoryColors.Salaris,
          borderRadius: 4,
          barPercentage: 0.6,
        },
        {
          label: 'Uitgaven',
          data: expenseByMonth,
          backgroundColor: categoryColors.Verzekering,
          borderRadius: 4,
          barPercentage: 0.6,
        },
      ]
    };
  }, [income, expenses, selectedMonth]);

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: 'rgba(15, 23, 42, 0.9)',
        padding: 12,
        cornerRadius: 12,
        titleFont: { family: 'Outfit', size: 14 },
        bodyFont: { family: 'Outfit', size: 13 },
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: { color: 'rgba(255, 255, 255, 0.05)', drawBorder: false },
        ticks: { color: '#94a3b8', font: { family: 'Outfit', size: 11 } }
      },
      x: {
        grid: { display: false },
        ticks: { color: '#94a3b8', font: { family: 'Outfit', size: 11 } }
      },
    },
  };

  const donutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: 'rgba(15, 23, 42, 0.9)',
        padding: 12,
        cornerRadius: 12,
      }
    },
    cutout: '75%',
    borderWidth: 0,
    hoverOffset: 15,
  };

  const recentTransactions = useMemo(() => {
    const all = [
      ...filteredIncome.map(i => ({ ...i, type: 'income' })),
      ...filteredExpenses.map(e => ({ ...e, type: 'expense' })),
    ];
    all.sort((a, b) => new Date(b.datum) - new Date(a.datum));
    return all.slice(0, 5);
  }, [filteredIncome, filteredExpenses]);

  const formatDate = (d) => {
    const date = new Date(d);
    return date.toLocaleDateString('nl-NL', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Overzicht</h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
            <Calendar size={16} color="var(--text-muted)" />
            <select 
              value={selectedMonth} 
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="month-select"
            >
              {availableMonths.map(m => {
                const [y, mm] = m.split('-');
                const d = new Date(parseInt(y), parseInt(mm) - 1);
                const label = d.toLocaleDateString('nl-NL', { month: 'long', year: 'numeric' });
                return <option key={m} value={m}>{label.charAt(0).toUpperCase() + label.slice(1)}</option>;
              })}
            </select>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button className="btn-add" onClick={handleExport} style={{ backgroundColor: '#1e1e1e' }}>
            <Download size={18} /> Printen
          </button>
          <button className="btn-add" onClick={handleDownloadCSV} style={{ backgroundColor: 'var(--primary)' }}>
            <Save size={18} /> Exporteer
          </button>
        </div>
      </div>

      <div className="summary-cards">
        <div className="summary-card card-green">
          <div className="card-info">
            <span className="card-label">INKOMSTEN</span>
            <span className="card-value text-green">€{totaalInkomsten.toFixed(2)}</span>
          </div>
          <div className="card-icon green">
            <TrendingUp size={22} />
          </div>
        </div>
        <div className="summary-card card-red">
          <div className="card-info">
            <span className="card-label">UITGAVEN</span>
            <span className="card-value text-red">€{totaalUitgaven.toFixed(2)}</span>
          </div>
          <div className="card-icon red">
            <TrendingDown size={22} />
          </div>
        </div>
        <div className="summary-card card-gray">
          <div className="card-info">
            <span className="card-label">SALDO</span>
            <span className="card-value">€{saldo.toFixed(2)}</span>
          </div>
          <div className="card-icon gray">
            <Wallet size={22} />
          </div>
        </div>
        <div className="summary-card card-danger">
          <div className="card-info">
            <span className="card-label">OPENSTAANDE SCHULD</span>
            <span className="card-value text-red">€{openstaandeSchuld.toFixed(2)}</span>
          </div>
          <div className="card-icon danger">
            <Landmark size={22} />
          </div>
        </div>
      </div>

      <div className="charts-row">
        <div className="chart-card">
          <h3>Uitgavenverdeling</h3>
          <div className="chart-wrapper donut-wrapper">
            <Doughnut data={categorieData} options={donutOptions} />
          </div>
          <div className="chart-legend">
            {Object.keys(categorieData.labels).length > 0 ? categorieData.labels.map((label, idx) => (
              <div key={label} className="legend-item">
                <span className="legend-dot" style={{ backgroundColor: categorieData.datasets[0].backgroundColor[idx] }}></span>
                <span>{label}</span>
              </div>
            )) : <div className="legend-item"><span className="legend-dot" style={{ backgroundColor: '#9ca3af' }}></span><span>Geen data</span></div>}
          </div>
        </div>
        <div className="chart-card">
          <h3>Inkomsten vs Uitgaven</h3>
          <div className="chart-wrapper bar-wrapper">
            <Bar data={barData} options={barOptions} />
          </div>
        </div>
      </div>

      <div className="recent-card">
        <h3>Recente transacties</h3>
        <div className="recent-list">
          {recentTransactions.map(t => (
            <div key={`${t.type}-${t.id}`} className="recent-item">
              <div className="recent-icon-wrap">
                <div className={`recent-icon ${t.type === 'income' ? 'green' : 'red'}`}>
                  <ArrowUpRight size={18} style={{ transform: t.type === 'income' ? 'rotate(0)' : 'rotate(180deg)' }} />
                </div>
              </div>
              <div className="recent-info">
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span className="recent-name">{t.naam !== '—' ? t.naam : t.omschrijving}</span>
                  <span style={{ 
                    padding: '1px 6px', 
                    borderRadius: '4px', 
                    backgroundColor: `${categoryColors[t.categorie] || categoryColors.Overig}20`, 
                    color: categoryColors[t.categorie] || categoryColors.Overig,
                    fontSize: '10px',
                    fontWeight: 'bold',
                    textTransform: 'uppercase'
                  }}>
                    {t.categorie}
                  </span>
                </div>
                <span className="recent-date">{formatDate(t.datum)}</span>
              </div>
              <span className={t.type === 'income' ? 'text-green' : 'text-red'} style={{ fontWeight: '600' }}>
                {t.type === 'income' ? '+' : '-'}€{t.bedrag.toFixed(2)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
