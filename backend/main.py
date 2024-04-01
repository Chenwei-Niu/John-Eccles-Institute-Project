from fastapi import FastAPI, Request
from fastapi.responses import Response
from models import *
from sqlalchemy.orm import sessionmaker
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.sql import text
from sqlalchemy import desc,asc
from typing import Union
from datetime import datetime
import secrets

app = FastAPI()
origins = ["http://localhost:5000","http://127.0.0.1:5000"]

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
    events = db.query(Event).order_by(asc(Event.standard_datetime)).filter(Event.standard_datetime > datetime.now() ).all() # Sort by date field in ascending order
    for event in events:
        event.description = str(event.description)[:300] + "..."
    return events

@app.get("/search-events/")
async def read_events(searchTerm: Union[str , None]):
    query = db.query(Event).filter(
    text("to_tsvector('english', COALESCE(title, '') || ' ' || COALESCE(description, '') || ' ' || COALESCE(venue, '') || ' ' || COALESCE(date::text, '')) @@ plainto_tsquery('english', :search_term)")
    ).params(search_term=f"{searchTerm}:*")

    query = query.order_by(asc(Event.date)).filter(Event.standard_datetime > datetime.now() ).all()

    presenter_query = db.query( Event, Scholar).join(Scholar, Event.speaker == Scholar.id).filter(
        text("to_tsvector('english', scholar.name) @@ plainto_tsquery('english', :search_term)")
    ).params(search_term=f"{searchTerm}:*")
    presenter_query = presenter_query.order_by(asc(Event.standard_datetime)).filter(Event.standard_datetime > datetime.now() ).all()

    for event,scholar in presenter_query:
        if event not in query:
            query.append(event)

    return query 

@app.post("/set-cookie")
async def set_cookie(request: Request, response: Response):

    data = await request.json()
    
    interests = data.get("interests")
    response.set_cookie(key="interests", value=interests)
    response.headers["Host"] = request.headers.get("Host")
    return {"message": "Cookie set successfully"}

@app.get("/get-cookie")
async def get_cookie(request:Request):
    # cookie is obtained in Request Obejct
    cookies = request.cookies
    print(cookies)
    if "interests" in cookies:
        interests_cookie = cookies["interests"]
        return interests_cookie
    else:
        return ""