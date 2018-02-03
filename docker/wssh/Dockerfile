FROM ubuntu
WORKDIR /docker
ADD . /docker
RUN apt-get update && apt-get install -y build-essential openssh-client perl sshpass && cpan Term::ReadKey

RUN echo '\nStrictHostKeyChecking no\nUserKnownHostsFile /dev/null\nLogLevel QUIET' >> /etc/ssh/ssh_config
CMD ["sh", "start.sh"]
