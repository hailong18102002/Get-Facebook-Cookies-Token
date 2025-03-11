import requests
import re
def getAccessToken(user="",password=""):
    print("user",user,"pass_word",password)
    url = 'http://localhost:3000/fbcookie'
    params = {
        'user': user,
        'pass': password
    }
    response = requests.get(url, params=params)
    print("get token response:", response.json())
    cookie =response.json().get('cookies', None)
    data = requests.get('https://business.facebook.com/business_locations', headers = {
        'user-agent'                : 'Mozilla/5.0 (Linux; Android 8.1.0; MI 8 Build/OPM1.171019.011) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/69.0.3497.86 Mobile Safari/537.36', # don't change this user agent.
        'referer'                   : 'https://www.facebook.com/',
        'host'                      : 'business.facebook.com',
        'origin'                    : 'https://business.facebook.com',
        'upgrade-insecure-requests' : '1',
        'accept-language'           : 'id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7',
        'cache-control'             : 'max-age=0',
        'accept'                    : 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
        'content-type'              : 'text/html; charset=utf-8'
    }, cookies = {
        'cookie'                    : cookie
    })
    print("cookie",cookie)
    find_token = re.search('(EAAG\w+)', data.text)
    results    = '\n* Fail : maybe your cookie invalid !!' if (find_token is None) else '\n* Your fb access token : ' + find_token.group(1)
    token = find_token.group(1)
    return token, cookie
