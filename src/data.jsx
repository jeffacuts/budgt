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
  { id: 1, naam: "UWV", categorie: "Uitkering", datum: "2026-02-23", omschrijving: "UWV Uitkering feb 2026", bedrag: 1295.0 },
  { id: 2, naam: "MGJ Wust", categorie: "Overig", datum: "2026-02-22", omschrijving: "MGJ Wust", bedrag: 30.0 },
  { id: 3, naam: "MGJ Wust", categorie: "Overig", datum: "2026-02-21", omschrijving: "MGJ Wust", bedrag: 20.0 },
  { id: 4, naam: "K.W. Klein", categorie: "Overig", datum: "2026-02-20", omschrijving: "K.W. Klein", bedrag: 15.0 },
  { id: 5, naam: "Belastingdienst Huurtoeslag", categorie: "Uitkering", datum: "2026-02-20", omschrijving: "Voorschot Huurtoeslag mrt 2026", bedrag: 322.0 },
  { id: 6, naam: "Storno Budget Internet", categorie: "Overig", datum: "2026-02-18", omschrijving: "Storno Budget Internet", bedrag: 657.98 },
  { id: 7, naam: "MGJ Wust", categorie: "Overig", datum: "2026-02-12", omschrijving: "MGJ Wust", bedrag: 10.0 },
  { id: 8, naam: "MGJ Wust", categorie: "Overig", datum: "2026-02-12", omschrijving: "MGJ Wust", bedrag: 20.0 },
  { id: 9, naam: "MGJ Wust", categorie: "Overig", datum: "2026-02-10", omschrijving: "MGJ Wust", bedrag: 5.0 },
  { id: 10, naam: "MGJ Wust", categorie: "Overig", datum: "2026-02-08", omschrijving: "MGJ Wust", bedrag: 12.0 },
  { id: 11, naam: "MGJ Wust", categorie: "Overig", datum: "2026-02-06", omschrijving: "MGJ Wust", bedrag: 20.0 },
  { id: 12, naam: "MGJ Wust", categorie: "Overig", datum: "2026-02-05", omschrijving: "MGJ Wust", bedrag: 10.0 },
  { id: 13, naam: "MGJ Wust", categorie: "Overig", datum: "2026-02-04", omschrijving: "MGJ Wust", bedrag: 30.0 },
  { id: 14, naam: "MGJ Wust", categorie: "Overig", datum: "2026-01-27", omschrijving: "MGJ Wust", bedrag: 10.0 },
  { id: 15, naam: "Tikkie", categorie: "Overig", datum: "2026-01-25", omschrijving: "Tikkie - Dankjewel papa", bedrag: 50.0 },
  { id: 16, naam: "MGJ Wust", categorie: "Overig", datum: "2026-01-25", omschrijving: "MGJ Wust", bedrag: 20.0 },
  { id: 17, naam: "K.W. Klein", categorie: "Overig", datum: "2026-01-24", omschrijving: "J.A.H. Klein spaarrekening", bedrag: 50.0 },
  { id: 18, naam: "HC Online Uitbetaling", categorie: "Overig", datum: "2026-01-24", omschrijving: "HC Online uitbetaling", bedrag: 30.0 },
  { id: 19, naam: "Unibet Uitbetaling", categorie: "Overig", datum: "2026-01-23", omschrijving: "Unibet uitbetaling", bedrag: 250.0 },
  { id: 20, naam: "UWV", categorie: "Uitkering", datum: "2026-01-23", omschrijving: "UWV Uitkering jan 2026", bedrag: 1295.0 },
  { id: 21, naam: "MGJ Wust", categorie: "Overig", datum: "2026-01-21", omschrijving: "MGJ Wust", bedrag: 22.0 },
  { id: 22, naam: "Belastingdienst Huurtoeslag", categorie: "Uitkering", datum: "2026-01-20", omschrijving: "Voorschot Huurtoeslag feb 2026", bedrag: 322.0 },
  { id: 23, naam: "Storno Pathé Thuis", categorie: "Overig", datum: "2026-01-15", omschrijving: "Storno Pathé Thuis", bedrag: 3.99 },
  { id: 24, naam: "Google", categorie: "Overig", datum: "2026-01-13", omschrijving: "Google Ireland Limited", bedrag: 0.04 },
  { id: 25, naam: "Storno Lebara", categorie: "Overig", datum: "2026-01-11", omschrijving: "Storno Lebara", bedrag: 14.5 },
  { id: 26, naam: "Storno Amazon", categorie: "Overig", datum: "2026-01-11", omschrijving: "Storno Amazon EU SARL", bedrag: 4.99 },
  { id: 27, naam: "Storno Wereld Kanker Onderzoek", categorie: "Overig", datum: "2026-01-05", omschrijving: "Storno Wereld Kanker Onderzoek", bedrag: 10.0 },
  { id: 28, naam: "MGJ Wust", categorie: "Overig", datum: "2025-12-30", omschrijving: "MGJ Wust", bedrag: 7.0 },
  { id: 29, naam: "MGJ Wust", categorie: "Overig", datum: "2025-12-30", omschrijving: "MGJ Wust", bedrag: 30.0 },
  { id: 30, naam: "MGJ Wust", categorie: "Overig", datum: "2025-12-26", omschrijving: "MGJ Wust", bedrag: 15.0 },
  { id: 31, naam: "MGJ Wust", categorie: "Overig", datum: "2025-12-23", omschrijving: "MGJ Wust", bedrag: 150.0 },
  { id: 32, naam: "Belastingdienst Huurtoeslag", categorie: "Uitkering", datum: "2025-12-22", omschrijving: "Voorschot Huurtoeslag jan 2026", bedrag: 376.0 },
  { id: 33, naam: "Marktplaats Verkoop", categorie: "Overig", datum: "2025-12-21", omschrijving: "PS4 Slim Console + controllers - Marktplaats", bedrag: 20.0 },
  { id: 34, naam: "MGJ Wust", categorie: "Overig", datum: "2025-12-19", omschrijving: "MGJ Wust", bedrag: 12.0 },
  { id: 35, naam: "UWV", categorie: "Uitkering", datum: "2025-12-18", omschrijving: "UWV Uitkering dec 2025", bedrag: 1362.51 },
  { id: 36, naam: "Storno Primitive Gym", categorie: "Overig", datum: "2025-12-15", omschrijving: "Storno Primitive Gym", bedrag: 35.95 },
  { id: 37, naam: "MGJ Wust", categorie: "Overig", datum: "2025-12-11", omschrijving: "MGJ Wust", bedrag: 7.0 },
  { id: 38, naam: "MGJ Wust", categorie: "Overig", datum: "2025-12-08", omschrijving: "MGJ Wust", bedrag: 6.0 },
  { id: 39, naam: "MGJ Wust", categorie: "Overig", datum: "2025-12-04", omschrijving: "MGJ Wust", bedrag: 30.0 },
  { id: 40, naam: "Amazon Refund", categorie: "Overig", datum: "2025-12-02", omschrijving: "Amazon EU SARL Refund", bedrag: 0.01 },
];

