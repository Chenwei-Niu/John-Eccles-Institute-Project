import sys, os
from pathlib import Path
path = Path(os.path.dirname(__file__))
sys.path.append(str(path.parent.absolute())) 
# The four lines above are required, so that this py file could detect other modules
from scholar.Process_scholar import *

# keywords = "motion capture, simulation results, research challenges, synthesis methods, data reconstruction"

# process_scholar = Process_scholar()
# person = process_scholar.get_scholar_instance("Ming Lin", keywords)
# print(person)

person = {'container_type': 'Author', 'filled': [], 'source':"<AuthorSource.SEARCH_AUTHOR_SNIPPETS: 'SEARCH_AUTHOR_SNIPPETS'>", 'scholar_id': 'ugFNit4AAAAJ', 'url_picture': 'https://scholar.google.com/citations?view_op=medium_photo&user=ugFNit4AAAAJ', 'name': 'Ming Lin', 'affiliation': 'Elizabeth Stevinson Iribe Professor, University of Maryland at College Park', 'email_domain': '@cs.umd.edu', 'interests': ['Computer Animation', 'Computer Graphics', 'Geometric Modeling', 'Robotics', 'Virtual Reality'], 'citedby': 39960}
print(len(person["email_domain"]) > 0)
organization = person["email_domain"].replace("@","")
print(organization)