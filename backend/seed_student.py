import sqlite3
from datetime import datetime, timedelta

def get_date(days_ago):
    return (datetime.now() - timedelta(days=days_ago)).strftime('%Y-%m-%d')

def seed_student_db():
    conn = sqlite3.connect('backend/finance.db')
    cursor = conn.cursor()
    
    # Clear existing data
    cursor.execute('DELETE FROM transactions')
    cursor.execute('DELETE FROM debts')
    cursor.execute('DELETE FROM contacts')
    
    # --- Transactions ---
    # Income (Inkomsten)
    income = [
        (get_date(5), 'DUO', 'Studiefinanciering', 'Basisbeurs + Aanvullende beurs', 1125.40, 'inkomsten'),
        (get_date(10), 'Belastingdienst', 'Zorgtoeslag', 'Maandelijkse zorgtoeslag', 123.00, 'inkomsten'),
        (get_date(2), 'Thuisbezorgd BV', 'Salaris', 'Side job (februari)', 458.20, 'inkomsten'),
        (get_date(20), 'Ouders', 'Toelage', 'Maandelijkse bijdrage', 150.00, 'inkomsten'),
    ]
    
    # Expenses (Uitgaven)
    expenses = [
        (get_date(1), 'SSH Student Housing', 'Huur', 'Huur studentenkamer maart', 485.00, 'uitgaven'),
        (get_date(3), 'Albert Heijn', 'Boodschappen', 'Wekelijkse boodschappen', 42.15, 'uitgaven'),
        (get_date(4), 'Spotify', 'Abonnementen', 'Premium Family share', 5.99, 'uitgaven'),
        (get_date(6), 'Horeca De Beurs', 'Vrije tijd', 'Avondje uit met huisgenoten', 35.50, 'uitgaven'),
        (get_date(8), 'Lidl', 'Boodschappen', 'Groenten en fruit', 18.90, 'uitgaven'),
        (get_date(12), 'T-Mobile', 'Abonnementen', 'Mobiel abonnement', 25.00, 'uitgaven'),
        (get_date(15), 'Fitness First', 'Sport', 'Maandabbonement sport', 29.99, 'uitgaven'),
        (get_date(18), 'NS Reizigers', 'Transport', 'Treinreis weekend', 14.50, 'uitgaven'),
        (get_date(22), 'Thuisbezorgd.nl', 'Vrije tijd', 'Pizza zondag', 12.50, 'uitgaven'),
        (get_date(25), 'Bol.com', 'Studie', 'Studieboeken Economie', 89.00, 'uitgaven'),
    ]
    
    cursor.executemany('''
        INSERT INTO transactions (datum, naam, categorie, omschrijving, bedrag, type)
        VALUES (?, ?, ?, ?, ?, ?)
    ''', income + expenses)
    
    # --- Debts (Schulden) ---
    debts = [
        ('DUO (Lening)', 'Opgebouwde studieschuld', 18450.00, 0.00, 0, 18450.00),
        ('Klarna', 'Nieuwe schoenen (Zalando)', 129.95, 25.00, 15, 129.95),
        ('Huisgenoot (Jasper)', 'Voorschot krat bier + Pizza', 42.50, 0.00, 1, 42.50),
    ]
    
    cursor.executemany('''
        INSERT INTO debts (schuldeiser, subtekst, totaal, regeling, betaaldatum, resterend)
        VALUES (?, ?, ?, ?, ?, ?)
    ''', debts)
    
    # --- Contacts (Contacten) ---
    contacts = [
        ('DUO', 'klantenservice@duo.nl', '050-5997755', 'NL99INGB0001234567', 'STUD-12345', 'Studieschuld afdeling'),
        ('SSH Student Housing', 'info@ssh.nl', '088-7304200', 'NL88ABNA0445566778', 'ROOM-402', 'Huurbaas'),
        ('Thuisbezorgd BV', 'hr@thuisbezorgd.nl', '050-1234567', '', 'EMP-998', 'Werkgever (Side job)'),
        ('Jasper (Huisgenoot)', 'jasper@email.com', '06-12345678', 'NL12RABO0123456789', '', 'Schuld voor bier en pizza'),
    ]
    
    cursor.executemany('''
        INSERT INTO contacts (naam, email, telefoon, iban, kenmerk, notities)
        VALUES (?, ?, ?, ?, ?, ?)
    ''', contacts)
    
    conn.commit()
    conn.close()
    print("Database cleared and student profile seeded successfully!")

if __name__ == "__main__":
    seed_student_db()
