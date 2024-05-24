import re
from datetime import datetime

# datetime_filter_regex is used to determine whether it is a valid date time
datetime_filter_regex = r'\b(?:Mon|Tue|Wed|Thu|Fri|Sat|Sun|Monday|Tuesday|Wednesday|Thursday|Friday|Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:tember)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?)\b'
# datetime_regex is used to match the date time.
datetime_regex = '(?:Mon(?:day)?|Tue(?:sday)?|Wed(?:nesday)?|Thu(?:rsday)?|Fri(?:day)?|Sat(?:urday)?|Sun(?:day)?|Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:tember)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?|\d{4}|\d{1,2}(?::\d{1,2})?(?:am|pm)?|\d{1,2}|\–|\-|,)'
venue_filter_regex = r'\b(building|bldg|room|rm|theatre|theater|space|level|floor)\b'
DEFAULT_VALUE = 'To be confirmed'

# standard_datetime_regex to match only date, for formatting into standard datetime
standard_datetime_regex = r"\b(?:\d{1,2}\s(?:Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:tember)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?)|(?:Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:tember)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?)\s\d{1,2})\s\d{4}\b"

# Spacy default tokenizer always include '-' in the token, this pattern is to remove content behind '-' 
presenter_name_pattern = r"^(.*?)-"
class Data_Cleaner:
    def __init__(self) -> None:
        pass

    def clean_datetime(self,date:str):
        filter_pattern = re.compile(datetime_filter_regex, re.IGNORECASE)
        if re.search(filter_pattern, date):
            pattern = re.compile(datetime_regex)
            matches = pattern.findall(date)
            result = ' '.join(matches)
            return result
        else:
            return DEFAULT_VALUE

    def format_datetime(self, date:str):
        if date == DEFAULT_VALUE:
            return datetime.now()
        else:
            matches:str = re.findall(standard_datetime_regex, date)
            if matches:
                last_appearance_date = matches[-1]
                splitted_date =  last_appearance_date.split()
                if splitted_date[0].isdigit(): # the date format is Day Month Year

                    if len(splitted_date[1]) > 3: # the month is written in full name
                        standard_datetime = datetime.strptime(last_appearance_date, "%d %B %Y")
                    else: # the month is written in abbreviation name
                        standard_datetime = datetime.strptime(last_appearance_date, "%d %b %Y")
                    return standard_datetime
                
                else: # the date format is Month Day Year

                    if len(splitted_date[0]) > 3: # the month is written in full name
                        standard_datetime = datetime.strptime(last_appearance_date, "%B %d %Y")
                    else: # the month is written in abbreviation name
                        standard_datetime = datetime.strptime(last_appearance_date, "%b %d %Y")
                    return standard_datetime

            else:
                return datetime.now()
            
    def clean_venue(self,venue:str):
        venue_filter_pattern = re.compile(venue_filter_regex, re.IGNORECASE)
        if re.search(venue_filter_pattern, venue):
            venue = re.sub(r'\s+', ' ', venue).strip()
            filtered_venue = re.sub(r'^(?:Location:|location:|locat:)|[,\.]$', '', venue).strip()
            return filtered_venue
        else:
            return DEFAULT_VALUE
    
    def clean_event_data(self,event_data):
        event_data["date"] = self.clean_datetime(event_data["date"])
        event_data["venue"] = self.clean_venue(event_data["venue"])
        event_data["standard_datetime"] = self.format_datetime(event_data["date"])
        return event_data
    
    def clean_presenter_name(self,name:str):
        match = re.search(presenter_name_pattern, name)
        if match:
            result = match.group(1)
            return result.strip()
        else:
            return name
        
    def assemble_image_url(self,url,image_url,domain): # We assume that the image should be stored under the same domain
        if not image_url: # passed in parameter is None, then directly return None
            return None
        if url and image_url:
            if domain in image_url:
                return image_url
            else:
                return url + image_url