# Step 1: Choose base image (nginx web server)
FROM nginx:alpine

# Step 2: Remove default nginx files
RUN rm -rf /usr/share/nginx/html/*

# Step 3: Copy HTML files to nginx
COPY html/ /usr/share/nginx/html/

# Step 4: Copy CSS files
COPY css/ /usr/share/nginx/html/css/

# Step 5: Copy JavaScript files
COPY js/ /usr/share/nginx/html/js/

# Step 6: Copy Images
COPY Images/ /usr/share/nginx/html/Images/

# Step 7: Copy data file
COPY students.json /usr/share/nginx/html/students.json

# Step 8: Copy nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf


# Step 9: Tell Docker to expose port 80
EXPOSE 80

# Step 10: Start nginx when container runs
CMD ["nginx", "-g", "daemon off;"]