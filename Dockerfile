# movement.blkoutuk.com — redirect-only image.
# The scrollytelling pilot at this domain is superseded by the canonical
# Movement page at https://blkoutuk.com/movement (a route on
# community-platform). This image returns 301 redirects so any old
# bookmarks / shared links land on the right place.
#
# When the OOMF interactive comic is ready to live here OR a different
# experience replaces this domain, revert this Dockerfile to the
# original build-and-serve form.

FROM nginx:alpine

RUN echo 'server { \
    listen 3000; \
    return 301 https://blkoutuk.com/movement$request_uri; \
}' > /etc/nginx/conf.d/default.conf

EXPOSE 3000

CMD ["nginx", "-g", "daemon off;"]
