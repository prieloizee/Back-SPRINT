## Baixa e executa a imagem do node na versao Alpine (versao simplificada)
FROM node:alpine

## Define o local onde o app ira ficar no disco do container
## O caminho o Dev quem escolhe
WORKDIR /usr/app

## Copia tudo que começa com package e termina com .json para dentro de usr/app
COPY package*.json ./

## Executa npm install para adicionar todas as dependencias e criar pasta node_modules
RUN npm install

## Copia tudo que está no diretório onde o arquivo Dockerfile está
## Será copiado dentro da pasta /usr/app do container
## Vamos ignorar a node_modules (.dockerignore)
COPY . .

## Container ficará ouvindo os acessos na porta 5000
EXPOSE 3000

## Executa o comando para inicar o script que está no package.json
CMD npm start