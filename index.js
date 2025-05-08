const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const port = 3000;

const app = express();

let removeObjIfNoProp = (obj, bool) => {
	let keys = Object.keys(obj);
	let result = {};
	for (let key of keys) {
		if (obj[key] !== null && obj[key] !== undefined) result[key] = obj[key];
	}
	if (bool) {
		delete result.login;
		result = Object.assign({
			next: ''
		}, result)
	}
	return result;
}

let formParams = (email, pass, data) => {
	let obj = {}
	let $ = cheerio.load(data)
	obj.lsd = $('form').children('input[name=lsd]').attr('value')
	obj.fb_dstg = $('form').children('input[name=fb_dtsg]').attr('value')
	obj.nux_source = $('form').children('input[name=nux_source]').attr('value')
	obj.flow = $('form').children('input[name=flow]').attr('value')
	obj.jazoest = $('form').children('input[name=jazoest]').attr('value')
	obj.m_ts = $('form').children('input[name=m_ts]').attr('value')
	obj.li = $('form').children('input[name=li]').attr('value')
	obj.try_number = $('form').children('input[name=try_number]').attr('value')
	obj.unrecognized_tries = $('form').children('input[name=unrecognized_tries]').attr('value')
	//VISIBLE PARAMS
	obj.email = email
	obj.pass = pass
	obj.login = 'Log In'
	obj.bi_xrwh = $('form').children('input[name=bi_xrwh]').attr('value')
	return obj
}

let arr2obj = (arr) => {
	let result = arr.reduce((acc, current) => {
		let keyValue = current.split('=');
		acc[keyValue[0]] = keyValue[1];
		return acc;
	}, {});
	return result;
}


app.get('/fbcookie', async function(req, res) {
	let user = req.query.user;
	let pass = req.query.pass;
	try {
		if (!user) throw new Error('"user" parameter cannot be empty!');
		if (!pass) throw new Error('"pass" parameter cannot be empty!');
		let r1 = await axios.get('https:/\/mbasic.facebook.com/login')
		let cookie1 = r1.headers['set-cookie'].map(e => e.split(';')[0] + ';').join('')
		let config = formParams(user, pass, r1.data)
		config = removeObjIfNoProp(config)
		console.log("----------------------")
		console.log("cookie1",cookie1)
		let r2 = await axios.post('https://www.facebook.com/login.php', new URLSearchParams(config), {
			maxRedirects: 0,
			validateStatus: (status) => status >= 200 && status < 400,
			headers: {
				'cookie': cookie1,
				'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
				'accept-language': 'vi-VN,vi;q=0.9',
				'cache-control': 'max-age=0',
				'content-type': 'application/x-www-form-urlencoded',
				'origin': 'https://www.facebook.com',
				'priority': 'u=0, i',
				'referer': 'https://www.facebook.com/login/device-based/regular/login/?refsrc=deprecated&lwv=100&refid=8&_rdr',
				'sec-ch-ua': '"Google Chrome";v="129", "Not=A?Brand";v="8", "Chromium";v="129"',
				'sec-ch-ua-mobile': '?0',
				'sec-ch-ua-platform': '"Windows"',
				'sec-fetch-dest': 'document',
				'sec-fetch-mode': 'navigate',
				'sec-fetch-site': 'same-origin',
				'sec-fetch-user': '?1',
				'upgrade-insecure-requests': '1',
				'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36',
			}
		})
		console.log("cookie2",r2)
		let cookie2 = r2.headers['set-cookie'].map(e => e.split(';')[0] + ';')
		console.log("cookie2",cookie2)
		cookie2 = cookie2.join('')
		let datr = cookie1.split(';')
		let c2 = cookie2.split(';')
		datr.pop()
		c2.pop()
		c1 = arr2obj(datr)
		c2 = arr2obj(c2)
		let fbstate = [
			{"key": "datr",
			"value": c2.datr,
			"domain": "facebook.com",
			"path": "/",
			"hostOnly": false,
			"creation": new Date().toISOString(),
			"lastAccessed": new Date().toISOString()}
			, {
			"key": "sb",
			"value": c2.sb,
			"domain": "facebook.com",
			"path": "/",
			"hostOnly": false,
			"creation": new Date().toISOString(),
			"lastAccessed": new Date().toISOString()
		}, {
			"key": "c_user",
			"value": c2.c_user,
			"domain": "facebook.com",
			"path": "/",
			"hostOnly": false,
			"creation": new Date().toISOString(),
			"lastAccessed": new Date().toISOString()
		}, {
			"key": "xs",
			"value": c2.xs,
			"domain": "facebook.com",
			"path": "/",
			"hostOnly": false,
			"creation": new Date().toISOString(),
			"lastAccessed": new Date().toISOString()
		}, {
			"key": "fr",
			"value": c2.fr,
			"domain": "facebook.com",
			"path": "/",
			"hostOnly": false,
			"creation": new Date().toISOString(),
			"lastAccessed": new Date().toISOString()
		}, {
			"key": "ps_n",
			"value": "1",
			"domain": "facebook.com",
			"path": "/",
			"hostOnly": false,
			"creation": new Date().toISOString(),
			"lastAccessed": new Date().toISOString()
		}, {
			"key": "ps_l",
			"value": "1",
			"domain": "facebook.com",
			"path": "/",
			"hostOnly": false,
			"creation": new Date().toISOString(),
			"lastAccessed": new Date().toISOString()
		}, {
			"key": "locale",
			"value": "en_US",
			"domain": "facebook.com",
			"path": "/",
			"hostOnly": false,
			"creation": new Date().toISOString(),
			"lastAccessed": new Date().toISOString()
		}, {
			"key": "vpd",
			"value": "v1%3B634x360x2",
			"domain": "facebook.com",
			"path": "/",
			"hostOnly": false,
			"creation": new Date().toISOString(),
			"lastAccessed": new Date().toISOString()
		}, {
			"key": "fbl_st",
			"value": "100624173%3BT%3A28612000",
			"domain": "facebook.com",
			"path": "/",
			"hostOnly": false,
			"creation": new Date().toISOString(),
			"lastAccessed": new Date().toISOString()
		}, {
			"key": "wl_cbv",
			"value": "v2%3Bclient_version%3A2510%3Btimestamp%3A1716720049",
			"domain": "facebook.com",
			"path": "/",
			"hostOnly": false,
			"creation": new Date().toISOString(),
			"lastAccessed": new Date().toISOString()
		}]
		let cookieString = fbstate.map(cookie => `${cookie.key}=${cookie.value}`).join('; ');
		res.json({ cookies: cookieString });
	} catch (e) {
		if (!e.response) {
			res.send({
				error: e.message
			});
		} else {
			res.send({
				error: `${e.response.status} ${e.response.statusText}`,
				data: e.response.data.message
			});
		}
	}
}
);

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`)
})