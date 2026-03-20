import { useState, useMemo } from 'react';
import { useData, categoryColors } from '../data';
import { Search, Plus, Trash2, X, Calendar } from 'lucide-react';

const categorieOptions = ['Salaris', 'Freelance', 'Investering', 'Uitkering', 'Anders'];

export default function Inkomsten() {
  const { income, expenses, addIncome, deleteIncome, contacts, selectedMonth, setSelectedMonth } = useData();
  const [search, setSearch] = useState('');
  const [sortKey, setSortKey] = useState('datum');
  const [sortDir, setSortDir] = useState('desc');
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ naam: '', categorie: 'Salaris', datum: '', omschrijving: '', bedrag: '' });

  // Generate list of months from data
  const availableMonths = useMemo(() => {
    const months = new Set();
    [...income, ...expenses].forEach(t => {
      if (t.datum) months.add(t.datum.substring(0, 7));
    });
    const now = new Date();
    months.add(`${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`);
    return Array.from(months).sort().reverse();
  }, [income, expenses]);

  const filtered = income
    .filter(i =>
      i.datum.startsWith(selectedMonth) && (
        i.categorie.toLowerCase().includes(search.toLowerCase()) ||
        i.omschrijving.toLowerCase().includes(search.toLowerCase()) ||
        i.naam.toLowerCase().includes(search.toLowerCase())
      )
    )
    .sort((a, b) => {
      let va = a[sortKey], vb = b[sortKey];
      if (sortKey === 'bedrag') return sortDir === 'asc' ? va - vb : vb - va;
      if (sortKey === 'datum') return sortDir === 'asc' ? new Date(va) - new Date(vb) : new Date(vb) - new Date(va);
      return sortDir === 'asc' ? String(va).localeCompare(String(vb)) : String(vb).localeCompare(String(va));
    });

  const totaalMaand = filtered.reduce((s, i) => s + i.bedrag, 0);
  const uitgavenMaand = expenses.filter(e => e.datum.startsWith(selectedMonth)).reduce((s, e) => s + e.bedrag, 0);
  const nettoMaand = totaalMaand - uitgavenMaand;

  const toggleSort = (key) => {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortKey(key); setSortDir('asc'); }
  };

  const formatDate = (d) => {
    const date = new Date(d);
    return date.toLocaleDateString('nl-NL', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    addIncome({ ...form, bedrag: parseFloat(form.bedrag) });
    setForm({ naam: '', categorie: 'Salaris', datum: '', omschrijving: '', bedrag: '' });
    setShowModal(false);
  };

  const sortIcon = (key) => sortKey === key ? (sortDir === 'asc' ? ' ↑' : ' ↓') : ' ↕';

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Inkomsten</h1>
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
        <button className="btn-add" onClick={() => setShowModal(true)}>
          <Plus size={18} /> Toevoegen
        </button>
      </div>

      <div className="summary-info-card">
        <p>
          Deze maand: <strong className="text-green">€{totaalMaand.toFixed(2)}</strong> binnengekomen 
          <span className="separator">|</span>
          Uitgaven: <span className="text-red">€{uitgavenMaand.toFixed(2)}</span>
          <span className="separator">|</span>
          Netto over: <strong className={nettoMaand >= 0 ? 'text-green' : 'text-red'}>€{nettoMaand.toFixed(2)}</strong>
        </p>
      </div>

      <div className="search-bar">
        <Search size={18} className="search-icon" />
        <input
          type="text"
          placeholder="Zoek transacties..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th onClick={() => toggleSort('naam')}>Naam{sortIcon('naam')}</th>
              <th onClick={() => toggleSort('categorie')}>Categorie{sortIcon('categorie')}</th>
              <th onClick={() => toggleSort('datum')}>Datum{sortIcon('datum')}</th>
              <th>Omschrijving</th>
              <th onClick={() => toggleSort('bedrag')}>Bedrag{sortIcon('bedrag')}</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(item => (
              <tr key={item.id}>
                <td>{item.naam}</td>
                <td>
                  <span style={{ 
                    display: 'inline-flex', 
                    alignItems: 'center', 
                    gap: '6px', 
                    padding: '2px 8px', 
                    borderRadius: '12px', 
                    backgroundColor: `${categoryColors[item.categorie] || categoryColors.Overig}15`, 
                    color: categoryColors[item.categorie] || categoryColors.Overig,
                    fontSize: '12px',
                    fontWeight: '500'
                  }}>
                    <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: categoryColors[item.categorie] || categoryColors.Overig }}></span>
                    {item.categorie}
                  </span>
                </td>
                <td>{formatDate(item.datum)}</td>
                <td>{item.omschrijving}</td>
                <td className="text-green">+€{item.bedrag.toFixed(2)}</td>
                <td>
                  <button className="btn-icon" onClick={() => deleteIncome(item.id)}>
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Inkomsten toevoegen</h2>
              <button className="btn-icon" onClick={() => setShowModal(false)}><X size={20} /></button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Naam</label>
                <select value={form.naam} onChange={e => setForm({ ...form, naam: e.target.value })} required>
                  <option value="" disabled>Selecteer een contact...</option>
                  {contacts.map(c => <option key={c.id} value={c.naam}>{c.naam}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Categorie</label>
                <select value={form.categorie} onChange={e => setForm({ ...form, categorie: e.target.value })}>
                  {categorieOptions.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Datum</label>
                <input type="date" required value={form.datum} onChange={e => setForm({ ...form, datum: e.target.value })} />
              </div>
              <div className="form-group">
                <label>Omschrijving</label>
                <input type="text" required value={form.omschrijving} onChange={e => setForm({ ...form, omschrijving: e.target.value })} />
              </div>
              <div className="form-group">
                <label>Bedrag (€)</label>
                <input type="number" step="0.01" min="0" required value={form.bedrag} onChange={e => setForm({ ...form, bedrag: e.target.value })} />
              </div>
              <button type="submit" className="btn-add" style={{ width: '100%' }}>Toevoegen</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
