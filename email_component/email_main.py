import sys, os
from pathlib import Path
path = Path(os.path.dirname(__file__))
sys.path.append(str(path.parent.absolute())) 
import smtplib, ssl
import datetime as dt
from copy import deepcopy
from email.mime.text import MIMEText
from scholar.recommender_system import *
import webbrowser
from bs4 import BeautifulSoup
from sqlalchemy import asc
from backend.models import *

from email.mime.multipart import MIMEMultipart
sys.setrecursionlimit(10000)

class EmailMain:
    def __init__(self):
        engine = db_connect()
        email_session = sessionmaker(bind=engine)
        self.db = email_session()
        self.GMAIL_USERNAME = "jei.seminars.bot"
        self.GMAIL_APP_PASSWORD = "zrgwneklkjoomdra"
        self.email_text = f"""
            Hi! This is the report from our script.
            
            We have added 1 + 2 and gotten the answer {1 + 2}.
            
            Bye!
            """
        self.recipients = self.db.query(Recipient.id, Recipient.email)
        # "../static/email_template/email_template.html" for tests
        self.html_file = open(sys.path[-1] + "/static/email_template/email_template.html")

        # "../static/email_template/seminar_component.html" for tests
        seminar_component_html = open(sys.path[-1] + "/static/email_template/seminar_component.html")
        self.bs_index = BeautifulSoup(self.html_file, 'html.parser')
        self.bs_seminars = BeautifulSoup(seminar_component_html, 'html.parser')

    def send(self):
        curr_time = dt.datetime.now()
        time_delta = dt.timedelta(days=14)

        event_lst = self.db.query(Event.id, Event.description, Event.title, Event.venue, Event.date, Event.url,
                                  Scholar.name).join(Scholar).order_by(asc(Event.standard_datetime)).filter(
                                      Event.standard_datetime > curr_time,
                                      Event.is_seminar == True
                                      )
        recommend_system = RecommenderSystem()
        interested_seminar_lst = recommend_system.getSeminarsOfPossibleInterest()
        for key in interested_seminar_lst:
            self.bs_index.find(id="LETTER_DATE").string = curr_time.strftime("%d %B, %Y")
            html_body = deepcopy(self.bs_index)
            # html_body = BeautifulSoup(self.html_file, 'html.parser')
            # print(str(html_body))
            target_text = html_body.find("p", {"id": "seminars"})
            for event_id in interested_seminar_lst[key]:
                for event in event_lst:
                    if event.id == event_id:
                        seminar = self.fillEventIntoHtml(event)
                        target_text.append(seminar)

            msg = MIMEText(str(html_body), 'html')
            msg["Subject"] = "Recommended Seminars for you: " + curr_time.strftime("%d %B, %Y")
            recipient_email = [recipient.email for recipient in self.recipients if key == recipient.id][0]

            print("recipient is" + recipient_email)
            msg["To"] = recipient_email
            msg["From"] = f"{self.GMAIL_USERNAME}@gmail.com"
            smtp_server = smtplib.SMTP_SSL('smtp.gmail.com', 465)
            smtp_server.login(self.GMAIL_USERNAME, self.GMAIL_APP_PASSWORD)
            smtp_server.sendmail(msg["From"], recipient_email, msg.as_string())
        smtp_server.quit()

    def verify(self):
        curr_time = dt.datetime.now()
        time_delta = dt.timedelta(days=14)

        event_lst = self.db.query(Event.description, Event.title, Event.venue, Event.date, Event.url,
                                  Scholar.name).join(Scholar).order_by(asc(Event.standard_datetime)).filter(
                                      Event.standard_datetime > curr_time,
                                      Event.is_seminar == True
                                      )

        self.bs_index.find(id="LETTER_DATE").string = curr_time.strftime("%d %B, %Y")
        old_text = self.bs_index.find("p", {"id": "seminars"})
        for event in event_lst:
            seminar = self.fillEventIntoHtml(event)
            old_text.append(seminar)

        # "../example_modified.html" for tests
        with open(sys.path[-1] +"/example_modified.html", "wb") as f_output:
            f_output.write(self.bs_index.prettify("utf-8"))
        webbrowser.open(sys.path[-1] +"/example_modified.html", new=2) # The new=2 parameter means opening in a new window or tab.

    def fillEventIntoHtml(self, event):
        seminar = deepcopy(self.bs_seminars)
        seminar.find(id="URL_PLACEHOLDER")['href'] = event.url if event.url else "None"
        seminar.find(id="TITLE_PLACEHOLDER").string = event.title if event.title else "None"
        seminar.find(id="PRESENTER_PLACEHOLDER").string = event.name if event.name else "None"
        seminar.find(id="DATETIME_PLACEHOLDER").string = event.date if event.date else "None"
        seminar.find(id="LOCATION_PLACEHOLDER").string = event.venue if event.venue else "None"
        seminar.find(id="DESCRIPTION_PLACEHOLDER").string = str(event.description)[:300] + "..."
        return seminar

    # ------------------------------------------------------------
    def generate_evaluation_emails(self):
        curr_time = dt.datetime.now()
        time_delta = dt.timedelta(days=14)

        event_lst = self.db.query(Event.id, Event.description, Event.title, Event.venue, Event.date, Event.url,
                                  Scholar.name).join(Scholar).filter(
                                    #   Event.standard_datetime > curr_time,
                                    #   Event.is_seminar == True
                                      )

        recommend_system = RecommenderSystem()
        interested_seminar_lst = recommend_system.getSeminarsOfPossibleInterest()
        for key in interested_seminar_lst:
            self.bs_index.find(id="LETTER_DATE").string = curr_time.strftime("%d %B, %Y")
            html_body = deepcopy(self.bs_index)
            # html_body = BeautifulSoup(self.html_file, 'html.parser')
            # print(str(html_body))
            target_text = html_body.find("p", {"id": "seminars"})
            for event_id in interested_seminar_lst[key]:
                for event in event_lst:
                    if event.id == event_id:
                        seminar = self.fillEventIntoHtml(event)
                        target_text.append(seminar)

            # "../example_modified.html" for tests
            recipient_name = self.db.query(Recipient.name).filter(Recipient.id == key).first().name
            with open(sys.path[-1] +"/tests/" +recipient_name+" threshold-"+str(int(threshold*100))+".html", "wb") as f_output:
                f_output.write(html_body.prettify("utf-8"))
            # webbrowser.open(sys.path[-1] +"/example_modified.html", new=2) # The new=2 parameter means opening in a new window or tab.