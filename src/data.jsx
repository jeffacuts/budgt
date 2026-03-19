import { createContext, useContext, useState, useEffect } from 'react';

const DataContext = createContext();

const defaultIncome = [
  { id: 1, naam: '—', categorie: 'Freelance', datum: '2026-03-10', omschrijving: 'Webdesign project', bedrag: 450 },
  { id: 2, naam: '—', categorie: 'Salaris', datum: '2026-03-01', omschrijving: 'Maandsalaris maart', bedrag: 3200 },
  { id: 3, naam: '—', categorie: 'Investering', datum: '2026-02-15', omschrijving: 'Dividend aandelen', bedrag: 200 },
  { id: 4, naam: '—', categorie: 'Salaris', datum: '2026-02-01', omschrijving: 'Maandsalaris februari', bedrag: 3200 },
  { id: 5, naam: '—', categorie: 'Salaris', datum: '2026-01-01', omschrijving: 'Maandsalaris januari', bedrag: 3200 },
];

const defaultExpenses = [
  { id: 1, naam: '—', categorie: 'Boodschappen', datum: '2026-03-05', omschrijving: 'Wekelijkse boodschappen', bedrag: 285 },
  { id: 2, naam: '—', categorie: 'Transport', datum: '2026-03-03', omschrijving: 'OV-chipkaart', bedrag: 65 },
  { id: 3, naam: '—', categorie: 'Huur', datum: '2026-03-01', omschrijving: 'Maandhuur maart', bedrag: 950 },
  { id: 4, naam: '—', categorie: 'Verzekering', datum: '2026-03-01', omschrijving: 'Zorgverzekering', bedrag: 120 },
  { id: 5, naam: '—', categorie: 'Abonnementen', datum: '2026-03-01', omschrijving: 'Spotify + Netflix', bedrag: 35 },
  { id: 6, naam: '—', categorie: 'Horeca', datum: '2026-02-20', omschrijving: 'Uit eten', bedrag: 45 },
  { id: 7, naam: '—', categorie: 'Kleding', datum: '2026-02-14', omschrijving: 'Winterjas', bedrag: 180 },
  { id: 8, naam: '—', categorie: 'Boodschappen', datum: '2026-02-08', omschrijving: 'Wekelijkse boodschappen', bedrag: 310 },
  { id: 9, naam: '—', categorie: 'Huur', datum: '2026-02-01', omschrijving: 'Maandhuur februari', bedrag: 950 },
  { id: 10, naam: '—', categorie: 'Boodschappen', datum: '2026-01-10', omschrijving: 'Wekelijkse boodschappen', bedrag: 275 },
  { id: 11, naam: '—', categorie: 'Huur', datum: '2026-01-01', omschrijving: 'Maandhuur januari', bedrag: 950 },
];

const defaultDebts = [
  { id: 1, schuldeiser: 'Familie', subtekst: 'Rentevrij', totaal: 2000, regeling: 50, betaaldatum: 28, resterend: 1200 },
  { id: 2, schuldeiser: 'ING Persoonlijke lening', subtekst: 'Einddatum december 2026', totaal: 5000, regeling: 120, betaaldatum: 25, resterend: 1800 },
  { id: 3, schuldeiser: 'Studielening DUO', subtekst: 'Afbetaling €150/maand', totaal: 15000, regeling: 150, betaaldatum: 25, resterend: 10500 },
];

const defaultContacts = [
  { id: 101, naam: 'UWV', email: 'service@uwv.nl', telefoon: '088-8931133', iban: 'NL99 UWVB 0123 4567 89', kenmerk: 'Wajong Uitkering' },
  { id: 102, naam: 'Belastingdienst', email: 'toeslagen@belastingdienst.nl', telefoon: '0800-0543', iban: 'NL01 BELA 0000 1234 56', kenmerk: 'Toeslagen Portaal' },
  { id: 103, naam: 'Woningbouw de Veste', email: 'info@deveste.nl', telefoon: '0570-632052', iban: 'NL44 RABA 0321 6543 21', kenmerk: 'Huurwoning 12A' },
];

