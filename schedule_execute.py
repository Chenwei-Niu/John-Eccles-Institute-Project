import schedule
import datetime
import os
import sys
from email_component.email_main import *

SCHOLAR_NUMBER = 0

"""
Execute the scrapy project via the system terminal
Once finished, with a printed string indicating the end of current crawling
"""


def execute_crawler():
    print("Crawl start: " + str(datetime.datetime.now()))
    if len(sys.argv) > 1 and sys.argv[1] == "-s": # s means Scholarly, fetch speakers interests while crawling seminars
        print("scrapy crawl event-spider -a mode=scholarly")
        os.system("scrapy crawl event-spider -a mode=scholarly")
    else:
        print("scrapy crawl event-spider -a mode=default")
        os.system("scrapy crawl event-spider -a mode=default") # default mode will not fetch speakers interests using Scholarly
                                                               # to avoid being banned by Google Scholar and interrupt the whole crawling process.
    print("Crawl finished: " + str(datetime.datetime.now()))


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
