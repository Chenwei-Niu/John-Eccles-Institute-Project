import schedule
import datetime
import os
from scrapy import cmdline
import time
import pandas as pd
from scholar import Process_scholar
from email_component.email_main import *

SCHOLAR_NUMBER = 0

"""
Execute the scrapy project via the system terminal
Once finished, with a printed string indicating the end of current crawling
"""


def execute_crawler():
    print("Crawl start: " + str(datetime.datetime.now()))
    os.system("scrapy crawl event-spider")
    print("Crawl finished: " + str(datetime.datetime.now()))


"""
Once a week, check if there is new scholar added,
If any recipient has been deleted, the database could also keep track of that
"""


def update_scholar():
    global SCHOLAR_NUMBER
    ps = Process_scholar.Process_scholar()
    df = pd.read_csv('static/recipient_list/recipient_emails.csv')
    length = len(df)
    if length < SCHOLAR_NUMBER:  # someone unsubscribes the email
        # need to modify database, make is_recipient attribute false
        # ....
        ps.remove_recipient_from_email(df.loc[0:length])
        SCHOLAR_NUMBER = length

    if length > SCHOLAR_NUMBER:
        ps.add_recipient_from_email(df.loc[SCHOLAR_NUMBER:length])
        SCHOLAR_NUMBER = length


"""
The main entrance of the whole system,
execute crawling and schedule the crawling routine
"""
def go():
    execute_crawler()
    # update_scholar()
    email_main = EmailMain()
    email_main.verify()
    # modify this line if you want to change the schedule of crawling
    schedule.every().wednesday.at("17:00").do(execute_crawler)
    # schedule.every().wednesday.at("17:30").do(update_scholar)
    # schedule.every().wednesday.at("18:00").do(email_main.verify())
    while True:
        schedule.run_pending()


if __name__ == "__main__":
    go()
