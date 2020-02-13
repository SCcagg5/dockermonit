# dockermonit

Solution to monitor your docker activities on diffrents servers

## Way that the system operates

1. one or multiple clients that read the datas exposed by the server(s)
2. one or multiple servers that expose the datas about the docker(s) they host

The system works on the output of `docker stats` that is formated by update.sh into a json in `index.html` that you have to expose to your `client` server

## Tech

### Server stats
**Configure your server(s)** The `update.sh` is launch by `bash update.sh &` to be launched in background, take care to modify the output of `index.html` to have it save in the folder that your server expose for example `/var/www/html/`


You can now check that your website print a json, save that URL for later

### Client
**Deploy your client** using docker simply go into `Client` and launch using `docker-compose`


```bash
docker-compose up -d --build
```

Your client is launch and is accessible on `http://localhost:80`

You can now add your server in the file `monitor/Client/js/conf.js` just adding into the json the name of your server and the URL of the json
```javascript
let servers = {
  "YOUR NAME": "YOUR URL"
}
```

### Map your dockers

To allow the client to display infos about your docker you simply have to got they named "yourname_map_whatever" or named nginx (easyer for me, using the image `jwilder/nginx`)
