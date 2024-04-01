from backend.models import *
import spacy

word2vector_nlp = spacy.load("en_core_web_lg")
threshold = 0.75


class RecommenderSystem:
    def __init__(self):
        engine = db_connect()
        Session = sessionmaker(bind=engine)
        self.db = Session()

    def getSeminarsOfPossibleInterest(self):
        # Helper function to be used later
        def loopEachRecipient():
            for interest in recipient.interest:
                for keyword in presenter_interest_and_keywords:
                    search_doc = word2vector_nlp(interest)
                    main_doc = word2vector_nlp(keyword)
                    if search_doc and search_doc.vector_norm: # Make sure search_doc is not None
                        if main_doc and main_doc.vector_norm: # Make sure main_doc is not None
                            simi = search_doc.similarity(main_doc)
                            if simi > threshold:
                                print(recipient.name + ": " + interest + ", " + keyword + ", " + str(simi))
                                if interested_seminar_dict.get(recipient.id):
                                    interested_seminar_dict.get(recipient.id).append(event.id)
                                else:
                                    interested_seminar_dict[recipient.id] = [event.id]
                                return

        event_lst = (self.db.query(Event.id, Event.title, Event.keywords, Scholar.interest).join(Scholar).filter(
            Event.speaker == Scholar.id).all())
        recipient_lst = self.db.query(Recipient).all()
        interested_seminar_dict = {}

        for event in event_lst:
            print(event.title)
            presenter_interest_and_keywords = []
            presenter_interest_and_keywords = event.keywords.split(",") + event.interest
            for recipient in recipient_lst:
                loopEachRecipient()

        print(interested_seminar_dict)
        return interested_seminar_dict
