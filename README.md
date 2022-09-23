This is a webpack server designed for serving lil threejs sketches on a remote machine. 
You can run it from root using `npm run dev`.
Right now it's set up to work with folders in  `js` named `dayN` because I use it for daily sketches. In the `src/js` folder, you can run `cp -r day{yesterday} day{today}` to make a new sketch and automatically serve it from `your_url.com/three/day_{whatever}`.

This is very much a work in progress - there are some utility scripts in `components` and `utils`, but I can't guarantee they all work as this was a pretty major refactor of my old method of daily sketching.

You'll need a sample nginx setup like the one below:
```
map $http_upgrade $connection_upgrade {
        default upgrade;
        '' close;
    }

server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;

    server_name {your_server};
    root /home/{user}/system/nginx-root; # Used for acme.sh SSL verification (https://acme.sh)

    ssl_certificate {your_ssl};
    ssl_certificate_key {your_key};
    include /etc/nginx/snippets/ssl-params.conf;


    location /three/ {
        proxy_pass http://127.0.0.1:8081/;
    }

    location /ws {
        proxy_set_header X-Real-IP  $remote_addr;
        proxy_set_header X-Forwarded-For $remote_addr;
        proxy_set_header Host $host;

        proxy_pass http://127.0.0.1:8081/ws; 


        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }

    location ~ /.well-known {
        allow all;
    }

    client_max_body_size 1g;
}

```

