from sqlalchemy import (
    Integer, Text, Boolean)
from sqlalchemy import create_engine, Column
from sqlalchemy.ext.declarative import declarative_base
from scrapy.utils.project import get_project_settings
from sqlalchemy.dialects.postgresql import ARRAY
from sqlalchemy import ForeignKey
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
    speaker = Column(Text())
    keywords = Column(Text())

class Scholar(Base):
    __tablename__ = "scholar"

    name = Column(Text())
    email = Column(Text(),  unique=True, primary_key=True)
    interest = Column(ARRAY(Text()))
    organization = Column(Text())
    is_recipient = Column(Boolean(),default=False)
    

