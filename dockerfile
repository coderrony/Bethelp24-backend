FROM node

# create a app directory
WORKDIR /app 

# install dependency
COPY package.json ./

#Run npm install
RUN npm install 

#Bundle app source
COPY . .


CMD ["npm","start"]