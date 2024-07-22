# Using Node js version 2 for next 15
FROM node:22

# Change the working directory to /app in the container
WORKDIR /app

# Copy the package.json file to the workdir
COPY package.json .

# Install all the dependencies in the package.json file
ARG NODE_ENV
RUN if [ "$NODE_ENV" = "development" ]; \
   then npm install; \
   else npm install --omit=dev; \
   fi

# Just for production, you do not need it during development as you have a bind mount
COPY . .

# Expose port 3000
EXPOSE 3000

# run npm run dev for development server
CMD ["npm", "run", "dev"]