const defaultExpenses = [
  { id: 1, naam: "Amnesty International", categorie: "Abonnementen", datum: "2026-02-25", omschrijving: "Amnesty International", bedrag: 5.0 },
  { id: 2, naam: "Bankkosten SNS", categorie: "Overig", datum: "2026-02-24", omschrijving: "Kosten betaalrekening incl. betaalpas", bedrag: 5.35 },
  { id: 3, naam: "Lebara", categorie: "Abonnementen", datum: "2026-02-24", omschrijving: "Lebara mobiel", bedrag: 73.5 },
  { id: 4, naam: "Unibet", categorie: "Overig", datum: "2026-02-24", omschrijving: "Unibet", bedrag: 24.5 },
  { id: 5, naam: "Unibet", categorie: "Overig", datum: "2026-02-23", omschrijving: "Unibet", bedrag: 30.0 },
  { id: 6, naam: "Unibet", categorie: "Overig", datum: "2026-02-23", omschrijving: "Unibet", bedrag: 30.0 },
  { id: 7, naam: "L L Harderwijk", categorie: "Boodschappen", datum: "2026-02-23", omschrijving: "L L Harderwijk", bedrag: 16.99 },
  { id: 8, naam: "Jumbo", categorie: "Boodschappen", datum: "2026-02-23", omschrijving: "Jumbo Achterste Wei", bedrag: 31.7 },
  { id: 9, naam: "Columbus", categorie: "Overig", datum: "2026-02-23", omschrijving: "C&M Columbus", bedrag: 13.0 },
  { id: 10, naam: "Temu", categorie: "Kleding", datum: "2026-02-23", omschrijving: "Temu.com", bedrag: 21.44 },
  { id: 11, naam: "Temu", categorie: "Kleding", datum: "2026-02-23", omschrijving: "Temu.com", bedrag: 35.29 },
  { id: 12, naam: "Temu", categorie: "Kleding", datum: "2026-02-23", omschrijving: "Temu.com", bedrag: 6.72 },
  { id: 13, naam: "Temu", categorie: "Kleding", datum: "2026-02-23", omschrijving: "Temu.com", bedrag: 2.05 },
  { id: 14, naam: "Temu", categorie: "Kleding", datum: "2026-02-23", omschrijving: "Temu.com", bedrag: 8.53 },
  { id: 15, naam: "Temu", categorie: "Kleding", datum: "2026-02-23", omschrijving: "Temu.com", bedrag: 36.18 },
  { id: 16, naam: "Legend LDN", categorie: "Kleding", datum: "2026-02-23", omschrijving: "Legend LDN Ltd", bedrag: 70.9 },
  { id: 17, naam: "M.G.J. Wust", categorie: "Overig", datum: "2026-02-23", omschrijving: "M.G.J. Wust", bedrag: 60.0 },
  { id: 18, naam: "Kruidvat", categorie: "Overig", datum: "2026-02-23", omschrijving: "Kruidvat", bedrag: 8.03 },
  { id: 19, naam: "R. Rezai", categorie: "Overig", datum: "2026-02-23", omschrijving: "R. Rezai", bedrag: 200.0 },
  { id: 20, naam: "Uwoon Huur", categorie: "Huur", datum: "2026-02-23", omschrijving: "Uwoon Huur", bedrag: 700.0 },
  { id: 21, naam: "Albert Heijn", categorie: "Boodschappen", datum: "2026-02-22", omschrijving: "Albert Heijn 1211", bedrag: 2.6 },
  { id: 22, naam: "Kruidvat", categorie: "Overig", datum: "2026-02-22", omschrijving: "Kruidvat", bedrag: 2.73 },
  { id: 23, naam: "Columbus", categorie: "Overig", datum: "2026-02-22", omschrijving: "C&M Columbus", bedrag: 11.0 },
  { id: 24, naam: "Tabakshop", categorie: "Overig", datum: "2026-02-22", omschrijving: "Tabakshop Stadsweiden", bedrag: 11.0 },
  { id: 25, naam: "Jumbo", categorie: "Boodschappen", datum: "2026-02-22", omschrijving: "Jumbo Achterste Wei", bedrag: 4.12 },
  { id: 26, naam: "Jumbo", categorie: "Boodschappen", datum: "2026-02-21", omschrijving: "Jumbo Drielanden", bedrag: 3.98 },
  { id: 27, naam: "Tankstation", categorie: "Transport", datum: "2026-02-21", omschrijving: "Shell Oranjelaan", bedrag: 16.24 },
  { id: 28, naam: "Unibet", categorie: "Overig", datum: "2026-02-21", omschrijving: "Unibet", bedrag: 30.0 },
  { id: 29, naam: "Unibet", categorie: "Overig", datum: "2026-02-21", omschrijving: "Unibet", bedrag: 20.0 },
  { id: 30, naam: "New York Pizza", categorie: "Horeca", datum: "2026-02-20", omschrijving: "New York Pizza via Thuisbezorgd", bedrag: 21.46 },
  { id: 31, naam: "Vomar", categorie: "Boodschappen", datum: "2026-02-20", omschrijving: "Vomar Voordeelmarkt", bedrag: 3.76 },
  { id: 32, naam: "Columbus", categorie: "Overig", datum: "2026-02-20", omschrijving: "C&M Columbus", bedrag: 13.0 },
  { id: 33, naam: "Edwin Pfrommer", categorie: "Overig", datum: "2026-02-20", omschrijving: "Edwin Pfrommer Schoenmaker", bedrag: 5.5 },
  { id: 34, naam: "Action", categorie: "Overig", datum: "2026-02-20", omschrijving: "Action 1379", bedrag: 3.98 },
  { id: 35, naam: "Vibes Fashion", categorie: "Kleding", datum: "2026-02-20", omschrijving: "Vibes Fashion", bedrag: 64.85 },
  { id: 36, naam: "T Bakhuus", categorie: "Horeca", datum: "2026-02-20", omschrijving: "T Bakhuus Harderwijk", bedrag: 16.8 },
  { id: 37, naam: "Kapper", categorie: "Overig", datum: "2026-02-20", omschrijving: "Sk The Barber", bedrag: 46.0 },
  { id: 38, naam: "Aldi", categorie: "Boodschappen", datum: "2026-02-20", omschrijving: "Aldi Harderwijk", bedrag: 2.75 },
  { id: 39, naam: "Kruidvat", categorie: "Overig", datum: "2026-02-20", omschrijving: "Kruidvat", bedrag: 14.45 },
  { id: 40, naam: "Wibra", categorie: "Kleding", datum: "2026-02-20", omschrijving: "Wibra Harderwijk", bedrag: 12.95 },
  { id: 41, naam: "K.W. Klein", categorie: "Overig", datum: "2026-02-20", omschrijving: "K.W. Klein", bedrag: 16.0 },
  { id: 42, naam: "K.W. Klein", categorie: "Overig", datum: "2026-02-20", omschrijving: "K.W. Klein", bedrag: 30.0 },
  { id: 43, naam: "Jumbo", categorie: "Boodschappen", datum: "2026-02-20", omschrijving: "Jumbo Achterste Wei", bedrag: 3.43 },
  { id: 44, naam: "Tabakshop", categorie: "Overig", datum: "2026-02-20", omschrijving: "Tabakshop Stadsweiden", bedrag: 12.8 },
  { id: 45, naam: "Apple", categorie: "Abonnementen", datum: "2026-02-20", omschrijving: "Apple iCloud/Music", bedrag: 17.99 },
  { id: 46, naam: "Budget Internet", categorie: "Abonnementen", datum: "2026-02-17", omschrijving: "Budget Internet", bedrag: 657.98 },
  { id: 47, naam: "New York Pizza", categorie: "Horeca", datum: "2026-02-12", omschrijving: "New York Pizza via Thuisbezorgd", bedrag: 25.03 },
  { id: 48, naam: "Amnesty International", categorie: "Abonnementen", datum: "2026-02-12", omschrijving: "Amnesty International", bedrag: 5.0 },
  { id: 49, naam: "Jumbo", categorie: "Boodschappen", datum: "2026-02-11", omschrijving: "Jumbo Drielanden", bedrag: 1.69 },
  { id: 50, naam: "Aldi", categorie: "Boodschappen", datum: "2026-02-11", omschrijving: "Aldi Harderwijk", bedrag: 3.74 },
  { id: 51, naam: "Tankstation", categorie: "Transport", datum: "2026-02-10", omschrijving: "Shell Oranjelaan", bedrag: 2.4 },
  { id: 52, naam: "Jumbo", categorie: "Boodschappen", datum: "2026-02-09", omschrijving: "Jumbo Drielanden", bedrag: 4.62 },
  { id: 53, naam: "Primera", categorie: "Overig", datum: "2026-02-09", omschrijving: "Primera Drielanden", bedrag: 4.85 },
  { id: 54, naam: "Aldi", categorie: "Boodschappen", datum: "2026-02-09", omschrijving: "Aldi Harderwijk", bedrag: 2.62 },
  { id: 55, naam: "Tankstation", categorie: "Transport", datum: "2026-02-07", omschrijving: "BP Harderwijk", bedrag: 5.25 },
  { id: 56, naam: "Tankstation", categorie: "Transport", datum: "2026-02-06", omschrijving: "Shell Oranjelaan", bedrag: 14.44 },
  { id: 57, naam: "Columbus", categorie: "Overig", datum: "2026-02-05", omschrijving: "C&M Columbus", bedrag: 12.5 },
  { id: 58, naam: "Jumbo", categorie: "Boodschappen", datum: "2026-02-05", omschrijving: "Jumbo Achterste Wei", bedrag: 3.62 },
  { id: 59, naam: "Rente", categorie: "Overig", datum: "2026-02-05", omschrijving: "Rente negatief saldo", bedrag: 0.05 },
  { id: 60, naam: "Tankstation", categorie: "Transport", datum: "2026-02-04", omschrijving: "Shell Oranjelaan", bedrag: 11.0 },
  { id: 61, naam: "Wereld Kanker Onderzoek", categorie: "Abonnementen", datum: "2026-02-02", omschrijving: "Wereld Kanker Onderzoek Fonds", bedrag: 10.0 },
  { id: 62, naam: "Nettorama", categorie: "Boodschappen", datum: "2026-01-27", omschrijving: "Nettorama", bedrag: 0.59 },
  { id: 63, naam: "Primera", categorie: "Overig", datum: "2026-01-27", omschrijving: "Primera Drielanden", bedrag: 11.0 },
  { id: 64, naam: "Aldi", categorie: "Boodschappen", datum: "2026-01-25", omschrijving: "Aldi Harderwijk", bedrag: 4.7 },
  { id: 65, naam: "Jumbo", categorie: "Boodschappen", datum: "2026-01-25", omschrijving: "Jumbo Drielanden", bedrag: 2.79 },
  { id: 66, naam: "Primera", categorie: "Overig", datum: "2026-01-25", omschrijving: "Primera Drielanden", bedrag: 10.8 },
  { id: 67, naam: "A. al Refae", categorie: "Overig", datum: "2026-01-25", omschrijving: "A. al Refae via ING Betaalverzoek", bedrag: 45.0 },
  { id: 68, naam: "Bankkosten SNS", categorie: "Overig", datum: "2026-01-24", omschrijving: "Kosten betaalrekening incl. betaalpas", bedrag: 5.0 },
  { id: 69, naam: "Pathé Thuis / Videoland", categorie: "Abonnementen", datum: "2026-01-24", omschrijving: "Videoland Plus proefperiode", bedrag: 0.01 },
  { id: 70, naam: "New York Pizza", categorie: "Horeca", datum: "2026-01-24", omschrijving: "New York Pizza via Thuisbezorgd", bedrag: 16.35 },
  { id: 71, naam: "Jumbo", categorie: "Boodschappen", datum: "2026-01-24", omschrijving: "Jumbo Achterste Wei", bedrag: 15.18 },
  { id: 72, naam: "Kruidvat", categorie: "Overig", datum: "2026-01-24", omschrijving: "Kruidvat", bedrag: 8.09 },
  { id: 73, naam: "Columbus", categorie: "Overig", datum: "2026-01-24", omschrijving: "C&M Columbus", bedrag: 12.0 },
  { id: 74, naam: "Jumbo", categorie: "Boodschappen", datum: "2026-01-24", omschrijving: "Jumbo Achterste Wei", bedrag: 3.23 },
  { id: 75, naam: "Tabakshop", categorie: "Overig", datum: "2026-01-24", omschrijving: "Tabakshop Stadsweiden", bedrag: 12.6 },
  { id: 76, naam: "Lebara", categorie: "Abonnementen", datum: "2026-01-24", omschrijving: "Lebara mobiel", bedrag: 12.5 },
  { id: 77, naam: "HC Online", categorie: "Overig", datum: "2026-01-23", omschrijving: "HC Online", bedrag: 20.0 },
  { id: 78, naam: "HC Online", categorie: "Overig", datum: "2026-01-23", omschrijving: "HC Online", bedrag: 34.0 },
  { id: 79, naam: "HC Online", categorie: "Overig", datum: "2026-01-23", omschrijving: "HC Online", bedrag: 30.0 },
  { id: 80, naam: "HC Online", categorie: "Overig", datum: "2026-01-23", omschrijving: "HC Online", bedrag: 30.0 },
  { id: 81, naam: "Unibet", categorie: "Overig", datum: "2026-01-23", omschrijving: "Unibet", bedrag: 36.0 },
  { id: 82, naam: "Unibet", categorie: "Overig", datum: "2026-01-23", omschrijving: "Unibet", bedrag: 50.0 },
  { id: 83, naam: "A. al Refae", categorie: "Horeca", datum: "2026-01-23", omschrijving: "McDonalds via Betaalverzoek", bedrag: 50.0 },
  { id: 84, naam: "Unibet", categorie: "Overig", datum: "2026-01-23", omschrijving: "Unibet", bedrag: 69.0 },
  { id: 85, naam: "Unibet", categorie: "Overig", datum: "2026-01-23", omschrijving: "Unibet", bedrag: 30.0 },
  { id: 86, naam: "Unibet", categorie: "Overig", datum: "2026-01-23", omschrijving: "Unibet", bedrag: 80.0 },
  { id: 87, naam: "The Gyros Spot", categorie: "Horeca", datum: "2026-01-23", omschrijving: "The Gyros Spot via Thuisbezorgd", bedrag: 27.05 },
  { id: 88, naam: "Spaarrekening", categorie: "Overig", datum: "2026-01-23", omschrijving: "SNS Internet Sparen", bedrag: 50.0 },
  { id: 89, naam: "Aldi", categorie: "Boodschappen", datum: "2026-01-23", omschrijving: "Aldi Harderwijk", bedrag: 23.55 },
  { id: 90, naam: "Primera", categorie: "Overig", datum: "2026-01-23", omschrijving: "Primera Drielanden", bedrag: 11.0 },
  { id: 91, naam: "Unibet", categorie: "Overig", datum: "2026-01-23", omschrijving: "Unibet", bedrag: 35.0 },
  { id: 92, naam: "Uwoon Huur", categorie: "Huur", datum: "2026-01-23", omschrijving: "Uwoon", bedrag: 50.0 },
  { id: 93, naam: "Uwoon Huur", categorie: "Huur", datum: "2026-01-23", omschrijving: "Uwoon Huur", bedrag: 700.0 },
  { id: 94, naam: "Lebara", categorie: "Abonnementen", datum: "2026-01-23", omschrijving: "Lebara mobiel", bedrag: 14.5 },
  { id: 95, naam: "R. Rezai", categorie: "Overig", datum: "2026-01-23", omschrijving: "R. Rezai", bedrag: 200.0 },
  { id: 96, naam: "Bankkosten SNS", categorie: "Overig", datum: "2026-01-21", omschrijving: "Kosten heraanvraag betaalpas", bedrag: 4.5 },
  { id: 97, naam: "HC Online", categorie: "Overig", datum: "2026-01-21", omschrijving: "HC Online", bedrag: 22.0 },
  { id: 98, naam: "HC Online", categorie: "Overig", datum: "2026-01-20", omschrijving: "HC Online", bedrag: 11.97 },
  { id: 99, naam: "HC Online", categorie: "Overig", datum: "2026-01-20", omschrijving: "HC Online", bedrag: 23.0 },
  { id: 100, naam: "HC Online", categorie: "Overig", datum: "2026-01-20", omschrijving: "HC Online", bedrag: 30.0 },
  { id: 101, naam: "Apple", categorie: "Abonnementen", datum: "2026-01-20", omschrijving: "Apple iCloud/Music", bedrag: 17.99 },
  { id: 102, naam: "M.G.J. Wust", categorie: "Overig", datum: "2026-01-20", omschrijving: "M.G.J. Wust", bedrag: 150.0 },
  { id: 103, naam: "Amnesty International", categorie: "Abonnementen", datum: "2026-01-16", omschrijving: "Amnesty International", bedrag: 5.0 },
  { id: 104, naam: "Budget Internet", categorie: "Abonnementen", datum: "2026-01-15", omschrijving: "Budget Internet", bedrag: 84.98 },
  { id: 105, naam: "Pathé Thuis / Videoland", categorie: "Abonnementen", datum: "2026-01-09", omschrijving: "Pathé Thuis", bedrag: 3.99 },
  { id: 106, naam: "Lebara", categorie: "Abonnementen", datum: "2026-01-05", omschrijving: "Lebara mobiel", bedrag: 14.5 },
  { id: 107, naam: "Amazon Prime", categorie: "Abonnementen", datum: "2026-01-05", omschrijving: "Amazon Prime", bedrag: 4.99 },
  { id: 108, naam: "Wereld Kanker Onderzoek", categorie: "Abonnementen", datum: "2026-01-02", omschrijving: "Wereld Kanker Onderzoek Fonds", bedrag: 10.0 },
  { id: 109, naam: "HC Online", categorie: "Overig", datum: "2025-12-30", omschrijving: "HC Online", bedrag: 13.0 },
  { id: 110, naam: "Tankstation", categorie: "Transport", datum: "2025-12-30", omschrijving: "Shell Oranjelaan", bedrag: 5.25 },
  { id: 111, naam: "Jumbo", categorie: "Boodschappen", datum: "2025-12-30", omschrijving: "Jumbo Drielanden", bedrag: 6.64 },
  { id: 112, naam: "Primera", categorie: "Overig", datum: "2025-12-30", omschrijving: "Primera Drielanden", bedrag: 11.79 },
  { id: 113, naam: "HC Online", categorie: "Overig", datum: "2025-12-26", omschrijving: "HC Online", bedrag: 10.0 },
  { id: 114, naam: "Bankkosten SNS", categorie: "Overig", datum: "2025-12-24", omschrijving: "Kosten betaalrekening incl. betaalpas", bedrag: 5.0 },
  { id: 115, naam: "HC Online", categorie: "Overig", datum: "2025-12-23", omschrijving: "HC Online", bedrag: 15.0 },
  { id: 116, naam: "HC Online", categorie: "Overig", datum: "2025-12-23", omschrijving: "HC Online", bedrag: 20.0 },
  { id: 117, naam: "Tankstation", categorie: "Transport", datum: "2025-12-23", omschrijving: "Shell Oranjelaan", bedrag: 35.35 },
  { id: 118, naam: "HC Online", categorie: "Overig", datum: "2025-12-23", omschrijving: "HC Online", bedrag: 36.0 },
  { id: 119, naam: "HC Online", categorie: "Overig", datum: "2025-12-23", omschrijving: "HC Online", bedrag: 30.0 },
  { id: 120, naam: "HC Online", categorie: "Overig", datum: "2025-12-23", omschrijving: "HC Online", bedrag: 20.0 },
  { id: 121, naam: "Jumbo", categorie: "Boodschappen", datum: "2025-12-22", omschrijving: "Jumbo Achterste Wei", bedrag: 9.25 },
  { id: 122, naam: "Columbus", categorie: "Overig", datum: "2025-12-22", omschrijving: "C&M Columbus", bedrag: 11.5 },
  { id: 123, naam: "Action", categorie: "Overig", datum: "2025-12-22", omschrijving: "Action 1379", bedrag: 21.52 },
  { id: 124, naam: "Tikkie", categorie: "Overig", datum: "2025-12-22", omschrijving: "Tikkie - Hassell", bedrag: 60.0 },
  { id: 125, naam: "Intertoys", categorie: "Overig", datum: "2025-12-22", omschrijving: "Intertoys Harderwijk", bedrag: 25.2 },
  { id: 126, naam: "Kapper", categorie: "Overig", datum: "2025-12-22", omschrijving: "Ali's Kapsalon", bedrag: 25.0 },
  { id: 127, naam: "Jumbo", categorie: "Boodschappen", datum: "2025-12-22", omschrijving: "Jumbo Achterste Wei", bedrag: 5.8 },
  { id: 128, naam: "Tabakshop", categorie: "Overig", datum: "2025-12-22", omschrijving: "Tabakshop Stadsweiden", bedrag: 10.8 },
  { id: 129, naam: "R. Rezai", categorie: "Overig", datum: "2025-12-22", omschrijving: "R. Rezai", bedrag: 200.0 },
  { id: 130, naam: "HC Online", categorie: "Overig", datum: "2025-12-21", omschrijving: "HC Online", bedrag: 20.0 },
  { id: 131, naam: "Verificatie", categorie: "Overig", datum: "2025-12-20", omschrijving: "Bankrekening verificatie", bedrag: 0.01 },
  { id: 132, naam: "Verificatie", categorie: "Overig", datum: "2025-12-20", omschrijving: "Bankrekening verificatie", bedrag: 0.01 },
  { id: 133, naam: "HC Online", categorie: "Overig", datum: "2025-12-19", omschrijving: "HC Online", bedrag: 12.0 },
  { id: 134, naam: "HC Online", categorie: "Overig", datum: "2025-12-19", omschrijving: "HC Online", bedrag: 37.0 },
  { id: 135, naam: "HC Online", categorie: "Overig", datum: "2025-12-19", omschrijving: "HC Online", bedrag: 40.0 },
  { id: 136, naam: "HC Online", categorie: "Overig", datum: "2025-12-19", omschrijving: "HC Online", bedrag: 40.0 },
  { id: 137, naam: "HC Online", categorie: "Overig", datum: "2025-12-19", omschrijving: "HC Online", bedrag: 30.0 },
  { id: 138, naam: "Unibet", categorie: "Overig", datum: "2025-12-19", omschrijving: "Unibet", bedrag: 30.0 },
  { id: 139, naam: "Unibet", categorie: "Overig", datum: "2025-12-19", omschrijving: "Unibet", bedrag: 30.0 },
  { id: 140, naam: "Unibet", categorie: "Overig", datum: "2025-12-19", omschrijving: "Unibet", bedrag: 60.0 },
  { id: 141, naam: "Unibet", categorie: "Overig", datum: "2025-12-19", omschrijving: "Unibet", bedrag: 30.0 },
  { id: 142, naam: "Unibet", categorie: "Overig", datum: "2025-12-19", omschrijving: "Unibet", bedrag: 30.0 },
  { id: 143, naam: "Unibet", categorie: "Overig", datum: "2025-12-19", omschrijving: "Unibet", bedrag: 30.0 },
  { id: 144, naam: "Unibet", categorie: "Overig", datum: "2025-12-19", omschrijving: "Unibet", bedrag: 30.0 },
  { id: 145, naam: "Unibet", categorie: "Overig", datum: "2025-12-19", omschrijving: "Unibet", bedrag: 60.0 },
  { id: 146, naam: "Unibet", categorie: "Overig", datum: "2025-12-18", omschrijving: "Unibet", bedrag: 30.0 },
  { id: 147, naam: "Apple", categorie: "Abonnementen", datum: "2025-12-18", omschrijving: "Apple iCloud/Music", bedrag: 17.99 },
  { id: 148, naam: "Unibet", categorie: "Overig", datum: "2025-12-18", omschrijving: "Unibet", bedrag: 60.0 },
  { id: 149, naam: "Unibet", categorie: "Overig", datum: "2025-12-18", omschrijving: "Unibet", bedrag: 65.0 },
  { id: 150, naam: "Unibet", categorie: "Overig", datum: "2025-12-18", omschrijving: "Unibet", bedrag: 80.0 },
  { id: 151, naam: "Unibet", categorie: "Overig", datum: "2025-12-18", omschrijving: "Unibet", bedrag: 65.0 },
  { id: 152, naam: "M.G.J. Wust", categorie: "Overig", datum: "2025-12-18", omschrijving: "M.G.J. Wust", bedrag: 580.0 },
  { id: 153, naam: "Tabakshop", categorie: "Overig", datum: "2025-12-18", omschrijving: "Tabakshop Stadsweiden", bedrag: 13.0 },
  { id: 154, naam: "Amnesty International", categorie: "Abonnementen", datum: "2025-12-15", omschrijving: "Amnesty International", bedrag: 5.0 },
  { id: 155, naam: "Primitive Gym", categorie: "Abonnementen", datum: "2025-12-12", omschrijving: "Primitive Gym", bedrag: 35.95 },
  { id: 156, naam: "Aldi", categorie: "Boodschappen", datum: "2025-12-11", omschrijving: "Aldi Harderwijk", bedrag: 1.92 },
  { id: 157, naam: "Primera", categorie: "Overig", datum: "2025-12-11", omschrijving: "Primera Drielanden", bedrag: 5.8 },
  { id: 158, naam: "Tankstation", categorie: "Transport", datum: "2025-12-08", omschrijving: "Shell Oranjelaan", bedrag: 4.8 },
  { id: 159, naam: "Geldopname", categorie: "Overig", datum: "2025-12-04", omschrijving: "Geldmaat Triasplein", bedrag: 30.0 },
  { id: 160, naam: "Amazon Prime", categorie: "Abonnementen", datum: "2025-12-01", omschrijving: "Amazon Prime", bedrag: 0.01 },
  { id: 161, naam: "Pathé Thuis / Videoland", categorie: "Abonnementen", datum: "2025-12-01", omschrijving: "Pathé Thuis", bedrag: 0.01 },
  { id: 162, naam: "Lebara", categorie: "Abonnementen", datum: "2025-12-01", omschrijving: "Lebara mobiel", bedrag: 0.01 },
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

  const updateContact = async (id, updatedFields) => {
    setContacts(prev => prev.map(c => c.id === id ? { ...c, ...updatedFields } : c));
    try {
      const contact = contacts.find(c => c.id === id);
      if (!contact) return;
      await fetch(`${API_BASE}/contacts/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...contact, ...updatedFields })
      });
    } catch (err) {
      console.warn('API niet bereikbaar, contact lokaal bijgewerkt.');
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
      contacts, addContact, updateContact, deleteContact,
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
