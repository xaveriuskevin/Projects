import os
from dotenv import load_dotenv
import telebot
import psutil
from datetime import datetime
import subprocess
import time
from pathlib import Path
import requests



# load API_KEY from .env
load_dotenv()
API_KEY = os.getenv("API_KEY")
CHATID  = os.getenv("CHAT_ID")
SVRNAME = os.getenv("SVRNAME")
WORKINGDIR = os.getenv("WORKINGDIR")
serverStat = str(WORKINGDIR) + "serverStat.txt"
tmplogfile = str(WORKINGDIR) + "tmp-runningprocess.txt"

# make a connection to bot
bot = telebot.TeleBot(API_KEY)

#=====================================================
# start check external URL WEB APP
URL2CHECKWEB = os.getenv("URL2CHECKWEB")
flagfileweb_url = str(WORKINGDIR) + "export_weburldown.txt"
responseMsgWeb_URL = ""
if (os.path.exists(flagfileweb_url)):
    URLWebwasDown = True
else:
    URLWebwasDown = False

try:
    get = requests.get(str(URL2CHECKWEB))
    if (get.status_code == 200 and URLWebwasDown == True):
        responseMsgWeb_URL = str(URL2CHECKWEB) + " is reachable again.\n"
        os.remove(flagfileweb_url)
    elif (get.status_code != 200 and URLWebwasDown == False):
        responseMsgWeb_URL = str(URL2CHECKWEB) + " --> is UNREACHABLE (Error: " + str(get.status_code) + ")\n" 
        setFlag = open(flagfileweb_url, 'x')
        setFlag.close()
        #command , in my project the command is for restarting the server
        subprocess.Popen('yourcommand', shell=True)
#Exception
except requests.exceptions.RequestException as e:
    if (URLWebwasDown == False):
        responseMsgWeb_URL = str(URL2CHECKWEB) + " --> is UNREACHABLE \nErr: " + e + "\n"
        setFlag = open(flagfileweb_url, 'x')
        setFlag.close()

if (responseMsgWeb_URL != ""):
    responseMsgWeb_URL += "\nServer time: " + datetime.now().strftime('%d-%b-%Y %H:%M:%S') + "\n"
    bot.send_message(CHATID, responseMsgWeb_URL)

#=====================================================
# start check external URL API
URL2CHECK = os.getenv("URL2CHECK")
flagfile_url = str(WORKINGDIR) + "export_urldown.txt"
responseMsg_URL = ""
if (os.path.exists(flagfile_url)):
    URLwasDown = True
else:
    URLwasDown = False

try:
    get = requests.get(str(URL2CHECK))
    if (get.status_code == 200 and URLwasDown == True):
        responseMsg_URL = str(URL2CHECK) + " is reachable again.\n"
        os.remove(flagfile_url)
    elif (get.status_code != 200 and URLwasDown == False):
        responseMsg_URL = str(URL2CHECK) + " --> is UNREACHABLE (Error: " + str(get.status_code) + ")\n" 
        setFlag = open(flagfile_url, 'x')
        setFlag.close()
        #command , in my project the command is for restarting the server
        subprocess.Popen('yourcommand', shell=True)
#Exception
except requests.exceptions.RequestException as e:
    if (URLwasDown == False):
        responseMsg_URL = str(URL2CHECK) + " --> is UNREACHABLE \nErr: " + e + "\n"
        setFlag = open(flagfile_url, 'x')
        setFlag.close()

if (responseMsg_URL != ""):
    responseMsg_URL += "\nServer time: " + datetime.now().strftime('%d-%b-%Y %H:%M:%S') + "\n"
    bot.send_message(CHATID, responseMsg_URL)

#===================================================

# variables initialization
threshold_env = os.getenv("THRESHOLD")
threshold = int(threshold_env) 

limit_env= os.getenv("LIMIT")
limit = int(limit_env)

#check flag file, was previous check result also high/not
if os.path.exists(serverStat):
    f = open(serverStat, "r")
    highCount_str = f.read()
    f.close()
    # print(highCount_str)
    wasHigh = True
    highCount = int(highCount_str)
    # print(highCount)
else:
    highCount = 0
    wasHigh = False

# checking cpu/memory usage
cpu_usage = int(psutil.cpu_percent(interval=1))
mem_usage = int(psutil.virtual_memory().percent)
mem = int(psutil.virtual_memory().total)
mem_in_gb = mem / 1000 / 1000 / 1000
mem_total = round(mem_in_gb)
disk_usage = int(psutil.disk_usage('/').percent)
disk = int(psutil.disk_usage('/').total)
disk_in_gb = disk / 1000 / 1000 / 1000
disk_total = round(disk_in_gb)

if (cpu_usage > threshold or mem_usage > threshold or disk_usage > threshold):
    highCount += 1
    sCmd = "echo " + str(highCount) + " > " + serverStat
    subprocess.run(sCmd, shell=True)
    #sCmd = "echo Docker status: > " + tmplogfile +  "; docker ps --format 'table {{.Names}}  -->  {{.Status}}' >>  " + tmplogfile
    #kolomSort = "%mem,%cpu,cmd" 

    #if (cpu_usage > mem_usage):
        #kolomSort = "%cpu,%mem,cmd"
    
    sCmd = "echo Top running process: > " + tmplogfile +  " && ps -eo " + kolomSort + "|head -1 >> " + tmplogfile
    sCmd += "; echo --------------------------------------------------------- >> " + tmplogfile
    sCmd += "; ps axw -eo " + kolomSort + " |sort -rn|head -3 >> " + tmplogfile + ";"

    #subprocess.run(sCmd, shell=True)
    #time.sleep(2)
    #msgLog = Path(tmplogfile).read_text()

    timer = highCount * 5        
    msg =  "Counter : " + str(highCount) + " (WARNING!)\n" + str(SVRNAME) + " server is in high load for " + str(timer) + " Minutes\n"
    msg += "Threshold : " + str(threshold) + "%\n"
    msg += "Memory: " + str(mem_usage) +"% / " + str(mem_total) + " GB \n"
    msg += "CPU: " + str(cpu_usage) + "%\n"
    msg += "Disk: " + str(disk_usage) + "% / " + str(disk_total) + " GB \n"
    msg += "Server time: " + datetime.now().strftime('%d-%b-%Y %H:%M:%S')
    msg += "\n--------------------------------"
    #msg += "\n\n" + msgLog
    print(msg)
    # always send to private chat, if you wanted to
    bot.send_message("yourtelegramchatid", msg)
    
    #send alert to tele bot only if previous check was high load + this is second check or every 5th check
    if (wasHigh and (highCount == 2 or highCount%limit == 0)):
        bot.send_message(CHATID, msg)
else:
    #was high load and now cooling down, remove flag file + send message to tele bot
    if wasHigh:
        os.remove(serverStat)
        if highCount > 1:
            msg =   str(SVRNAME) + " server is cooling down.\n"
            msg += "Threshold : " + str(threshold) + "%\n"
            msg += "CPU: " + str(cpu_usage) + "%\n"
            msg += "Memory: " + str(mem_usage) +"% / " + str(mem_total) + " GB \n"
            msg += "Disk: " + str(disk_usage) + "% / " + str(disk_total) + " GB \n"
            msg += "Server time: " + datetime.now().strftime('%d-%b-%Y %H:%M:%S')
            bot.send_message(CHATID, msg)