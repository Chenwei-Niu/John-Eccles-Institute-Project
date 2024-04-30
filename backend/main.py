from fastapi import FastAPI, Request
from fastapi.responses import Response
from models import *
from sqlalchemy.orm import sessionmaker
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.sql import text
from sqlalchemy import desc,asc
from typing import List, Union
from datetime import datetime

import sys, os
from pathlib import Path
path = Path(os.path.dirname(__file__))
sys.path.append(str(path.parent.absolute())) 
# The four lines above are required, so that this py file could detect other modules
from scholar.recommender_system import RecommenderSystem

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
rs = RecommenderSystem()

@app.get("/")
async def root():
    return {"message": "server is live"}

@app.get("/get-events")
async def read_events(request:Request):
    events = db.query(Event).order_by(asc(Event.standard_datetime)).filter(Event.standard_datetime > datetime.now() ).all() # Sort by date field in ascending order
    # events = db.query(Event).order_by(asc(Event.standard_datetime)).all() # Test used only, past seminars would be displayed

    for event in events:
        stripped_str = str(event.description).strip()
        if len(stripped_str) > 300:
            event.description = stripped_str[:300] + "..."
        else:
            event.description = stripped_str

    # prioritise seminars base on user's cookie
    interests = await get_cookie(request=request)
    if interests == "": # no cookie exists or the user hasn't typed in any interest
        pass
    else:
        pq = rs.get_priority_seminars_by_interests(interests)
        while not pq.empty():
            priority_seminar = pq.get()
            print(priority_seminar)
            index = get_event_index_by_eventID(events,priority_seminar[1])
            if index is not None:
                events.insert(0, events.pop(index))
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

@app.post("/add-selected-seminars")
async def set_selected_seminars(request: Request, response: Response):
    data = await request.json()
    selected = data.get("selected")
    cookies = request.cookies
    if "selected_id" in cookies:
        existing_selected_list = string_to_list(cookies["selected_id"])

        existing_selected_list.append(selected)
        response.set_cookie(key="selected_id", value=existing_selected_list)
        response.headers["Host"] = request.headers.get("Host")
        return existing_selected_list
    else:
        response.set_cookie(key="selected_id", value=[selected])
        response.headers["Host"] = request.headers.get("Host")
        return [selected]
    

@app.post("/remove-selected-seminars")
async def set_selected_seminars(request: Request, response: Response):
    data = await request.json()
    selected = data.get("selected")
    cookies = request.cookies
    if "selected_id" in cookies:
        existing_selected_list = string_to_list(cookies["selected_id"])
        print(existing_selected_list)
        existing_selected_list.remove(selected)
        response.set_cookie(key="selected_id", value=existing_selected_list)
        response.headers["Host"] = request.headers.get("Host")
        return existing_selected_list
    else:
        return None
    
@app.get("/get-selected-seminars")
async def set_selected_seminars(request: Request, response: Response):
    cookies = request.cookies
    if "selected_id" in cookies:
        existing_selected_list = string_to_list(cookies["selected_id"])
        print(existing_selected_list)
        response.headers["Host"] = request.headers.get("Host")
        return existing_selected_list
    else:
        return None
    
# Helper Function
def get_event_index_by_eventID(events:List[Event],event_id):
    for i in range(0,len(events)):
        if events[i].id == event_id:
            return i
    else:
        return None

def string_to_list(string:str):
    if string == None or string == "" or string == "[]":
        return []
    elif ',' not in string :
        return [string[2:-2]]
    else:
        return [x.strip() for x in string[1:-1].replace("'","").split(',')]
