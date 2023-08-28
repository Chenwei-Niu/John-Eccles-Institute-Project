import scrapy
from scrapy import Request
import scraper.config as config
import scraper.key_terms_extractor.Keywords_extractor as Keywords_extractor
import spacy
import re

english_nlp = spacy.load('en_core_web_sm')

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
        description = self.get_description(response,event_info)
        event_data = {
            "title": response.xpath(event_info['title']).get(),
            "description": description,
            "speaker": self.get_speaker(response,description,event_info),
            "date": response.xpath(event_info['date']).get(),
            "venue": response.xpath(event_info['venue']).get(),
            "keywords":", ".join(Keywords_extractor.extract_keywords(description)),
        }
        # print("event data", event_data)
        # print(Keywords_extractor.extract_keywords(description))
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
    
    def get_speaker(self, response, description, event_info):
        # if there is a presenter HTML tag, then use it
        # otherwise, extract it from description
        if event_info['speaker'].isspace() or len(event_info['speaker']) == 0:
            return self.get_speaker_spacy(description) 
        else:
            return self.extract_human_name(response.xpath(event_info['speaker']).get())
        
    def get_speaker_spacy(self, description):
        description = description.replace("\n"," ")
        temp_dict = dict()
        spacy_parser = english_nlp(description)
        for entity in spacy_parser.ents:
            if entity.label_ == "PERSON":
                # For example, entity "Scott" would make the value of "Scott" and "Scott Sanner" increment
                for (key,value) in temp_dict.items():
                    if entity.text in key:
                        temp_dict[key] += 1
                        # For those name with two words, First name and Last name, give them higher priority
                        if key.count(" ") == 1:
                            temp_dict[key] += 1
                # if the dictionary doesn't contain the name, and the text doesn't contain numbers,
                # then add it into the dictionary
                if entity.text not in temp_dict and not bool(re.search(r'\d',entity.text)):
                    temp_dict[entity.text] = 2 if entity.text.count(" ") == 1 else 1 
        
        if len(temp_dict) != 0:
            return max(temp_dict, key= temp_dict.get)
        else:
            return "None"
    
    # For example: 
    # Strings like "Host : Professor Si Ming Man" and "Presenter: Tom Jones" after applying this function
    # would be "Si Ming Man" and "Tom Jones"
    def extract_human_name(self, string):
        spacy_parser = english_nlp(string)
        name_list = []
        for entity in spacy_parser.ents:
            if entity.label_ == "PERSON":
                name_list.append(entity.text)
        if len(name_list) == 0:
            return None
        elif len(name_list) == 1:
            return name_list[0]
        else:
            return " & ".join(name_list)
