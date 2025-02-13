"""
The code within this file was edited from
Li, X. (2018) Huanyannizu/c-value-term-extraction, GitHub. 
Available at: https://github.com/huanyannizu/C-Value-Term-Extraction 
(Accessed: 24 May 2024). 
"""
import math

class NoName:
    def word(self,word):
        self.word = word[0]
        self.tag = word[1]
        
    def substring(self,sub):
        self.L = len(sub)
        self.words = []
        self.tag = []
        for word in sub:
            self.words.append(word[0])
            self.tag.append(word[1])
        self.f = 0
        self.c = 0
        self.t = 0
        
    def CValue_non_nested(self):
        self.CValue = math.log2(self.L) * self.f
    
    def CValue_nested(self):
        self.CValue = math.log2(self.L) * (self.f - 1/self.c * self.t)
        
    def substringInitial(self,f):
        self.c = 1
        self.t = f
        
    def revise(self,f,t):
        self.c += 1
        self.t += f - t