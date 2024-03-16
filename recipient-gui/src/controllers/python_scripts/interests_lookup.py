import sys, os, re, time
from pathlib import Path
path = Path(os.path.dirname(__file__))
sys.path.append(str(path.parent.parent.parent.parent.absolute()))

from scholarly import scholarly, ProxyGenerator
from backend.models import *
from scholar.Process_scholar import Process_scholar, RECIPIENT_QUERY_LIMIT
import spacy

nlp = spacy.load("en_core_web_sm")
word2vector_nlp = spacy.load("en_core_web_lg")

process_scholar = Process_scholar()
pg = ProxyGenerator()
engine = db_connect()
Session = sessionmaker(bind=engine)
__session = Session()

def fetch_new_added_recipients():
    result = []
    result = __session.query(Recipient).filter(Recipient.interest == []).all()
    return result

def parse_name_from_email(email:str):
    username = email.split('@')[0]
    cleaned_username = re.sub(r'[-_=+~!#$%^&*(),.;:\'"`]', ' ', username)
    cleaned_username = re.sub(r'\s+', ' ', cleaned_username).strip()
    return cleaned_username

def parse_org_from_email(email:str):
    domain = re.search(r'@(\w+\.\w+)', email)
    if domain:
        domain_name = domain.group(1) 
        # If the scholar recipient is from the USA, then domain name would be the organization eg: stanford
        # However, if the scholar recipient is not from the US, then the domain name would be something like "anu.edu"
        # To get rid of the ".edu", here we introduce the subdivided_domain_name
        subdivided_domain_name = re.search(r'(\w+)\.\w+', domain_name)
        if subdivided_domain_name:
            return subdivided_domain_name.group(1)
        else:
            return domain_name
    else:
        return "nan"



def fetch_information_by_scholarly(recipient:Recipient):
    if recipient.name == "": 
        search_name = parse_name_from_email(recipient.email)
    else:
        search_name = recipient.name
    
    if recipient.organization == "":
        search_org = parse_org_from_email(recipient.email)
    else:
        search_org = recipient.organization

    possible_scholars = process_scholar.get_candidates_by_name_and_org(search_name,search_org,RECIPIENT_QUERY_LIMIT)
    schoalar_list_length = len(possible_scholars)
    print("Length of candidates list is", schoalar_list_length)
    if schoalar_list_length == 1:  # only one result, that's the person
        # print(possible_scholars[0]['interests'])
        return search_name, search_org, possible_scholars[0]['interests']
    elif schoalar_list_length > 1:
        for k in possible_scholars:  # we give ANU people priority
            if "anu" in k["email_domain"]:
                return search_name, search_org, k['interests']
        print("No one is from ANU")
    else:  # there is no such a person on Google Scholar
        print("No such person on Google Scholar")
        return search_name, search_org, ["no results from Google Scholar"]





new_added_recipient_list = fetch_new_added_recipients()
if len(new_added_recipient_list) > 0:
    for recipient in new_added_recipient_list:
        name, org, interests = fetch_information_by_scholarly(recipient)
        recipient.name = name
        recipient.organization = org
        recipient.interest = interests
        __session.commit()
        print(recipient)

        