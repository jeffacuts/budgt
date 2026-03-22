import { createContext, useContext, useState, useEffect } from 'react';

const DataContext = createContext();

const API_BASE = '/api';

export const categoryColors = {
  Boodschappen: '#60a5fa', // Blue 400
  Transport: '#fbbf24',    // Amber 400
  Huur: '#818cf8',         // Indigo 400
  Verzekering: '#f87171',  // Red 400
  Abonnementen: '#94a3b8', // Slate 400
  Horeca: '#f472b6',       // Pink 400
  Kleding: '#34d399',      // Emerald 400
  Salaris: '#10b981',      // Emerald 500
  Uitkering: '#059669',    // Emerald 600
  Overig: '#64748b',       // Slate 500
};

const defaultIncome = [
  { id: 1, naam: '—', categorie: 'Freelance', datum: '2026-03-10', omschrijving: 'Webdesign project', bedrag: 450 },
  { id: 2, naam: '—', categorie: 'Salaris', datum: '2026-03-01', omschrijving: 'Maandsalaris maart', bedrag: 3200 },
];

const defaultExpenses = [
  { id: 1, naam: '—', categorie: 'Boodschappen', datum: '2026-03-05', omschrijving: 'Wekelijkse boodschappen', bedrag: 285 },
  { id: 2, naam: '—', categorie: 'Huur', datum: '2026-03-01', omschrijving: 'Maandhuur maart', bedrag: 950 },
];

const defaultDebts = [
  { id: 1, schuldeiser: 'Familie', subtekst: 'Rentevrij', totaal: 2000, regeling: 50, betaaldatum: 28, resterend: 1200 },
];

const defaultContacts = [
  { id: 101, naam: 'UWV', email: 'service@uwv.nl', telefoon: '088-8931133', iban: 'NL99 UWVB 0123 4567 89', kenmerk: 'Wajong Uitkering' },
];

function loadLocal(key, defaultValue) {
  try {
    const stored = localStorage.getItem(key);
    if (stored) return JSON.parse(stored);
  } catch (e) { /* ignore */ }
  return defaultValue;
}

