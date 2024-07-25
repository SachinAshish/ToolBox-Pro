FROM gresau/localstack-persist:latest
COPY ./buckets.sh /etc/localstack/init/ready.d/init-aws.sh
RUN chmod 777 /etc/localstack/init/ready.d/init-aws.sh