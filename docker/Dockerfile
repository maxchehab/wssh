FROM ubuntu
WORKDIR /docker
ADD . /docker
RUN apt-get update && apt-get install -y openssh-client perl
CMD ["perl", "ssh.pl", "ada.gonzaga.edu"]
