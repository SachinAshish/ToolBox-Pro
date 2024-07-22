# NginX

NginX is a library which is used for reverse-proxy and for load balancing between containers or servers.

> In this repo it is just created for fun and has no functional use if you are in development mode or running it locally, but it may be needed during the production when multiple containers across different machines are spun up.

This directory contains the config for load-balancing the website containers only.

> If you want to access the NginX endpoint for the website, you may go to `localhost:5000`.

In the production variant of the website containers, the mapping of ports of the website containers with the outside world will be removed, so that it can only be accessed via the load balancer.
