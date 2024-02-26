from fastapi import FastAPI
from models import *
from sqlalchemy.orm import sessionmaker
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.sql import text
from typing import Union

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
    events = db.query(Event).all()
    for event in events:
        event.description = str(event.description)[:300] + "..."
    return events

@app.get("/search-events/")
async def read_events(searchTerm: Union[str , None]):
    # q = db.query(Event, Scholar).filter(Event.speaker == Scholar.id).filter(text('event.search_vector @@ plainto_tsquery(:terms)'))
    q = db.query(Event).filter(text('event.search_vector @@ plainto_tsquery(:terms)'))
    # # # Defer loading of Event.speaker relationship
    # # q = q.options(joinedload(Event.speaker).defer('*'))
    # # Use joinedload getting presenter's name
    # q = q.options(joinedload(Event.speaker).load_only(Scholar.name))
    q = q.params(terms=searchTerm).all()

    return q

