FROM python:3.12-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --default-timeout=300 --retries=10 --no-cache-dir -r requirements.txt

COPY . .

RUN chmod +x entrypoint.sh

EXPOSE 8000

ENTRYPOINT ["./entrypoint.sh"]
