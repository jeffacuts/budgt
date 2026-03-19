import { useMemo, useRef } from 'react';
import { useData } from '../data';
import { TrendingUp, TrendingDown, Wallet, Landmark, ArrowUpRight, Upload } from 'lucide-react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from 'chart.js';
import { Doughnut, Bar } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

const categoryColors = {
  Boodschappen: '#3b82f6',
  Transport: '#f59e0b',
  Huur: '#2563eb',
  Verzekering: '#ef4444',
  Abonnementen: '#6b7280',
  Horeca: '#ec4899',
  Kleding: '#22c55e',
};

export default function Overzicht() {
  const { income, expenses, debts, fetchTransactions } = useData();
  const fileInputRef = useRef(null);

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('http://localhost:8000/upload-bank', {
        method: 'POST',
        body: formData,
      });
      if (res.ok) {
        alert("Bankgegevens succesvol bijgewerkt!");
        fetchTransactions(); // Refresh the list
      }
    } catch (err) {
      console.error("Upload mislukt", err);
      alert("Er is iets misgegaan bij het uploaden.");
    }
  };

  const totaalInkomsten = income.reduce((s, i) => s + i.bedrag, 0);
  const totaalUitgaven = expenses.reduce((s, i) => s + i.bedrag, 0);
  const saldo = totaalInkomsten - totaalUitgaven;
  const openstaandeSchuld = debts.reduce((s, d) => s + d.resterend, 0);

  const categorieData = useMemo(() => {
    const cats = {};
    expenses.forEach(e => {
      cats[e.categorie] = (cats[e.categorie] || 0) + e.bedrag;
    });
    return {
      labels: Object.keys(cats),
      datasets: [{
        data: Object.values(cats),
        backgroundColor: Object.keys(cats).map(c => categoryColors[c] || '#9ca3af'),
        borderWidth: 0,
        cutout: '65%',
      }]
    };
  }, [expenses]);

  const barData = useMemo(() => {
    const months = ['jan. 26', 'feb. 26', 'mrt. 26'];
    const monthKeys = ['2026-01', '2026-02', '2026-03'];

    const incomeByMonth = monthKeys.map(m =>
      income.filter(i => i.datum.startsWith(m)).reduce((s, i) => s + i.bedrag, 0)
    );
    const expenseByMonth = monthKeys.map(m =>
      expenses.filter(i => i.datum.startsWith(m)).reduce((s, i) => s + i.bedrag, 0)
    );

    return {
      labels: months,
      datasets: [
        {
          label: 'Inkomsten',
          data: incomeByMonth,
          backgroundColor: '#22c55e',
          borderRadius: 4,
          barPercentage: 0.6,
        },
        {
          label: 'Uitgaven',
          data: expenseByMonth,
          backgroundColor: '#ef4444',
          borderRadius: 4,
          barPercentage: 0.6,
        },
      ]
    };
  }, [income, expenses]);

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: { color: '#f3f4f6' },
      },
      x: {
        grid: { display: false },
      },
    },
  };

  const donutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
    },
  };

  const recentTransactions = useMemo(() => {
    const all = [
      ...income.map(i => ({ ...i, type: 'income' })),
      ...expenses.map(e => ({ ...e, type: 'expense' })),
    ];
    all.sort((a, b) => new Date(b.datum) - new Date(a.datum));
    return all.slice(0, 5);
  }, [income, expenses]);

  const formatDate = (d) => {
    const date = new Date(d);
    return date.toLocaleDateString('nl-NL', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  return (
    <div className="page">
      <div className="page-header" style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h1>Overzicht</h1>
          <p className="page-subtitle" style={{ color: '#6b7280' }}>Je financiële situatie op een rij</p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <input 
            type="file" 
            accept=".csv" 
            style={{ display: 'none' }} 
            ref={fileInputRef} 
            onChange={handleFileUpload} 
          />
          <button className="btn-add" onClick={() => fileInputRef.current.click()} style={{ backgroundColor: '#1e293b' }}>
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
            {Object.entries(categoryColors).map(([label, color]) => (
              <div key={label} className="legend-item">
                <span className="legend-dot" style={{ backgroundColor: color }}></span>
                <span>{label}</span>
              </div>
            ))}
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
                <span className="recent-name">{t.categorie}</span>
                <span className="recent-date">{formatDate(t.datum)}</span>
              </div>
              <span className={t.type === 'income' ? 'text-green' : 'text-red'}>
                {t.type === 'income' ? '+' : '-'}€{t.bedrag.toFixed(2)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
