from sqlalchemy import (
    Integer, Text, Boolean, DateTime)
from sqlalchemy import create_engine, Column, event, DDL, func
from sqlalchemy.ext.declarative import declarative_base
from scrapy.utils.project import get_project_settings
from sqlalchemy.dialects.postgresql import ARRAY
from sqlalchemy import ForeignKey
from sqlalchemy.orm import *
Base = declarative_base()


def db_connect():
    return create_engine(get_project_settings().get("CONNECTION_STRING"))


def create_table(engine):
    Base.metadata.create_all(engine)


class Event(Base):
    __tablename__ = "event"

    id = Column(Integer, primary_key=True, autoincrement=True)
    title = Column(Text())
    description = Column(Text())
    date = Column(Text())
    venue = Column(Text())
    speaker = Column(Integer,ForeignKey("scholar.id"))
    # speaker:relationship("scholar", lazy="joined", cascade="all, delete-orphan")
    keywords = Column(Text())
    organization = Column(Text())
    url = Column(Text())
    access_date = Column(DateTime(timezone=True))

class Recipient(Base):
    __tablename__ = "recipient"
    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(Text())
    email = Column(Text(),  unique=True)
    interest = Column(ARRAY(Text()))
    organization = Column(Text())
    is_recipient = Column(Boolean(),default=False)

class Scholar(Base):
    __tablename__ = "scholar"
    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(Text())
    google_scholar_id = Column(Text())
    interest = Column(ARRAY(Text()))
    organization = Column(Text())
    events = relationship('Event', backref='scholar')
    



search_vector_trigger = DDL("""create trigger event_entry_search_update before update or insert on event for 
                            each row execute procedure tsvector_update_trigger('search_vector', 'pg_catalog.english', 
                                          'description', 'title', 'speaker', 'venue', 'date')""")

event.listen(Event.__table__, 'after_create', DDL("alter table event add column search_vector tsvector"))
event.listen(Event.__table__, 'after_create',  DDL("""create index event_entries_search_index on event using gin(search_vector)"""))
event.listen(Event.__table__, 'after_create', search_vector_trigger)


