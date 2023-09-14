# Define your item pipelines here
#
# Don't forget to add your pipeline to the ITEM_PIPELINES setting
# See: https://docs.scrapy.org/en/latest/topics/item-pipeline.html


# useful for handling different item types with a single interface
from itemadapter import ItemAdapter
from backend.models import *
from sqlalchemy.orm import sessionmaker

class ScrapyComponentPipeline:
    def process_item(self, item, spider):
        return item
    
class SaveToDatabase:
    def __init__(self):
        """
        Initializes database connection and sessionmaker
        Creates tables
        """
        engine = db_connect()
        create_table(engine)
        self.Session = sessionmaker(bind=engine)
            
    
    def process_item(self, item, spider):
        """Save quotes in the database
        This method is called for every item pipeline component
        """
        session = self.Session()

        scholar = Scholar()
        scholar.name = item["scholar"]["name"]
        scholar.google_scholar_id = item["scholar"]["google_scholar_id"]
        scholar.organization = item["scholar"]["organization"]
        scholar.interest = item["scholar"]["interest"]
        session.add(scholar)
        session.flush()
        session.refresh(scholar)

        event = Event()
        event.title = item["event"]["title"]
        event.description = item["event"]["description"]
        # event.speaker = item["event"]["speaker"]
        event.venue = item["event"]["venue"]
        event.date = item["event"]["date"]
        event.keywords = item["event"]["keywords"]
        event.organization = item["event"]["organization"]
        # event.speaker_id = scholar.id

        #check whether the scholar exists
        exist_scholar = session.query(Scholar).filter_by(id = scholar.id).first()
        if exist_scholar is not None: # the scholar exists
            event.speaker = exist_scholar.id
        else:
            event.speaker = scholar.id
        
        try:

            
            session.add(event)
            session.commit()

        except:
            session.rollback()
            raise

        finally:
            session.close()

        return item
