FROM openjdk:17-oracle
RUN mkdir -p /data/fantatravel/logs
RUN mkdir -p /data/fantatravel/certificate
RUN mkdir -p /data/fantatravel/file
RUN mkdir -p /data/fantaravel/releaseNote
COPY  target/fantatravel*.jar /app.jar

ENV JAVA_TOOL_OPTIONS -agentlib:jdwp=transport=dt_socket,address=*:1111,server=y,suspend=n

ENTRYPOINT ["java","-jar","app.jar","-Djava.security.egd=file:/dev/urandom"]

