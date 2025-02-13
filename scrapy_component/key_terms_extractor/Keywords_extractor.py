"""
The code within this file was edited from
Li, X. (2018) Huanyannizu/c-value-term-extraction, GitHub. 
Available at: https://github.com/huanyannizu/C-Value-Term-Extraction 
(Accessed: 24 May 2024). 
"""

import time
import nltk

starttime = time.time()
from scrapy_component.key_terms_extractor.Word_object import NoName
from scrapy.utils.project import get_project_settings
import re

noun = ['NN', 'NNS', 'NNP', 'NNPS']  # tags of noun
adj = ['JJ']  # tags of adjective
pre = ['IN']  # tags of preposition

abstract_formats = [
    r'Abstract([\s\S]+)Biography',
    r'Abstract\s?:?\s?(.*)',
    r'Abstract\s?:?\s?\n+(.*)',
    r'([\s\S]+)Biography'
]
'''
The results are saved in a dictionary named candidate, 
candidate[m] prints out a list of candidate string objects of length m
m ranges from 2 to L
'''


def extract_keywords(f: str):
    lingui_filter = get_project_settings().get("LINGUISTIC_FILTER")
    L = get_project_settings().get("MAX_LEN")
    freq_threshold = get_project_settings().get("FREQUENCY_THRESHOLD")
    CValue_threshold = get_project_settings().get("C_VALUE_THRESHOLD")

    candidate = candidate = dict([(key, []) for key in range(2, L + 1)])

    # at this stage, variable f is the abstract content

    # print(f)
    text = nltk.word_tokenize(f)
    pos_tagged = nltk.pos_tag(text)
    n_words = len(pos_tagged)
    start = 0
    while start <= n_words - 2:
        i = start;
        noun_ind = [];
        pre_ind = [];
        pre_exist = False
        while True:
            if i == n_words - 1: end = i;break
            word = NoName();
            word.word(pos_tagged[i])
            if word.tag in noun:
                noun_ind.append(i);
                i += 1
            elif (lingui_filter == ('AdjNoun' or 'AdjPrepNoun')) and word.tag in adj:
                word_next = NoName();
                word_next.word(pos_tagged[i + 1])
                if word_next.tag in noun:
                    noun_ind.append(i + 1);
                    i += 2
                elif word_next.tag in adj:
                    i += 2
                else:
                    end = i + 1;
                    break
            elif (lingui_filter == 'AdjPrepNoun') and not pre_exist and i != 0 and (word.tag in pre):
                pre_ind.append(i)
                pre_exist = True
                i += 1
            else:
                end = i;
                break
        # print(1111)
        if len(noun_ind) != 0:
            for i in list(set(range(start, noun_ind[-1])) - set(pre_ind)):
                for j in noun_ind:
                    if j - i >= 1 and j - i <= L - 1:
                        substring = NoName()
                        substring.substring(pos_tagged[i:j + 1])
                        exist = False
                        for x in candidate[j - i + 1]:
                            if x.words == substring.words: x.f += 1; exist = True
                        if not exist:
                            candidate[j - i + 1].append(substring);
                            substring.f = 1
        start = end + 1

    ##Remove candidate strings with low frequency and sort them##################################################################################
    for i in range(2, L + 1):
        candidate[i] = [x for x in candidate[i] if x.f > freq_threshold]
        candidate[i].sort(key=lambda x: x.f, reverse=True)

        ##Compute C-Value##################################################################################
    Term = []
    for l in reversed(range(2, L + 1)):
        candi = candidate[l]
        for phrase in candi:
            if phrase.c == 0:
                phrase.CValue_non_nested()
            else:
                phrase.CValue_nested()

            if phrase.CValue >= CValue_threshold:
                Term.append(phrase)
                for j in range(2, phrase.L):
                    for i in range(phrase.L - j + 1):
                        substring = phrase.words[i:i + j]
                        for x in candidate[j]:
                            if substring == x.words:
                                x.substringInitial(phrase.f)
                                for m in Term:
                                    if ' '.join(x.words) in ' '.join(m.words):
                                        x.revise(m.f, m.t)

    Term.sort(key=lambda x: x.CValue, reverse=True)
    keywords_lst = []
    for i in Term[0:5]:  # Only get the first 5
        keywords_lst.append(' '.join(i.words))
    return keywords_lst


def getAbstract(f: str):
    # extract abstract from the whole description
    for FORMAT in abstract_formats:
        regexp_match = re.findall(FORMAT, f, flags=re.IGNORECASE)
        if len(regexp_match) != 0:
            f = ' '.join(regexp_match)
            break
    return f

##Print out terms with top-10 C-Value##################################################################################
# import pandas as pd
# result = pd.DataFrame(index=range(10),columns=['Term','C-Value','Frequency','Tags']) 
# i = -1
# for x in Term[0:10]:
#     i += 1
#     result['Term'][i] = ' '.join(x.words)
#     result['C-Value'][i] = x.CValue
#     result['Frequency'][i] = x.f
#     result['Tags'][i] = x.tag
# print(result)

# endtime=time.time()
# print('Running time: ' + str((endtime-starttime)/60.0) + ' min')
