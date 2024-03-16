import sys, os, re, time
from pathlib import Path
path = Path(os.path.dirname(__file__))
sys.path.append(str(path.parent.parent.parent.parent.absolute()))
from scrapy_component.data_filter.data_clean import Data_Cleaner
data_cleaner = Data_Cleaner()
print(data_cleaner.format_datetime(sys.argv[1]))