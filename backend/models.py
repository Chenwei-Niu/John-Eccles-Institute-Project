from sqlalchemy import (
    Integer, Text, Boolean, DateTime)
from sqlalchemy import create_engine, Column, event, DDL
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
    print("Finished table creation")

class Event(Base):
    __tablename__ = "event"

    id = Column(Integer, primary_key=True, autoincrement=True)
    title = Column(Text())
    description = Column(Text())
    date = Column(Text())
    venue = Column(Text())
    speaker = Column(Integer,ForeignKey("scholar.id", onupdate="CASCADE",ondelete="CASCADE"))
    # speaker:relationship("scholar", lazy="joined", cascade="all, delete-orphan")
    keywords = Column(Text())
    organization = Column(Text())
    url = Column(Text())
    image_url = Column(Text())
    access_date = Column(DateTime(timezone=True))
    standard_datetime = Column(DateTime(timezone=True))
    is_seminar = Column(Boolean(),default=False)

class Recipient(Base):
    __tablename__ = "recipient"
    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(Text())
    email = Column(Text(),  unique=True)
    interest = Column(ARRAY(Text()))
    organization = Column(Text())
    is_recipient = Column(Boolean(),default=True)

class Scholar(Base):
    __tablename__ = "scholar"
    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(Text())
    google_scholar_id = Column(Text())
    interest = Column(ARRAY(Text()))
    organization = Column(Text())
    events = relationship('Event', backref='scholar', lazy=False)
    
# print("Start listen event table 'after create'")
event.listen(Event.__table__, 'after_create',  DDL("""CREATE INDEX idx_events_search_vector ON event USING gin(
to_tsvector('english', COALESCE(title, '') || ' ' || COALESCE(description, '') || ' ' || COALESCE(venue, '') || ' ' || COALESCE(date::text, '') )
)"""))
event.listen(Scholar.__table__, 'after_create', DDL("""CREATE INDEX idx_scholar_search_vector ON scholar USING gin(to_tsvector('english', name))"""))
# print("Finish listen event table 'after create'")


