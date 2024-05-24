import time
import re
from scholarly import scholarly, ProxyGenerator
from backend.models import *
from sqlalchemy.orm import sessionmaker
import spacy

word2vector_nlp = spacy.load("en_core_web_lg")
biography_formats = [
    r'Biography([\s\S]+)',
    r'Biography\s?:?\s?(.*)',
    r'Biography\s?:?\s?\n+(.*)',
    r'Bio([\s\S]+)',
    r'Bio\s?:?\s?(.*)',
    r'Bio\s?:?\s?\n+(.*)',
]
SCHOLAR_QUERY_LIMIT = 15
RECIPIENT_QUERY_LIMIT = 10

university_feature_words = ["University", "College", "Uni", "U", "Institution", "of", "Institute"]
pg = ProxyGenerator()

class Process_scholar:
    def __init__(self):
        self.name_matcher = r'([\w]+)\.([\w]+)@([\w]+)\.edu\.au'
        engine = db_connect()
        self.Session = sessionmaker(bind=engine)

    def get_candidates_by_name_and_org(self, name: str, organization: str, query_limit:int):
        if organization == "nan":
            query = '"' + name + '"'
        else:
            query = '"' + name + '", ' + organization
        pg.FreeProxies()
        scholarly.use_proxy(pg)
        search_query = scholarly.search_author(query)
        possible_scholars = []
        while True:
            pg.FreeProxies()
            scholarly.use_proxy(pg)
            try:
                scholar_result = next(search_query)
                time.sleep(0.08)
                possible_scholars.append(scholar_result)
                query_limit -= 1
                if query_limit <= 0:
                    print("Exceeds the query limit number and jumps out of the loop")
                    break
            except StopIteration:
                print("Scholarly Exception. unknown problem encountered (may be IP temporarily banned or proxy problem)")
                break
        return possible_scholars

    def get_candidates_by_name(self, name: str, query_limit:int):
        query = '"' + name + '"'
        pg.FreeProxies()
        scholarly.use_proxy(pg)
        search_query = scholarly.search_author(query)
        possible_scholars = []
        while True:
            pg.FreeProxies()
            scholarly.use_proxy(pg)
            try:
                scholar_result = next(search_query)
                time.sleep(0.08)
                possible_scholars.append(scholar_result)
                query_limit -= 1
                if query_limit <= 0:
                    print("Exceeds the query limit number and jumps out of the loop")
                    break
            except StopIteration:
                print("Scholarly Exception. unknown problem encountered (may be IP temporarily banned or proxy problem)")
                break
        return possible_scholars

    # This function is for recipients only
    def get_attributes(self, name: str, organization: str, attribute: str):

        possible_scholars = self.get_candidates_by_name_and_org(name, organization, SCHOLAR_QUERY_LIMIT)
        schoalar_list_length = len(possible_scholars)
        if schoalar_list_length == 1:  # only one result, that's the person
            # print(possible_scholars[0]['interests'])
            return possible_scholars[0][attribute]
        elif schoalar_list_length > 1:
            if organization != "anu":  # if the scholar is not an ANU researcher, then return the first result
                return possible_scholars[0][attribute]
            else:
                # the algorithm using C-value methods and word2Vec
                # to be completed....
                return []
        else:  # there is no such a person on Google Scholar
            return []

    # This Function is for external scholar
    def get_scholar_instance(self, name: str, keywords: str):
        if name == None or name == "" or name == "None" or "&" in name: # Do not waste time to fetch if the name is None or empty or contains '&'
            return {}
        possible_scholars = self.get_candidates_by_name(name,SCHOLAR_QUERY_LIMIT)
        schoalar_list_length = len(possible_scholars)
        print("Length of candidates list is", schoalar_list_length)
        if schoalar_list_length == 1:  # only one result, that's the person
            # print(possible_scholars[0]['interests'])
            return possible_scholars[0]
        elif schoalar_list_length > 1:

            for k in possible_scholars:  # we give ANU people priority
                if "anu" in k["email_domain"]:
                    return k
            print("No one is from ANU")
            possible_scholars = possible_scholars[0:2]
            # If this professor not an ANU researcher, then conduct the word2Vector comparison
            temp_dict = {}
            for i in range(len(possible_scholars)):
                search_doc = word2vector_nlp(keywords)
                main_doc = word2vector_nlp(', '.join(possible_scholars[i]['interests']))
                search_doc_nouns = word2vector_nlp(
                    ' '.join([str(t) for t in search_doc if t.pos_ in ['NOUN', 'PROPN']]))
                main_doc_nouns = word2vector_nlp(' '.join([str(t) for t in main_doc if t.pos_ in ['NOUN', 'PROPN']]))
                temp_dict[i] = search_doc_nouns.similarity(main_doc_nouns)

            index = max(temp_dict, key=temp_dict.get)
            print(temp_dict)
            print(index)
            return possible_scholars[index]
        else:  # there is no such a person on Google Scholar
            return {}

    def get_organization(self, description: str):
        biography = ""
        for format in biography_formats:
            regexp_match = re.findall(format, description, flags=re.IGNORECASE)
            if len(regexp_match) != 0:
                biography = ' '.join(regexp_match)
                break

        parsed_biography = word2vector_nlp(biography)
        possible_org_dict = {}
        for ent in parsed_biography.ents:
            length = len([i for i in university_feature_words if i in ent.text])
            if ent.label_ == "ORG" and length >= 1:
                # print(ent.text)
                possible_org_dict[ent.text] = length

        if len(possible_org_dict) != 0:
            return max(possible_org_dict, key=possible_org_dict.get)
        else:
            return "nan"
