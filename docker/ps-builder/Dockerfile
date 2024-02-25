FROM node:21-alpine3.18

ENV GIT_REPO none
ENV GIT_BRANCH none
ENV TARGET_DIR none

WORKDIR /home/build

COPY ./entrypoint.sh ./
RUN chmod 777 ./entrypoint.sh
ENTRYPOINT ["./entrypoint.sh"]
