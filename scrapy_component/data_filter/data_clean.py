import re

# datetime_filter_regex is used to determine whether it is a valid date time
datetime_filter_regex = r'\b(?:Mon|Tue|Wed|Thu|Fri|Sat|Sun|Monday|Tuesday|Wednesday|Thursday|Friday|Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:tember)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?)\b'
# datetime_regex is used to match the date time.
datetime_regex = '(?:Mon(?:day)?|Tue(?:sday)?|Wed(?:nesday)?|Thu(?:rsday)?|Fri(?:day)?|Sat(?:urday)?|Sun(?:day)?|Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:tember)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?|\d{4}|\d{1,2}(?::\d{1,2})?(?:am|pm)?|\d{1,2}|\–|\-|,)'
venue_filter_regex = r'\b(building|bldg|room|rm|theatre|theater|space|level|floor)\b'
DEFAULT_VALUE = 'To be confirmed'

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
        return event_data