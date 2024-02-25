FROM nginx:1.25.4-alpine3.18

WORKDIR /home/scripts

COPY ./renew_letsencrypt.sh ./
RUN chmod a+x ./renew_letsencrypt.sh

RUN apk update \
    #&& apk add openssl \
    && apk add --update python3 py3-pip \
    && apk add certbot \
    && pip install certbot-nginx
