import { useState } from 'react';
import { useData } from '../data';
import { Search, Plus, Trash2, Clock, X, Check } from 'lucide-react';

export default function Schulden() {
  const { debts, addDebt, deleteDebt, updateDebt, contacts } = useData();
  const [editingDebt, setEditingDebt] = useState(null);
  const [editForm, setEditForm] = useState({ regeling: '', betaaldatum: '' });
  const [search, setSearch] = useState('');
  const [sortKey, setSortKey] = useState(null);
  const [sortDir, setSortDir] = useState('asc');
  const [showModal, setShowModal] = useState(false);
  const [activeTooltip, setActiveTooltip] = useState(null);
  const [form, setForm] = useState({
    schuldeiser: '', subtekst: '', totaal: '', regeling: '', betaaldatum: '', resterend: ''
  });

  const openstaand = debts.reduce((s, d) => s + d.resterend, 0);
  const afgelost = debts.reduce((s, d) => s + (d.totaal - d.resterend), 0);
  const totaalBedrag = debts.reduce((s, d) => s + d.totaal, 0);
  const totaalRegeling = debts.reduce((s, d) => s + (d.regeling || 0), 0);

  const maxMonthsLeft = debts.reduce((max, d) => {
    if (d.resterend > 0 && d.regeling > 0) {
      const months = Math.ceil(d.resterend / d.regeling);
      return months > max ? months : max;
    }
    return max;
  }, 0);

  let debtFreeString = null;
  if (maxMonthsLeft > 0) {
    const futureDate = new Date();
    futureDate.setMonth(futureDate.getMonth() + maxMonthsLeft);
    debtFreeString = futureDate.toLocaleDateString('nl-NL', { month: 'long', year: 'numeric' });
  }

  const filtered = debts.filter(d =>
    d.schuldeiser.toLowerCase().includes(search.toLowerCase())
  );

  const toggleSort = (key) => {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortKey(key); setSortDir('asc'); }
  };

  const sorted = sortKey ? [...filtered].sort((a, b) => {
    let va = a[sortKey], vb = b[sortKey];
    if (typeof va === 'number' && typeof vb === 'number') return sortDir === 'asc' ? va - vb : vb - va;
    return sortDir === 'asc' ? String(va || '').localeCompare(String(vb || '')) : String(vb || '').localeCompare(String(va || ''));
  }) : filtered;

  const handleSubmit = (e) => {
    e.preventDefault();
    addDebt({
      schuldeiser: form.schuldeiser,
      subtekst: form.subtekst,
      totaal: parseFloat(form.totaal),
      regeling: form.regeling ? parseFloat(form.regeling) : null,
      betaaldatum: form.betaaldatum ? parseInt(form.betaaldatum) : null,
      resterend: parseFloat(form.resterend),
    });
    setForm({ schuldeiser: '', subtekst: '', totaal: '', regeling: '', betaaldatum: '', resterend: '' });
    setShowModal(false);
  };

  const handleContactSelect = (e) => {
    const selectedName = e.target.value;
    const contact = contacts.find(c => c.naam === selectedName);
    let newSubtekst = form.subtekst;

    if (contact) {
      if (contact.kenmerk) newSubtekst = contact.kenmerk;
      else if (contact.notities) newSubtekst = contact.notities;
    }

    setForm({ ...form, schuldeiser: selectedName, subtekst: newSubtekst });
  };

  const sortIcon = (key) => sortKey === key ? (sortDir === 'asc' ? ' ↑' : ' ↓') : ' ↕';

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Schulden</h1>
          <p className="page-subtitle">
            Openstaand: <span className="text-red">€{openstaand.toFixed(2)}</span> · Afgelost: <span className="text-green">€{afgelost.toFixed(2)}</span>
          </p>
        </div>
        <button className="btn-add" onClick={() => setShowModal(true)}>
          <Plus size={18} /> Toevoegen
        </button>
      </div>

      <div className="search-bar">
        <Search size={18} className="search-icon" />
        <input
          type="text"
          placeholder="Zoek schulden..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th onClick={() => toggleSort('schuldeiser')}>Schuldeiser{sortIcon('schuldeiser')}</th>
              <th onClick={() => toggleSort('totaal')}>Totaal{sortIcon('totaal')}</th>
              <th onClick={() => toggleSort('regeling')}>Regeling/mnd{sortIcon('regeling')}</th>
              <th>Voortgang</th>
              <th onClick={() => toggleSort('resterend')}>Resterend{sortIcon('resterend')}</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {sorted.map(debt => {
              const progress = Math.round(((debt.totaal - debt.resterend) / debt.totaal) * 100);
              const monthsLeft = debt.regeling && debt.regeling > 0 ? Math.ceil(debt.resterend / debt.regeling) : null;
              
              return (
                <tr key={debt.id}>
                  <td>
                    <div className="debt-name" style={{ position: 'relative' }}>
                      <strong 
                        className="hover-underline"
                        onClick={() => setActiveTooltip(activeTooltip === debt.id ? null : debt.id)}
                      >
                        {debt.schuldeiser}
                      </strong>
                      {debt.subtekst && <span className="debt-sub">{debt.subtekst}</span>}
                      
                      {activeTooltip === debt.id && (
                        <div className="contact-tooltip">
                          {(() => {
                            const c = contacts.find(c => c.naam === debt.schuldeiser);
                            if (!c) return <div className="tooltip-inner" style={{color: '#9ca3af', fontSize: '12px'}}>Geen contactgegevens gevonden.</div>;
                            return (
                              <div className="tooltip-inner">
                                <button className="tooltip-close" onClick={() => setActiveTooltip(null)}><X size={14}/></button>
                                <h4 style={{ margin: '0 0 4px 0', fontSize: '13px', color: '#1e1e1e' }}>Contactdetails</h4>
                                {c.iban && <div style={{ fontSize: '12px', color: '#374151' }}><strong>IBAN:</strong> {c.iban}</div>}
                                {c.email && <div style={{ fontSize: '12px', color: '#374151' }}><strong>Email:</strong> {c.email}</div>}
                                {c.telefoon && <div style={{ fontSize: '12px', color: '#374151' }}><strong>Tel:</strong> {c.telefoon}</div>}
                                {!c.iban && !c.email && !c.telefoon && <div style={{ fontSize: '12px', color: '#9ca3af' }}>Geen extra gegevens bekend.</div>}
                              </div>
                            );
                          })()}
                        </div>
                      )}
                    </div>
                  </td>
                  <td>€{debt.totaal.toFixed(2)}</td>
                  <td 
                    onClick={() => {
                      if (editingDebt !== debt.id) {
                        setEditingDebt(debt.id);
                        setEditForm({ regeling: debt.regeling || '', betaaldatum: debt.betaaldatum || '' });
                      }
                    }}
                    style={{ cursor: editingDebt === debt.id ? 'default' : 'pointer', verticalAlign: 'middle' }}
                  >
                    {editingDebt === debt.id ? (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }} onClick={e => e.stopPropagation()}>
                        <span style={{color: '#6b7280'}}>€</span>
                        <input
                          type="number"
                          step="0.01"
                          style={{ width: '60px', padding: '2px 4px', border: '1px solid #ccc', borderRadius: '4px', fontSize: '13px' }}
                          value={editForm.regeling}
                          onChange={e => setEditForm(prev => ({ ...prev, regeling: e.target.value }))}
                          placeholder="Bedrag"
                          autoFocus
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                               updateDebt(debt.id, {
                                 regeling: editForm.regeling ? parseFloat(editForm.regeling) : null,
                                 betaaldatum: editForm.betaaldatum ? parseInt(editForm.betaaldatum, 10) : null
                               });
                               setEditingDebt(null);
                            }
                          }}
                        />
                        <span style={{ fontSize: '11px', color: '#6b7280', marginLeft: '4px' }}>dag:</span>
                        <input
                          type="number"
                          min="1"
                          max="31"
                          style={{ width: '40px', padding: '2px 4px', border: '1px solid #ccc', borderRadius: '4px', fontSize: '13px' }}
                          value={editForm.betaaldatum}
                          onChange={e => setEditForm(prev => ({ ...prev, betaaldatum: e.target.value }))}
                          placeholder="-"
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                               updateDebt(debt.id, {
                                 regeling: editForm.regeling ? parseFloat(editForm.regeling) : null,
                                 betaaldatum: editForm.betaaldatum ? parseInt(editForm.betaaldatum, 10) : null
                               });
                               setEditingDebt(null);
                            }
                          }}
                        />
                        <button 
                          className="btn-icon" 
                          style={{ color: '#16a34a', padding: '2px', marginLeft: '2px' }}
                          onClick={(e) => {
                            e.stopPropagation();
                            updateDebt(debt.id, {
                              regeling: editForm.regeling ? parseFloat(editForm.regeling) : null,
                              betaaldatum: editForm.betaaldatum ? parseInt(editForm.betaaldatum, 10) : null
                            });
                            setEditingDebt(null);
                          }}
                        >
                          <Check size={16} />
                        </button>
                      </div>
                    ) : (
                      <div className="hover-underline" title="Klik om aan te passen" style={{ display: 'inline-block' }}>
                        {debt.regeling ? (
                          <>
                            €{debt.regeling.toFixed(2)}
                            {debt.betaaldatum && <span style={{ fontSize: '12px', color: '#6b7280', marginLeft: '6px' }}>(elke {debt.betaaldatum}e)</span>}
                          </>
                        ) : '—'}
                      </div>
                    )}
                  </td>
                  <td>
                    <div className="progress-cell">
                      <div className="progress-bar">
                        <div
                          className="progress-fill"
                          style={{ width: `${progress}%` }}
                        ></div>
                      </div>
                      <span className="progress-text">{progress}%</span>
                    </div>
                  </td>
                  <td className="text-orange">
                    <div>€{debt.resterend.toFixed(2)}</div>
                    {monthsLeft && (
                      <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '2px' }}>
                        Nog {monthsLeft} mnd
                      </div>
                    )}
                  </td>
                  <td>
                    <div className="action-btns">
                      <button className="btn-icon"><Clock size={16} /></button>
                      <button className="btn-icon" onClick={() => deleteDebt(debt.id)}>
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
            <tr className="totaal-row">
              <td style={{ verticalAlign: 'top' }}><strong>Overzicht</strong></td>
              <td style={{ verticalAlign: 'top' }}>
                <div style={{ fontSize: '11px', color: '#9ca3af', textTransform: 'uppercase', marginBottom: '2px', fontWeight: 400 }}>Totale Schuld</div>
                <div style={{ fontWeight: 600, color: '#1e1e1e' }}>€{totaalBedrag.toFixed(2)}</div>
              </td>
              <td style={{ verticalAlign: 'top' }}>
                <div style={{ color: '#15803d', fontWeight: 700 }}>
                  <span style={{ fontWeight: 400, fontSize: '12px', color: '#6b7280', marginRight: '4px' }}>Totaal p/m</span>
                  €{totaalRegeling.toFixed(2)}
                </div>
              </td>
              <td style={{ verticalAlign: 'top' }}>
                <div style={{ fontSize: '11px', color: '#9ca3af', textTransform: 'uppercase', marginBottom: '2px', fontWeight: 400 }}>Totaal Afgelost</div>
                <div style={{ color: '#16a34a', fontWeight: 600 }}>€{afgelost.toFixed(2)}</div>
              </td>
              <td className="text-red" style={{ verticalAlign: 'top' }}>
                <div style={{ fontSize: '11px', color: '#9ca3af', textTransform: 'uppercase', marginBottom: '2px', fontWeight: 400 }}>Openstaand Saldo</div>
                <div style={{ fontSize: '18px', fontWeight: 700 }}>€{openstaand.toFixed(2)}</div>
              </td>
              <td></td>
            </tr>
          </tbody>
        </table>
      </div>

      {debtFreeString && (
        <div style={{ textAlign: 'right', marginTop: '16px', fontSize: '14px', color: '#6b7280' }}>
          Volledig schuldenvrij in: <strong className="text-green">{debtFreeString}</strong>
        </div>
      )}

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Schuld toevoegen</h2>
              <button className="btn-icon" onClick={() => setShowModal(false)}><X size={20} /></button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Schuldeiser</label>
                <select value={form.schuldeiser} onChange={handleContactSelect} required>
                  <option value="" disabled>Selecteer een contact...</option>
                  {contacts.map(c => <option key={c.id} value={c.naam}>{c.naam}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Notitie</label>
                <input type="text" value={form.subtekst} onChange={e => setForm({ ...form, subtekst: e.target.value })} placeholder="bijv. Rentevrij" />
              </div>
              <div className="form-group">
                <label>Totaal bedrag (€)</label>
                <input type="number" step="0.01" min="0" required value={form.totaal} onChange={e => setForm({ ...form, totaal: e.target.value })} />
              </div>
              <div className="form-group" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label>Regeling per maand (€)</label>
                  <input type="number" step="0.01" min="0" value={form.regeling} onChange={e => setForm({ ...form, regeling: e.target.value })} placeholder="Optioneel" />
                </div>
                <div>
                  <label>Betaaldag (1-31)</label>
                  <input type="number" min="1" max="31" value={form.betaaldatum} onChange={e => setForm({ ...form, betaaldatum: e.target.value })} placeholder="bijv. 25" />
                </div>
              </div>
              <div className="form-group">
                <label>Resterend bedrag (€)</label>
                <input type="number" step="0.01" min="0" required value={form.resterend} onChange={e => setForm({ ...form, resterend: e.target.value })} />
              </div>
              <button type="submit" className="btn-add" style={{ width: '100%' }}>Toevoegen</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
