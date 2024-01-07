import re

datetime_regex = '(?:Mon(?:day)?|Tue(?:sday)?|Wed(?:nesday)?|Thu(?:rsday)?|Fri(?:day)?|Sat(?:urday)?|Sun(?:day)?|Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:tember)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?|\d{4}|\d{1,2}(?::\d{1,2})?(?:am|pm)?|\d{1,2}|\–|\-|,)'

class Data_Cleaner:
    def __init__(self) -> None:
        pass

    def clean_datetime(self,date:str):
        pattern = re.compile(datetime_regex)
        matches = pattern.findall(date)
        result = ' '.join(matches)
        return result
    
    def clean_venue(self,venue:str):
        venue = re.sub(r'\s+', ' ', venue).strip()
        filtered_venue = re.sub(r'^(?:Location:|location:|locat:)|[,\.]$', '', venue).strip()
        return filtered_venue
    
    def clean_event_data(self,event_data):
        event_data["date"] = self.clean_datetime(event_data["date"])
        event_data["venue"] = self.clean_venue(event_data["venue"])
        return event_data