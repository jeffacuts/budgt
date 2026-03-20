import { useMemo, useRef } from 'react';
import { useData, categoryColors } from '../data';
import { TrendingUp, TrendingDown, Wallet, Landmark, ArrowUpRight, Upload, Calendar } from 'lucide-react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from 'chart.js';
import { Doughnut, Bar } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

export default function Overzicht() {
  const { income, expenses, debts, selectedMonth, setSelectedMonth, refreshData } = useData();
  const fileInputRef = useRef(null);

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

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('http://localhost:8000/api/upload-bank', {
        method: 'POST',
        body: formData,
      });
      if (res.ok) {
        const data = await res.json();
        alert(data.status || "Bankgegevens succesvol bijgewerkt!");
        refreshData(); 
      } else {
        const errData = await res.json();
        alert(`Fout: ${errData.detail || "Upload mislukt"}`);
      }
    } catch (err) {
      console.error("Upload mislukt", err);
      alert("Er is iets misgegaan bij het uploaden.");
    }
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
          <input 
            type="file" 
            accept=".csv" 
            style={{ display: 'none' }} 
            ref={fileInputRef} 
            onChange={handleFileUpload} 
          />
          <button className="btn-add" onClick={() => fileInputRef.current.click()}>
            <Upload size={18} /> Importeer ASN CSV
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
