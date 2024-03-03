from sqlalchemy import (
    Integer, Text, Boolean, DateTime)
from sqlalchemy import create_engine, Column, event, DDL, func, or_
from sqlalchemy.ext.declarative import declarative_base
from scrapy.utils.project import get_project_settings
from sqlalchemy.dialects.postgresql import ARRAY
from sqlalchemy import ForeignKey
from sqlalchemy.orm import *
Base = declarative_base()

search_vector_trigger_original = DDL("""create trigger event_entry_search_update before update or insert on event for 
                            each row execute procedure tsvector_update_trigger('search_vector', 'pg_catalog.english', 
                                          'description', 'title', 'venue', 'date')""")

search_vector_trigger = DDL("""
    CREATE TRIGGER event_entry_search_update
    BEFORE UPDATE OR INSERT ON event
    FOR EACH ROW
    EXECUTE PROCEDURE tsvector_update_trigger(
        'search_vector',
        'pg_catalog.english',
        'description',
        'title',
        COALESCE(speaker.name, ''),  -- Assuming "name" is the name column in the Scholar model
        'venue',
        'date
    )
""")

def db_connect():
    return create_engine(get_project_settings().get("CONNECTION_STRING"))


def create_table(engine):
    Base.metadata.create_all(engine)
    print("创建完表")

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
    access_date = Column(DateTime(timezone=True))
    is_seminar = Column(Boolean(),default=False)
    speaker_object = relationship("Scholar") # new added line, need to figure out if any bug exists

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
    
print("Start listen event table 'after create'")
# event.listen(Event.__table__, 'after_create', DDL("alter table event add column search_vector tsvector"))
# event.listen(Event.__table__, 'after_create',  DDL("""CREATE INDEX idx_events_search_vector ON event USING gin(
#     to_tsvector('english', COALESCE(title, '') || ' ' || COALESCE(description, '') || ' ' || COALESCE(venue, '') || ' ' || COALESCE(date::text, '') || ' ' || COALESCE(scholar.name, ''))
# )
# FROM event
# JOIN scholar ON event.speaker = scholar.id;
# """))
engine = db_connect()

# 创建会话
# Session = sessionmaker(bind=engine)
# session = Session()
# session.execute(DDL("""CREATE INDEX idx_events_search_vector ON event USING gin(
# to_tsvector('english', COALESCE(title, '') || ' ' || COALESCE(description, '') || ' ' || COALESCE(venue, '') || ' ' || COALESCE(date::text, '') )
# )"""))

# session.execute(DDL("""CREATE INDEX idx_scholar_search_vector ON scholar USING gin(
# to_tsvector('english', name)
# )"""))

# session.commit()
# event.listen(Event.__table__, 'after_create', search_vector_trigger_original)
print("Finish listen event table 'after create'")


