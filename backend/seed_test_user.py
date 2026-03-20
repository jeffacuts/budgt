import sqlite3
import os

DB_PATH = 'finance.db'

def seed_test_user():
    if not os.path.exists(DB_PATH):
        print(f"Error: {DB_PATH} not found.")
        return

    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()

    try:
        # 1. Add Test User to Contacts
        # We use 'notities' to store age and employment status as requested
        # And name for address details if needed, or keeping it clean
        cursor.execute('''
            INSERT INTO contacts (naam, email, telefoon, iban, kenmerk, notities)
            VALUES (?, ?, ?, ?, ?, ?)
        ''', (
            "Jan de Tester", 
            "jan.tester@example.com", 
            "06-12345678", 
            "NL99 BANK 0123 4567 89", 
            "Hoofdstraat 1, 1234 AB Amsterdam", 
            "Leeftijd: 30 jaar. Status: Loondienst (Software Developer)."
        ))
        contact_id = cursor.lastrowid
        print(f"Added contact: Jan de Tester (ID: {contact_id})")

        # 2. Add Debt of 10.000
        cursor.execute('''
            INSERT INTO debts (schuldeiser, subtekst, totaal, regeling, betaaldatum, resterend)
            VALUES (?, ?, ?, ?, ?, ?)
        ''', (
            "Jan de Tester", 
            "Persoonlijke lening", 
            10000.0, 
            200.0, 
            25, 
            10000.0
        ))
        print("Added debt: €10,000.00")

        # 3. Add Salary Transaction to show "Loondienst"
        from datetime import datetime
        today = datetime.now().strftime("%Y-%m-%d")
        cursor.execute('''
            INSERT INTO transactions (datum, naam, categorie, omschrijving, bedrag, type)
            VALUES (?, ?, ?, ?, ?, ?)
        ''', (
            today, 
            "Jan de Tester", 
            "Salaris", 
            "Salaris Maart - Loondienst", 
            3500.0, 
            "inkomsten"
        ))
        print("Added income transaction: €3,500.00 (Salaris)")

        conn.commit()
        print("Successfully seeded test data!")

    except Exception as e:
        print(f"Error seeding data: {e}")
        conn.rollback()
    finally:
        conn.close()

if __name__ == "__main__":
    seed_test_user()
