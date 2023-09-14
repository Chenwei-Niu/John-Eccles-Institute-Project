import pandas as pd
from typing import List
import re
from scholarly import scholarly
from backend.models import Recipent
from backend.models import *
from sqlalchemy.orm import sessionmaker
import spacy
nlp = spacy.load("en_core_web_sm")
word2vector_nlp = spacy.load("en_core_web_lg")
biography_formats = [
    r'Biography([\s\S]+)',
    r'Biography\s?:?\s?(.*)',
    r'Biography\s?:?\s?\n+(.*)',
    r'Bio([\s\S]+)',
    r'Bio\s?:?\s?(.*)',
    r'Bio\s?:?\s?\n+(.*)',
]

university_feature_words = ["University", "College", "Uni", "U", "Institution", "of", "Institute"]

class Process_scholar:
    def __init__(self):
        self.name_matcher = r'([\w]+)\.([\w]+)@([\w]+)\.edu\.au'
        engine = db_connect()
        self.Session = sessionmaker(bind=engine)

    
    def add_recipent_from_email(self, data:pd.DataFrame): # add scholars from recipients list

        for index, row in data.iterrows():
            session = self.Session()
            recipent = Recipent()
            
            recipent.email = str(row[0])
            recipent.organization = str(row[1])
            recipent.name = self.get_name_from_email(recipent.email)
            recipent.interest = self.get_attributes(recipent.name,recipent.organization,"interests")
            recipent.is_recipient = True # Set to true, since theses scholars are from recipients list
                                    # For scholar added from events, this attribute should be set to false
            try:
                session.add(recipent)
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
    
    def get_candidates_by_name_and_org(self,name:str,organization:str):
        if organization == "nan":
            query = '"'+name+'"'
        else:
            query = '"'+name + '", '+ organization
        
        search_query = scholarly.search_author(query)
        possible_scholars = []
        while True:
            try:      
                scholar_result = next(search_query)
                possible_scholars.append(scholar_result)
            except StopIteration:
                break
        return possible_scholars
    
    def get_candidates_by_name(self,name:str):
        query = '"'+name+'"'
        search_query = scholarly.search_author(query)
        possible_scholars = []
        while True:
            try:      
                scholar_result = next(search_query)
                possible_scholars.append(scholar_result)
            except StopIteration:
                break
        return possible_scholars
    
    # This function is for recipents only
    def get_attributes(self,name:str,organization:str,attribute:str):

        possible_scholars = self.get_candidates_by_name_and_org(name,organization)
        schoalar_list_length = len(possible_scholars)
        if schoalar_list_length == 1: # only one result, that's the person
            # print(possible_scholars[0]['interests'])
            return possible_scholars[0][attribute]
        elif schoalar_list_length >1:
            if organization != "anu": # if the scholar is not an ANU researcher, then return the first result
                return possible_scholars[0][attribute] 
            else:
                # the algorithm using C-value methods and word2Vec
                # to be completed....
                return []
        else: # there is no such a person on google scholar
            return []
    
    # This Function is for external scholar
    def get_scholar_instance(self,name:str,keywords:str):

        possible_scholars = self.get_candidates_by_name(name)
        schoalar_list_length = len(possible_scholars)
        if schoalar_list_length == 1: # only one result, that's the person
            # print(possible_scholars[0]['interests'])
            return possible_scholars[0]
        elif schoalar_list_length >1:

            for k in possible_scholars: # we give ANU people priority
                if "anu" in k["email_domain"]:
                    return k
            possible_scholars = possible_scholars[0:2]
            # If this professor not an ANU researcher, then conduct the word2Vector comparison
            temp_dict = {}
            for i in range(len(possible_scholars)):
                search_doc = word2vector_nlp(keywords)
                main_doc = word2vector_nlp(', '.join(possible_scholars[i]['interests']))
                search_doc_nouns = word2vector_nlp(' '.join([str(t) for t in search_doc if t.pos_ in ['NOUN', 'PROPN']]))
                main_doc_nouns = word2vector_nlp(' '.join([str(t) for t in main_doc if t.pos_ in ['NOUN', 'PROPN']]))
                temp_dict[i] = search_doc_nouns.similarity(main_doc_nouns)

            index = max(temp_dict, key= temp_dict.get)
            return possible_scholars[index]
        else: # there is no such a person on google scholar
            return {}
    
    def get_organization(self,description: str):
        biography = ""
        for format in biography_formats:
            regexp_match = re.findall(format,description,flags=re.IGNORECASE)
            if len(regexp_match) != 0:
                biography = ' '.join(regexp_match)
                break

        parsed_biography = nlp(biography)
        possible_org_dict = {}
        for ent in parsed_biography.ents:
            length = len([i for i in university_feature_words if i in ent.text])
            if ent.label_ == "ORG" and length >= 1:
                # print(ent.text)
                possible_org_dict[ent.text] = length

        if len(possible_org_dict) != 0:
            return max(possible_org_dict, key= possible_org_dict.get)
        else:
            return "nan"
        