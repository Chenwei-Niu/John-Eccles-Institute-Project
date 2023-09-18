from sqlalchemy import (
    Integer, Text, Boolean)
from sqlalchemy import create_engine, Column
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
    

