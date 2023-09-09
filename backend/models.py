from sqlalchemy import (
    Integer, Text)
from sqlalchemy import create_engine, Column, event, DDL, func
from sqlalchemy.ext.declarative import declarative_base
from scrapy.utils.project import get_project_settings

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


search_vector_trigger = DDL("""create trigger event_entry_search_update before update or insert on event for 
                            each row execute procedure tsvector_update_trigger('search_vector', 'pg_catalog.english', 
                                          'description', 'title', 'speaker', 'venue', 'date')""")

event.listen(Event.__table__, 'after_create', DDL("alter table event add column search_vector tsvector"))
event.listen(Event.__table__, 'after_create',  DDL("""create index event_entries_search_index on event using gin(search_vector)"""))
event.listen(Event.__table__, 'after_create', search_vector_trigger)


