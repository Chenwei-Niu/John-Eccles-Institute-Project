import schedule
import datetime
import os
from scrapy import cmdline
def execute_crawler():
    os.system("scrapy crawl event-spider")
    print("Crawl executed: "+ str(datetime.datetime.now()))

def go():
    execute_crawler()
    # modify this line if you want to change the schedule of crawling
    schedule.every().wednesday.at("17:00").do(execute_crawler)
    while True:
        schedule.run_pending()


if __name__ == "__main__":
    go()