FROM postgres:latest
RUN apt-get update -y
RUN apt install git -y
RUN git clone https://github.com/dimitri/pgloader.git 
RUN apt-get install sbcl unzip libsqlite3-dev make curl gawk freetds-dev libzip-dev -y
WORKDIR /pgloader
RUN make