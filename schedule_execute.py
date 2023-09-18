import schedule
import datetime
import os
from scrapy import cmdline
import time
import pandas as pd
from scholar import Process_scholar

SCHOLAR_NUMBER = 0


def execute_crawler():
    os.system("scrapy crawl event-spider")
    print("Crawl executed: "+ str(datetime.datetime.now()))

# Once a week, check if there is new scholar added
def update_scholar():
    global SCHOLAR_NUMBER
    ps = Process_scholar.Process_scholar()
    df = pd.read_csv('static/scholar_list/scholar_emails.csv')
    length = len(df)
    if length < SCHOLAR_NUMBER: # someone unsubscribes the email
        # need to modify database, make is_recipient attribute false
        # ....
        ps.remove_recipient_from_email(df.loc[0:length])
        SCHOLAR_NUMBER = length

    if length > SCHOLAR_NUMBER:
         ps.add_recipient_from_email(df.loc[SCHOLAR_NUMBER:length])
         SCHOLAR_NUMBER = length

    
def go():
    execute_crawler()
    update_scholar()
    # modify this line if you want to change the schedule of crawling
    schedule.every().wednesday.at("17:00").do(execute_crawler)
    # schedule.every().wednesday.at("17:00").do(update_scholar)
    while True:
        schedule.run_pending()


if __name__ == "__main__":
    go()