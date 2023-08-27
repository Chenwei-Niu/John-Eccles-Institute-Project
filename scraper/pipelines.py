# Define your item pipelines here
#
# Don't forget to add your pipeline to the ITEM_PIPELINES setting
# See: https://docs.scrapy.org/en/latest/topics/item-pipeline.html


# useful for handling different item types with a single interface
from itemadapter import ItemAdapter
from backend.models import *
from sqlalchemy.orm import sessionmaker

class ScraperPipeline:
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
        event = Event()
        event.title = item["title"]
        event.description = item["description"]
        #event.speaker = item["speaker"]
        event.venue = item["venue"]
        event.date = item["date"]
        try:
            session.add(event)
            session.commit()

        except:
            session.rollback()
            raise

        finally:
            session.close()

        return item
