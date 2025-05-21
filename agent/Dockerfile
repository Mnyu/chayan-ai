#https://github.com/livekit-examples/agent-deployment/blob/main/python-agent-example-app/Dockerfile
ARG PYTHON_VERSION=3.13.3
FROM python:${PYTHON_VERSION}-slim

ENV PYTHONUNBUFFERED=1

# Create a non-privileged user that the app will run under.
ARG UID=10001
RUN adduser \
    --disabled-password \
    --gecos "" \
    --home "/home/appuser" \
    --shell "/sbin/nologin" \
    --uid "${UID}" \
    appuser


# Install gcc and other build dependencies.
RUN apt-get update && \
    apt-get install -y \
    gcc \
    python3-dev \
    && rm -rf /var/lib/apt/lists/*

USER appuser

RUN mkdir -p /home/appuser/.cache
RUN chown -R appuser /home/appuser/.cache

WORKDIR /home/appuser/app

COPY requirements.txt .
RUN python -m pip install --user --no-cache-dir -r requirements.txt

# COPY . .
COPY /app .

# ensure that any dependent models are downloaded at build-time
RUN python main.py download-files

# expose healthcheck port
EXPOSE 8081

# Run the application.
# CMD ["python", "main.py", "start"]
CMD ["python", "main.py", "dev"]