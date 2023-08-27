from fastapi import FastAPI
from models import *
from sqlalchemy.orm import sessionmaker
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()
origins = ["*"]

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
