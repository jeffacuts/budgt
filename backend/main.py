import sqlite3
import pandas as pd
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
from contextlib import contextmanager

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

DB_PATH = 'finance.db'

@contextmanager
def get_db():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    try:
        yield conn
    finally:
        conn.close()

def init_db():
    with get_db() as conn:
        cursor = conn.cursor()
        # Transactions table with unique constraint to prevent duplicates
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS transactions (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                datum TEXT,
                naam TEXT,
                categorie TEXT,
                omschrijving TEXT,
                bedrag REAL,
                type TEXT,
                UNIQUE(datum, naam, omschrijving, bedrag, type)
            )
        ''')
        # Debts table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS debts (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                schuldeiser TEXT,
                subtekst TEXT,
                totaal REAL,
                regeling REAL,
                betaaldatum INTEGER,
                resterend REAL
            )
        ''')
        # Contacts table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS contacts (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                naam TEXT,
                email TEXT,
                telefoon TEXT,
                iban TEXT,
                kenmerk TEXT,
                notities TEXT
            )
        ''')
        conn.commit()

init_db()

# Models
class Transaction(BaseModel):
    id: Optional[int] = None
    datum: str
    naam: str
    categorie: str
    omschrijving: str
    bedrag: float
    type: str

class Debt(BaseModel):
    id: Optional[int] = None
    schuldeiser: str
    subtekst: Optional[str] = ""
    totaal: float
    regeling: float
    betaaldatum: int
    resterend: float

class Contact(BaseModel):
    id: Optional[int] = None
    naam: str
    email: Optional[str] = ""
    telefoon: Optional[str] = ""
    iban: Optional[str] = ""
    kenmerk: Optional[str] = ""
    notities: Optional[str] = ""

# Transactions Endpoints
@app.get("/api/transactions", response_model=List[Transaction])
def get_transactions():
    with get_db() as conn:
        df = pd.read_sql_query("SELECT * FROM transactions ORDER BY datum DESC", conn)
        return df.to_dict(orient="records")

@app.post("/api/transactions")
def add_transaction(t: Transaction):
    try:
        with get_db() as conn:
            cursor = conn.cursor()
            cursor.execute('''
                INSERT INTO transactions (datum, naam, categorie, omschrijving, bedrag, type)
                VALUES (?, ?, ?, ?, ?, ?)
            ''', (t.datum, t.naam, t.categorie, t.omschrijving, t.bedrag, t.type))
            conn.commit()
            return {"status": "success", "id": cursor.lastrowid}
    except sqlite3.IntegrityError:
        raise HTTPException(status_code=400, detail="Transactie bestaat al.")

@app.delete("/api/transactions/{t_id}")
def delete_transaction(t_id: int):
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute("DELETE FROM transactions WHERE id = ?", (t_id,))
        conn.commit()
        return {"status": "deleted"}

@app.post("/api/upload-bank")
async def upload_csv(file: UploadFile = File(...)):
    try:
        # Lees CSV en probeer te mappen naar ons schema
        df = pd.read_csv(file.file)
        # Hier zou je specifieke ASN mapping kunnen doen als de kolommen afwijken
        # Voor nu gaan we uit van een dataframe dat overeenkomt of we mappen het handmatig
        
        added_count = 0
        with get_db() as conn:
            for _, row in df.iterrows():
                try:
                    cursor = conn.cursor()
                    cursor.execute('''
                        INSERT INTO transactions (datum, naam, categorie, omschrijving, bedrag, type)
                        VALUES (?, ?, ?, ?, ?, ?)
                    ''', (row.get('datum'), row.get('naam'), row.get('categorie'), 
                          row.get('omschrijving'), row.get('bedrag'), row.get('type', 'uitgaven')))
                    added_count += 1
                except sqlite3.IntegrityError:
                    continue # Sla duplicaten over
            conn.commit()
        return {"status": f"{added_count} nieuwe transacties succesvol bijgewerkt!"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Debts Endpoints
@app.get("/api/debts", response_model=List[Debt])
def get_debts():
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM debts")
        rows = cursor.fetchall()
        return [dict(row) for row in rows]

@app.post("/api/debts")
def add_debt(d: Debt):
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute('''
            INSERT INTO debts (schuldeiser, subtekst, totaal, regeling, betaaldatum, resterend)
            VALUES (?, ?, ?, ?, ?, ?)
        ''', (d.schuldeiser, d.subtekst, d.totaal, d.regeling, d.betaaldatum, d.resterend))
        conn.commit()
        return {"status": "success", "id": cursor.lastrowid}

@app.delete("/api/debts/{d_id}")
def delete_debt(d_id: int):
    with get_db() as conn:
        conn.execute("DELETE FROM debts WHERE id = ?", (d_id,))
        conn.commit()
        return {"status": "deleted"}

# Contacts Endpoints
@app.get("/api/contacts", response_model=List[Contact])
def get_contacts():
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM contacts")
        rows = cursor.fetchall()
        return [dict(row) for row in rows]

@app.post("/api/contacts")
def add_contact(c: Contact):
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute('''
            INSERT INTO contacts (naam, email, telefoon, iban, kenmerk, notities)
            VALUES (?, ?, ?, ?, ?, ?)
        ''', (c.naam, c.email, c.telefoon, c.iban, c.kenmerk, c.notities))
        conn.commit()
        return {"status": "success", "id": cursor.lastrowid}

@app.delete("/api/contacts/{c_id}")
def delete_contact(c_id: int):
    with get_db() as conn:
        conn.execute("DELETE FROM contacts WHERE id = ?", (c_id,))
        conn.commit()
        return {"status": "deleted"}

@app.put("/api/debts/{d_id}")
def update_debt(d_id: int, d: Debt):
    with get_db() as conn:
        conn.execute('''
            UPDATE debts 
            SET schuldeiser = ?, subtekst = ?, totaal = ?, regeling = ?, betaaldatum = ?, resterend = ?
            WHERE id = ?
        ''', (d.schuldeiser, d.subtekst, d.totaal, d.regeling, d.betaaldatum, d.resterend, d_id))
        conn.commit()
        return {"status": "updated"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
