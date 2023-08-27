from fastapi import FastAPI
from models import *
from sqlalchemy.orm import sessionmaker

app = FastAPI()

engine = db_connect()
Session= sessionmaker(bind=engine)
db = Session()
@app.get("/")
async def root():
    return {"message": "server is live"}

@app.get("/get-events")
async def read_events():
    return db.query(Event).all()