export function DataProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('ff_auth') === 'true';
  });
  const [income, setIncome] = useState(() => loadLocal('ff_income', defaultIncome));
  const [expenses, setExpenses] = useState(() => loadLocal('ff_expenses', defaultExpenses));
  const [debts, setDebts] = useState(() => loadLocal('ff_debts', defaultDebts));
  const [contacts, setContacts] = useState(() => loadLocal('ff_contacts', defaultContacts));
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
  });

  const fetchData = async () => {
    try {
      // Fetch Transactions
      const transRes = await fetch(`${API_BASE}/transactions`);
      const transData = await transRes.json();
      setIncome(transData.filter(t => t.type === 'inkomsten'));
      setExpenses(transData.filter(t => t.type === 'uitgaven'));

      // Fetch Debts
      const debtRes = await fetch(`${API_BASE}/debts`);
      const debtData = await debtRes.json();
      setDebts(debtData.length > 0 ? debtData : loadLocal('ff_debts', defaultDebts));

      // Fetch Contacts
      const contRes = await fetch(`${API_BASE}/contacts`);
      const contData = await contRes.json();
      setContacts(contData.length > 0 ? contData : loadLocal('ff_contacts', defaultContacts));
    } catch (err) {
      console.warn("Backend niet bereikbaar, we laden testdata uit localStorage.", err);
      setIncome(loadLocal('ff_income', defaultIncome));
      setExpenses(loadLocal('ff_expenses', defaultExpenses));
      setDebts(loadLocal('ff_debts', defaultDebts));
      setContacts(loadLocal('ff_contacts', defaultContacts));
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Sync to localStorage as fallback
  useEffect(() => { localStorage.setItem('ff_income', JSON.stringify(income)); }, [income]);
  useEffect(() => { localStorage.setItem('ff_expenses', JSON.stringify(expenses)); }, [expenses]);
  useEffect(() => { localStorage.setItem('ff_debts', JSON.stringify(debts)); }, [debts]);
  useEffect(() => { localStorage.setItem('ff_contacts', JSON.stringify(contacts)); }, [contacts]);
  useEffect(() => { localStorage.setItem('ff_auth', isAuthenticated); }, [isAuthenticated]);

  const login = (email, password) => {
    // Basic verification for demo purposes
    if (email && password) {
      setIsAuthenticated(true);
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
  };

  const addIncome = async (item) => {
    const newItem = { ...item, id: Date.now() };
    setIncome(prev => [newItem, ...prev]);
    try {
      await fetch(`${API_BASE}/transactions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...newItem, type: 'inkomsten' })
      });
    } catch (err) {
      console.warn('API niet bereikbaar, inkomst lokaal opgeslagen.');
    }
  };

  const deleteIncome = async (id) => {
    setIncome(prev => prev.filter(i => i.id !== id));
    try {
      await fetch(`${API_BASE}/transactions/${id}`, { method: 'DELETE' });
    } catch (err) {
      console.warn('API niet bereikbaar, inkomst lokaal verwijderd.');
    }
  };

  const addExpense = async (item) => {
    const newItem = { ...item, id: Date.now() };
    setExpenses(prev => [newItem, ...prev]);
    try {
      await fetch(`${API_BASE}/transactions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...newItem, type: 'uitgaven' })
      });
    } catch (err) {
      console.warn('API niet bereikbaar, uitgave lokaal opgeslagen.');
    }
  };

  const deleteExpense = async (id) => {
    setExpenses(prev => prev.filter(i => i.id !== id));
    try {
      await fetch(`${API_BASE}/transactions/${id}`, { method: 'DELETE' });
    } catch (err) {
      console.warn('API niet bereikbaar, uitgave lokaal verwijderd.');
    }
  };

  const addDebt = async (item) => {
    const newItem = { ...item, id: Date.now() };
    setDebts(prev => [...prev, newItem]);
    try {
      await fetch(`${API_BASE}/debts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newItem)
      });
    } catch (err) {
      console.warn('API niet bereikbaar, schuld lokaal opgeslagen.');
    }
  };

  const deleteDebt = async (id) => {
    setDebts(prev => prev.filter(i => i.id !== id));
    try {
      await fetch(`${API_BASE}/debts/${id}`, { method: 'DELETE' });
    } catch (err) {
      console.warn('API niet bereikbaar, schuld lokaal verwijderd.');
    }
  };

  const updateDebt = async (id, updatedFields) => {
    setDebts(prev => prev.map(d => d.id === id ? { ...d, ...updatedFields } : d));
    const debt = debts.find(d => d.id === id);
    if (!debt) return;
    try {
      await fetch(`${API_BASE}/debts/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...debt, ...updatedFields })
      });
    } catch (err) {
      console.warn('API niet bereikbaar, schuld lokaal bijgewerkt.');
    }
  };

  const addContact = async (item) => {
    const newItem = { ...item, id: Date.now() };
    setContacts(prev => [...prev, newItem]);
    try {
      await fetch(`${API_BASE}/contacts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newItem)
      });
    } catch (err) {
      console.warn('API niet bereikbaar, contact lokaal opgeslagen.');
    }
  };

  const deleteContact = async (id) => {
    setContacts(prev => prev.filter(i => i.id !== id));
    try {
      await fetch(`${API_BASE}/contacts/${id}`, { method: 'DELETE' });
    } catch (err) {
      console.warn('API niet bereikbaar, contact lokaal verwijderd.');
    }
  };

  return (
    <DataContext.Provider value={{
      income, addIncome, deleteIncome,
      expenses, addExpense, deleteExpense,
      debts, addDebt, deleteDebt, updateDebt,
      contacts, addContact, deleteContact,
      selectedMonth, setSelectedMonth,
      isAuthenticated, login, logout,
      refreshData: fetchData
    }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  return useContext(DataContext);
}
