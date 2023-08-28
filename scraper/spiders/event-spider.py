import scrapy
from scrapy import Request
import scraper.config as config


class EventSpider(scrapy.Spider):
    name = config.SPIDER_NAME

    def start_requests(self):
        for webpage in config.EVENTS_URLS:
            yield Request(config.EVENTS_URLS[webpage]["url"], callback=self.parse_event_list,
                          meta={"webpage": webpage})

    def parse_event_list(self, response):
        webpage = response.meta.get("webpage")
        page_config = config.EVENTS_URLS[webpage]

        event_list = response.xpath(page_config["xpath"]["event_list"])
        for event_item in event_list:
            # get the url based on the xpath
            url = event_item.xpath(page_config["xpath"]["event_item"]).get()
            # some urls do not include the domain, if there isn't a scheme and domain, we add it on
            if page_config["domain"] not in url:
                url = page_config["domain"] + url
            yield Request(url, callback=self.parse_event, meta={"event_info": page_config['xpath']['event_info']})

    def parse_event(self, response):
        event_info = response.meta.get("event_info")
        event_data = {
            "title": response.xpath(event_info['title']).get(),
            "description": self.get_description(response,event_info),
            # "speaker": response.xpath(event_info['speaker']).get(),
            "date": response.xpath(event_info['date']).get(),
            "venue": response.xpath(event_info['venue']).get(),
        }
        print("event data", event_data)
        yield event_data

    # The description could be several paragraphs
    # This function is used to combine several paragraphs into one
    def get_description(self, response,event_info):
        description = response.xpath(event_info['description']).extract()
        description_length = len(description)
        if ( description_length == 1):
            description = description[0]
        else:
            description = ''.join(description)
        return description