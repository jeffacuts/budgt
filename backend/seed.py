import sqlite3

default_income = [
    ('2026-03-15', 'Belastingdienst', 'Huurtoeslag', 'Maandelijkse huurtoeslag', 342.50, 'inkomsten'),
    ('2026-03-20', 'Belastingdienst', 'Zorgtoeslag', 'Maandelijkse zorgtoeslag', 123.00, 'inkomsten'),
    ('2026-03-24', 'UWV', 'Uitkering', 'Wajong uitkering', 1245.80, 'inkomsten'),
    ('2026-03-25', 'Werkgever BV', 'Vakantiegeld', 'Jaarlijks vakantiegeld', 1200.00, 'inkomsten'),
    ('2026-03-10', '—', 'Freelance', 'Webdesign project', 450, 'inkomsten'),
    ('2026-03-01', '—', 'Salaris', 'Maandsalaris maart', 3200, 'inkomsten'),
]

default_expenses = [
    ('2026-03-05', '—', 'Boodschappen', 'Wekelijkse boodschappen', 285, 'uitgaven'),
    ('2026-03-03', '—', 'Transport', 'OV-chipkaart', 65, 'uitgaven'),
    ('2026-03-01', '—', 'Huur', 'Maandhuur maart', 950, 'uitgaven'),
    ('2026-03-01', '—', 'Verzekering', 'Zorgverzekering', 120, 'uitgaven'),
    ('2026-03-01', '—', 'Abonnementen', 'Spotify + Netflix', 35, 'uitgaven'),
    ('2026-02-20', '—', 'Horeca', 'Uit eten', 45, 'uitgaven'),
    ('2026-02-14', '—', 'Kleding', 'Winterjas', 180, 'uitgaven'),
    ('2026-02-08', '—', 'Boodschappen', 'Wekelijkse boodschappen', 310, 'uitgaven'),
    ('2026-02-01', '—', 'Huur', 'Maandhuur februari', 950, 'uitgaven'),
    ('2026-01-10', '—', 'Boodschappen', 'Wekelijkse boodschappen', 275, 'uitgaven'),
    ('2026-01-01', '—', 'Huur', 'Maandhuur januari', 950, 'uitgaven'),
]

def seed_db():
    conn = sqlite3.connect('finance.db')
    cursor = conn.cursor()
    # Clear existing data if any (only if desired, but here we want a fresh start)
    cursor.execute('DELETE FROM transactions')
    
    # Bulk insert income
    cursor.executemany('''
        INSERT INTO transactions (datum, naam, categorie, omschrijving, bedrag, type)
        VALUES (?, ?, ?, ?, ?, ?)
    ''', default_income)
    
    # Bulk insert expenses
    cursor.executemany('''
        INSERT INTO transactions (datum, naam, categorie, omschrijving, bedrag, type)
        VALUES (?, ?, ?, ?, ?, ?)
    ''', default_expenses)
    
    conn.commit()
    conn.close()
    print("Database seeded successfully!")

if __name__ == "__main__":
    seed_db()
