import schedule
import datetime
import os
import sys
import time
from email_component.email_main import *

SCHOLAR_NUMBER = 0

"""
Execute the scrapy project via the system terminal
Once finished, with a printed string indicating the end of current crawling
"""


def execute_crawler():
    print("Crawl start: " + str(datetime.datetime.now()))
    if len(sys.argv) > 1 and sys.argv[1] == "-s": # s means Scholarly, fetch speakers interests while crawling seminars
        print("scrapy crawl event_spider -a mode=scholarly")
        os.system("scrapy crawl event_spider -a mode=scholarly")
    else:
        print("scrapy crawl event_spider -a mode=default")
        os.system("scrapy crawl event_spider -a mode=default") # default mode will not fetch speakers interests using Scholarly
                                                               # to avoid being banned by Google Scholar and interrupt the whole crawling process.
    print("Crawl finished: " + str(datetime.datetime.now()))

    """ Generate the verification email
     This part of code must be separated into another .py file, and invoke via os.system()
     Otherwise, the operational path of current program will change, making defects 
     that makes "scrapy crawl" command cannot find module "scrapy_component"
    """
    os.system("python generate_verify_email.py") 

"""
The main entrance of the whole system,
execute crawling and schedule the crawling routine
"""
def go():
    execute_crawler()

    # modify this line if you want to change the schedule of crawling
    schedule.every().wednesday.at("17:00").do(execute_crawler)
    # schedule.every(10).seconds.do(execute_crawler)
    while True:
        schedule.run_pending()
        time.sleep(1) # Let the process rest for 1 second to reduce CPU load


if __name__ == "__main__":
    go()
