# Recommendation system

### How do recipients get their customized seminars which they may be interested in?

The related files lie in `scholar` folder in the root directory.



## Process_scholar.py



This file is responsible to manage both Scholar and Recipient tables in the database. 

1. Firstly, this file offers the function **remove_recipient_from_email** and **add_recipient_from_email** periodically update Recipient table in database based on **static/recipient_list/recipient_emails.csv**
2. Functions **get_attributes()** and **get_scholar_instance()** can get the recipients' interested research areas and the seminar presenters' main research areas. These information would be used in recommendation system.

## recommender_system.py

This file is responsible to provide interests matched seminars to each recipient. Currently, there are five extracted keywords for each seminars based on the abstract and descriptions. Also, for the presenter of that seminar, we've obtained their focused research areas. The database also stores the recipients' interested research fields.

Therefore, for each recipients and each seminar, the algorithm compares each recipients' interested research area and each seminar keyword and each presenter's focused research area. If any the Word2Vec comparison proceeds the threshold, match that seminar to the recipients. Here is the pseudocode illustrating the algorithm.

```python
for seminar in seminars:
    for recipient in recipients:
        for interest in recipient.interest:
            for keyword in presenter_focused_fields_and_seminar_keywords:
                search_doc = word2vector_nlp(interest)
                main_doc = word2vector_nlp(keyword)
                simi = search_doc.similarity(main_doc)
                if simi > threshold:
                     interested_seminar_dict.get(recipient).append(seminar)

```

