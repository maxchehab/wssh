FROM ubuntu
WORKDIR /docker
ADD . /docker
RUN apt-get update && apt-get install -y openssh-client perl

RUN echo '\nStrictHostKeyChecking no\nUserKnownHostsFile /dev/null\nLogLevel QUIET' >> /etc/ssh/ssh_config
CMD ["sh", "start.sh"]
