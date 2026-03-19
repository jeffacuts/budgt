from fastapi import FastAPI, UploadFile, File
import sqlite3
import pandas as pd
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

DB_PATH = 'finance.db'

def init_db():
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS transactions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            datum TEXT,
            naam TEXT,
            categorie TEXT,
            omschrijving TEXT,
            bedrag REAL,
            type TEXT
        )
    ''')
    conn.commit()
    conn.close()

init_db()

class Transaction(BaseModel):
    datum: str
    naam: str
    categorie: str
    omschrijving: str
    bedrag: float
    type: str

@app.get("/transactions")
def get_transactions():
    conn = sqlite3.connect(DB_PATH)
    df = pd.read_sql_query("SELECT * FROM transactions ORDER BY datum DESC", conn)
    conn.close()
    return df.to_dict(orient="records")

@app.post("/transactions")
def add_transaction(t: Transaction):
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute('''
        INSERT INTO transactions (datum, naam, categorie, omschrijving, bedrag, type)
        VALUES (?, ?, ?, ?, ?, ?)
    ''', (t.datum, t.naam, t.categorie, t.omschrijving, t.bedrag, t.type))
    conn.commit()
    conn.close()
    return {"status": "success"}

@app.delete("/transactions/{t_id}")
def delete_transaction(t_id: int):
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute("DELETE FROM transactions WHERE id = ?", (t_id,))
    conn.commit()
    conn.close()
    return {"status": "deleted"}

@app.post("/upload-bank")
async def upload_csv(file: UploadFile = File(...)):
    df = pd.read_csv(file.file)
    conn = sqlite3.connect(DB_PATH)
    df.to_sql('transactions', conn, if_exists='append', index=False)
    conn.close()
    return {"status": "Bankgegevens succesvol bijgewerkt!"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
