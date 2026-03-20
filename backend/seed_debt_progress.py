import sqlite3
import os
from datetime import datetime

DB_PATH = 'finance.db'

def seed_debt_progress():
    if not os.path.exists(DB_PATH):
        print(f"Error: {DB_PATH} not found.")
        return

    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()

    try:
        # Clear existing debts for Jan de Tester to avoid duplicates or mess
        cursor.execute("DELETE FROM debts WHERE schuldeiser IN ('Jan de Tester', 'DUO (Lening)', 'Zorgverzekering', 'Klarna')")
        
        # 1. Partial Repayment (DUO)
        cursor.execute('''
            INSERT INTO debts (schuldeiser, subtekst, totaal, regeling, betaaldatum, resterend)
            VALUES (?, ?, ?, ?, ?, ?)
        ''', ("DUO (Lening)", "Opgebouwde studieschuld", 18450.0, 150.0, 1, 15450.0))
        
        # 2. Mostly Repaid (Zorgverzekering)
        cursor.execute('''
            INSERT INTO debts (schuldeiser, subtekst, totaal, regeling, betaaldatum, resterend)
            VALUES (?, ?, ?, ?, ?, ?)
        ''', ("Zorgverzekering", "Achterstand premie", 1200.0, 100.0, 15, 300.0))
        
        # 3. New Debt (Klarna)
        cursor.execute('''
            INSERT INTO debts (schuldeiser, subtekst, totaal, regeling, betaaldatum, resterend)
            VALUES (?, ?, ?, ?, ?, ?)
        ''', ("Klarna", "Nieuwe schoenen (Zalando)", 150.0, 25.0, 15, 150.0))
        
        # 4. Update the original test user debt
        cursor.execute('''
            INSERT INTO debts (schuldeiser, subtekst, totaal, regeling, betaaldatum, resterend)
            VALUES (?, ?, ?, ?, ?, ?)
        ''', ("Jan de Tester", "Persoonlijke lening", 10000.0, 200.0, 25, 8000.0))

        # 5. Add Repayment Transactions (Uitgaven)
        today = datetime.now().strftime("%Y-%m-%d")
        repayments = [
            ("DUO (Lening)", "Aflossing studieschuld", 150.0, "Verzekering"),
            ("Zorgverzekering", "Aflossing achterstand", 100.0, "Verzekering"),
            ("De Bank", "Aflossing lening Jan", 200.0, "Overig")
        ]
        
        for naam, omschrijving, bedrag, cat in repayments:
            cursor.execute('''
                INSERT INTO transactions (datum, naam, categorie, omschrijving, bedrag, type)
                VALUES (?, ?, ?, ?, ?, ?)
            ''', (today, naam, cat, omschrijving, bedrag, "uitgaven"))

        conn.commit()
        print("Successfully seeded debt progress data!")

    except Exception as e:
        print(f"Error seeding data: {e}")
        conn.rollback()
    finally:
        conn.close()

if __name__ == "__main__":
    seed_debt_progress()
