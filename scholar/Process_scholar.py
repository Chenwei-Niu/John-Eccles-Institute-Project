import pandas as pd
from typing import List
import re
from scholarly import scholarly
from backend.models import Scholar
from backend.models import *
from sqlalchemy.orm import sessionmaker

class Process_scholar:
    def __init__(self):
        self.name_matcher = r'([\w]+)\.([\w]+)@anu\.edu\.au'
        engine = db_connect()
        self.Session = sessionmaker(bind=engine)

    
    def add_scholar(self, data:pd.DataFrame): # add scholars from recipients list

        for index, row in data.iterrows():
            session = self.Session()
            scholar = Scholar()
            
            scholar.email = str(row[0])
            scholar.organization = str(row[1])
            scholar.name = self.get_name_from_email(scholar.email)
            scholar.interest = self.get_interests(scholar.name,scholar.email,scholar.organization)
            scholar.is_recipient = True # Set to true, since theses scholars are from recipients list
                                    # For scholar added from events, this attribute should be set to false
            try:
                session.add(scholar)
                session.commit()

            except:
                session.rollback()
                continue
            finally:
                session.close()

    def get_name_from_email(self,email):
        result = re.search(self.name_matcher,email,flags=re.IGNORECASE)
        if result:
            name = result.group(1) + " " + result.group(2)
            return name
        else:
            return ""
        
    def get_interests(self,name:str,email:str,organization:str):

        if organization == "nan":
            query = name
        else:
            query = name + ", "+ organization
        
        search_query = scholarly.search_author(query)
        possible_scholars = []
        while True:
            try:      
                scholar_result = next(search_query)
                possible_scholars.append(scholar_result)
            except StopIteration:
                break

        if len(possible_scholars) == 1: # only one result, that's the person
            # print(possible_scholars[0]['interests'])
            return possible_scholars[0]['interests']
        else:
            # the algorithm using C-value methods and word2Vec
            # to be completed....
            return []
        