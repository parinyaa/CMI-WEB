FROM nginx

EXPOSE 8080

COPY default.conf /etc/nginx/conf.d/default.conf
COPY dist/tpso-web /usr/share/nginx/html