# Digital Passport
This is a project for a certain company.
Problem : The website sometimes has a severe issues, like bad API call , errors in a weird way. it's usually causes by the CPU , Memory or Disk
Solution : make a python program to put in CRON, to check the website every certain minutes if it's down or not and check the percentage of the CPU, Memory and disk

so the program will check if the given URL is down or not. if the website is down, it will send a notification in the telegram Bot and restart the server
if the program is previously down and now isn't , it will also send a notification. if the next CRON command doesn't come when it's previously down you can check what's the real problem.

It will also check the percentage of CPU,Memory and disk and if already past the threshold/limit it will send you a notification. For mine after twice running CRON command the percentage isn't below the threshold. then it will send the notification , and when it's cools down it will also send the notification


This is a Real Project so there are several details missing. But I hope it can helps

# Language
Program = Pyhton
