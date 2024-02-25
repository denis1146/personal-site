# Project Deployment

1. Archive current folder: `tar czf archive.tar.gz ./docker/`
1. Copy the archive to the remote computer: `scp ./archive.tar.gz user@[remoteServer/ip]:/home/archive.tar.gz`
1. Connect to a remote computer: `ssh user@[remoteServer/ip]`
1. Go to the folder: `cd /home/`
1. Let's create a directory for unzipping the archive: `mkdir -p ./projects/deployment/`
1. Unzip archive: `tar xvzf archive.tar.gz --directory /home/projects/deployment/`
1. Go to the folder: `cd /home/projects/deployment/docker/`
1. Launch docker compose: `docker compose up -d`

## HTTPS configuration and certificate generation

1. Connect to a container: `docker container exec -it ps-nginx /bin/ash`
1. Сertificate generation (*/etc/letsencrypt/live/personal-site.info/*): `certbot certonly --nginx -d personal-site.info --register-unsafely-without-email`
1. In the *nginx.conf* file, uncomment the directives for Certbot.
1. Add *ssl* value to *listen 443* directive.
1. The *nginx.conf* file has the ability to redirect all requests to https. See nginx.conf file.
1. Restart Nginx: `nginx -s reload`
