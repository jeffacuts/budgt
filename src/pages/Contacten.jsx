import { useState } from 'react';
import { useData } from '../data';
import { Search, Plus, Trash2, X } from 'lucide-react';

export default function Contacten() {
  const { contacts, addContact, deleteContact } = useData();
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ naam: '', email: '', telefoon: '', iban: '', kenmerk: '', notities: '' });

  const filtered = contacts.filter(c =>
    c.naam.toLowerCase().includes(search.toLowerCase()) ||
    (c.email && c.email.toLowerCase().includes(search.toLowerCase()))
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    addContact({ ...form });
    setForm({ naam: '', email: '', telefoon: '', iban: '', kenmerk: '', notities: '' });
    setShowModal(false);
  };

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Contacten</h1>
          <p className="page-subtitle text-green">{contacts.length} contacten</p>
        </div>
        <button className="btn-add" onClick={() => setShowModal(true)}>
          <Plus size={18} /> Toevoegen
        </button>
      </div>
      <div className="search-bar">
        <Search size={18} className="search-icon" />
        <input type="text" placeholder="Zoek contacten..." value={search} onChange={e => setSearch(e.target.value)} />
      </div>
      {filtered.length === 0 ? (
        <div className="empty-state">Geen contacten gevonden</div>
      ) : (
        <div className="table-container">
          <table>
            <thead><tr><th>Naam</th><th>Email</th><th>Telefoon</th><th>IBAN</th><th>Kenmerk/Omschrijving</th><th>Notities</th><th></th></tr></thead>
            <tbody>
              {filtered.map(c => (
                <tr key={c.id}>
                  <td>{c.naam}</td><td>{c.email}</td><td>{c.telefoon}</td><td>{c.iban}</td><td>{c.kenmerk}</td><td>{c.notities}</td>
                  <td><button className="btn-icon" onClick={() => deleteContact(c.id)}><Trash2 size={16} /></button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Contact toevoegen</h2>
              <button className="btn-icon" onClick={() => setShowModal(false)}><X size={20} /></button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group"><label>Naam</label><input type="text" required value={form.naam} onChange={e => setForm({...form, naam: e.target.value})} /></div>
              <div className="form-group"><label>Email</label><input type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} /></div>
              <div className="form-group"><label>Telefoon</label><input type="tel" value={form.telefoon} onChange={e => setForm({...form, telefoon: e.target.value})} /></div>
              <div className="form-group"><label>IBAN</label><input type="text" value={form.iban} onChange={e => setForm({...form, iban: e.target.value})} placeholder="bijv. NL00 INGB 0000 0000 00" /></div>
              <div className="form-group"><label>Kenmerk / Omschrijving</label><input type="text" value={form.kenmerk} onChange={e => setForm({...form, kenmerk: e.target.value})} placeholder="bijv. Dossiernummer" /></div>
              <div className="form-group"><label>Notities</label><input type="text" value={form.notities} onChange={e => setForm({...form, notities: e.target.value})} placeholder="bijv. Bewindvoerder" /></div>
              <button type="submit" className="btn-add" style={{width:'100%'}}>Toevoegen</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