function loadData(key, defaultValue) {
  try {
    const stored = localStorage.getItem(key);
    if (stored) return JSON.parse(stored);
  } catch (e) { /* ignore */ }
  return defaultValue;
}

export function DataProvider({ children }) {
  const [income, setIncome] = useState([]);
  const [expenses, setExpenses] = useState([]);

  const fetchTransactions = () => {
    fetch('http://localhost:8000/transactions')
      .then(res => res.json())
      .then(data => {
        setIncome(data.filter(t => t.type === 'inkomsten'));
        setExpenses(data.filter(t => t.type === 'uitgaven'));
      })
      .catch(err => {
        console.warn("Backend niet bereikbaar, we laden testdata in.", err);
        setIncome(loadData('ff_income', defaultIncome));
        setExpenses(loadData('ff_expenses', defaultExpenses));
      });
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const [debts, setDebts] = useState(() => {
    const loaded = loadData('ff_debts', defaultDebts);
    // Migration: ensure DUO has €150 regeling if it got saved as null previously
    return loaded.map(d => {
      let migrated = (d.schuldeiser === 'Studielening DUO' && !d.regeling) ? { ...d, regeling: 150 } : d;
      if (migrated.regeling && !migrated.betaaldatum) {
        migrated = { ...migrated, betaaldatum: 25 }; // fallback
      }
      return migrated;
    });
  });
  const [contacts, setContacts] = useState(() => loadData('ff_contacts', defaultContacts));

  useEffect(() => { localStorage.setItem('ff_income', JSON.stringify(income)); }, [income]);
  useEffect(() => { localStorage.setItem('ff_expenses', JSON.stringify(expenses)); }, [expenses]);
  useEffect(() => { localStorage.setItem('ff_debts', JSON.stringify(debts)); }, [debts]);
  useEffect(() => { localStorage.setItem('ff_contacts', JSON.stringify(contacts)); }, [contacts]);

  const addIncome = (item) => {
    fetch('http://localhost:8000/transactions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...item, type: 'inkomsten' })
    }).then(fetchTransactions).catch(() => setIncome(prev => [{ ...item, id: Date.now() }, ...prev]));
  };

  const deleteIncome = (id) => {
    fetch(`http://localhost:8000/transactions/${id}`, { method: 'DELETE' })
      .then(fetchTransactions).catch(() => setIncome(prev => prev.filter(i => i.id !== id)));
  };

  const addExpense = (item) => {
    fetch('http://localhost:8000/transactions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...item, type: 'uitgaven' })
    }).then(fetchTransactions).catch(() => setExpenses(prev => [{ ...item, id: Date.now() }, ...prev]));
  };

  const deleteExpense = (id) => {
    fetch(`http://localhost:8000/transactions/${id}`, { method: 'DELETE' })
      .then(fetchTransactions).catch(() => setExpenses(prev => prev.filter(i => i.id !== id)));
  };

  const addDebt = (item) => setDebts(prev => [...prev, { ...item, id: Date.now() }]);
  const deleteDebt = (id) => setDebts(prev => prev.filter(i => i.id !== id));
  const updateDebt = (id, updatedFields) => setDebts(prev => prev.map(d => d.id === id ? { ...d, ...updatedFields } : d));

  const addContact = (item) => setContacts(prev => [...prev, { ...item, id: Date.now() }]);
  const deleteContact = (id) => setContacts(prev => prev.filter(i => i.id !== id));

  return (
    <DataContext.Provider value={{
      income, addIncome, deleteIncome,
      expenses, addExpense, deleteExpense,
      debts, addDebt, deleteDebt, updateDebt,
      contacts, addContact, deleteContact,
    }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  return useContext(DataContext);
}
