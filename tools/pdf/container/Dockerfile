FROM debian:bookworm-slim

RUN apt-get update && apt-get install -y --no-install-recommends \
    libreoffice-writer libreoffice-calc libreoffice-impress \
    ocrmypdf qpdf python3 \
    fonts-liberation fonts-dejavu-core \
    && rm -rf /var/lib/apt/lists/*

COPY server.py /srv/server.py

EXPOSE 8080
CMD ["python3", "/srv/server.py"]
