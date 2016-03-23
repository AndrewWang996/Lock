import zerorpc, sys

c = zerorpc.Client()
c.connect("tcp://127.0.0.1:4242")

defaultCodeLength = 6

def digit():
        d = raw_input("enter digit")
        return d


def isDigit(d):
        try:
                return 0 <= int(d) <= 9
        except:
                return False

def getCode():
        
        code = ""
        
        while len(code) < defaultCodeLength:
                d = raw_input("enter digit")
                if isDigit(d):
                        code += str(d)
                else:
                        code = ""
                        print "Code cleared"
        
        return c.authenticate(code)


for code in ['985453', '079065', '878378', '101368']:
	print c.authenticate(code)

print getCode() # test git

'''
for name in """Hi team: 

Welcome to the first Intern email of 2016! First off, we're so excited that you will be joining us either in a couple weeks or this summer! 

I wanted to send an email so each of you have contact information of other interns so you can reach out, introduce yourself, talk about housing for the summer, etc. Of course I'm also here for a resource! 

If you are interested in starting on a different date than what's listed on your offer letter, please let me know and we can get it changed! The options are: May 23rd, or June 13th.

See you all soon!
Jess""".split():
	print c.hello(name)
'''

