import { useState } from 'react';
import { useData } from '../data';
import { Search, Plus, Trash2, X } from 'lucide-react';

const categorieOptions = ['Boodschappen', 'Transport', 'Huur', 'Verzekering', 'Abonnementen', 'Horeca', 'Kleding', 'Anders'];

export default function Uitgaven() {
  const { expenses, addExpense, deleteExpense, contacts } = useData();
  const [search, setSearch] = useState('');
  const [sortKey, setSortKey] = useState('datum');
  const [sortDir, setSortDir] = useState('desc');
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ naam: '', categorie: 'Boodschappen', datum: '', omschrijving: '', bedrag: '' });

  const totaal = expenses.reduce((s, i) => s + i.bedrag, 0);

  const filtered = expenses
    .filter(i =>
      i.categorie.toLowerCase().includes(search.toLowerCase()) ||
      i.omschrijving.toLowerCase().includes(search.toLowerCase()) ||
      i.naam.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      let va = a[sortKey], vb = b[sortKey];
      if (sortKey === 'bedrag') return sortDir === 'asc' ? va - vb : vb - va;
      if (sortKey === 'datum') return sortDir === 'asc' ? new Date(va) - new Date(vb) : new Date(vb) - new Date(va);
      return sortDir === 'asc' ? String(va).localeCompare(String(vb)) : String(vb).localeCompare(String(va));
    });

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
    addExpense({ ...form, bedrag: parseFloat(form.bedrag) });
    setForm({ naam: '', categorie: 'Boodschappen', datum: '', omschrijving: '', bedrag: '' });
    setShowModal(false);
  };

  const sortIcon = (key) => sortKey === key ? (sortDir === 'asc' ? ' ↑' : ' ↓') : ' ↕';

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Uitgaven</h1>
          <p className="page-subtitle">Totaal: <span className="text-red">€{totaal.toFixed(2)}</span></p>
        </div>
        <button className="btn-add" onClick={() => setShowModal(true)}>
          <Plus size={18} /> Toevoegen
        </button>
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
                <td>{item.categorie}</td>
                <td>{formatDate(item.datum)}</td>
                <td>{item.omschrijving}</td>
                <td className="text-red">- €{item.bedrag.toFixed(2)}</td>
                <td>
                  <button className="btn-icon" onClick={() => deleteExpense(item.id)}>
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
              <h2>Uitgaven toevoegen</h2>
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
