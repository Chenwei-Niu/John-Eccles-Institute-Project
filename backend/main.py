from fastapi import FastAPI
from models import *
from sqlalchemy.orm import sessionmaker
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.sql import text

app = FastAPI()
origins = ["*"]

#TODO: set appropiate CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

engine = db_connect()
Session= sessionmaker(bind=engine)
db = Session()

@app.get("/")
async def root():
    return {"message": "server is live"}

@app.get("/get-events")
async def read_events():
    return db.query(Event).all()

@app.get("/search-events/")
async def read_events(searchTerm: str | None):
    q = db.query(Event).filter(text('event.search_vector @@ plainto_tsquery(:terms)'))
    q = q.params(terms=searchTerm).all()
    return q

