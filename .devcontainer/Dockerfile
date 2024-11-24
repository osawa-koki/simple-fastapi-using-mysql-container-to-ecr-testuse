FROM node:22
RUN npm install --global aws-cdk
RUN apt-get update && \
    apt-get install --yes less && \
    apt-get install --yes python3.11 python3-pip && \
    echo "alias python=python3" >> ~/.bashrc && \
    echo "alias pip=pip3" >> ~/.bashrc
