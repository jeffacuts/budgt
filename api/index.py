import os
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

# Vercel provides a read-only filesystem except for /tmp
# We use the bundled database or a path that works in serverless
DB_PATH = os.path.join(os.path.dirname(__file__), '../backend/finance.db')

@contextmanager
def get_db():
    # Note: On Vercel, this is READ-ONLY unless using an external DB
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    try:
        yield conn
    finally:
        conn.close()

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
    raise HTTPException(status_code=403, detail="Aanpassen van data is niet mogelijk op Vercel demo (Serverless / SQLite). Gebruik een externe database voor opslag.")

@app.delete("/api/transactions/{t_id}")
def delete_transaction(t_id: int):
    raise HTTPException(status_code=403, detail="Verwijderen niet mogelijk op Vercel demo.")

@app.post("/api/upload-bank")
async def upload_csv(file: UploadFile = File(...)):
    raise HTTPException(status_code=403, detail="Uploaden niet mogelijk op Vercel demo.")

# Debts Endpoints
@app.get("/api/debts", response_model=List[Debt])
def get_debts():
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM debts")
        rows = cursor.fetchall()
        return [dict(row) for row in rows]

# Contacts Endpoints
@app.get("/api/contacts", response_model=List[Contact])
def get_contacts():
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM contacts")
        rows = cursor.fetchall()
        return [dict(row) for row in rows]

# For Vercel, the entry point must be called 'app'
# This is already handled by 'app = FastAPI()'
