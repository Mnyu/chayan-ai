# CHAYAN AI

### What is Chayan AI?

Chayan AI is an platform to help students or professionals prepare for their technical interviews by conducting real-time virtual audio mock interviews fully powered by AI. It offers detailed feedback on your interview responses and provides personalized feedback on your projects, technical skills and communication skills. Chayan AI will analyze every response and provide valuable guidelines to sharpen their interview skills.

## Get Started

### Step 0: Prerequisites:

1. Install docker
2. Install docker-compose

### Step 1: Clone the repository and change directory to chayan-ai:

```shell
git clone git@github.com:Mnyu/chayan-ai.git
cd chayan-ai
```

### Step 2: Add .env file:

Create .env file by by creating a copy of .env.example and putting in the respective values, keys, urls for livekit, openai, rabbitmq and postgres.

### Step 3: Build docker images:

```shell
docker compose build
```

### Step 4: Start all containers in detached mode:

```shell
docker compose up -d
```

### Step 5: Open the application:

Visit the url : https://localhost:443

### Step 6: Stopping all containers along with deleting volumes

```shell
docker compose down -v
```
