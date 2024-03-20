FROM postgres:16.2-alpine

RUN mkdir /var/log/myLogs
RUN chown postgres:postgres /var/log/myLogs
# USER postgres
CMD ["postgres", "-c", "logging_collector=on", "-c", "log_directory=/var/log/myLogs"]