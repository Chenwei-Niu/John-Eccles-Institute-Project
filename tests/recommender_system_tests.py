import sys, os
from pathlib import Path
path = Path(os.path.dirname(__file__))
sys.path.append(str(path.parent.absolute())) 
# The four lines above are required, so that this py file could detect other modules

from scholar.recommender_system import *
recommendation_system = RecommenderSystem()
recommendation_system.getSeminarsOfPossibleInterest()