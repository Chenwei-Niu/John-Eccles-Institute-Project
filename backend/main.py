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
    query = db.query(Event).filter(
    text("to_tsvector('english', COALESCE(title, '') || ' ' || COALESCE(description, '') || ' ' || COALESCE(venue, '') || ' ' || COALESCE(date::text, '')) @@ plainto_tsquery('english', :search_term)")
    ).params(search_term=f"{searchTerm}:*")

    query = query.all()

    presenter_query = db.query( Event, Scholar).join(Scholar, Event.speaker == Scholar.id).filter(
        text("to_tsvector('english', scholar.name) @@ plainto_tsquery('english', :search_term)")
    ).params(search_term=f"{searchTerm}:*")
    presenter_query = presenter_query.all()

    for event,scholar in presenter_query:
        query.append(event)

    return query 

