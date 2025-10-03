FROM python:3.12-slim

USER 0
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1
RUN apt update && apt install -y texlive-latex-base texlive-fonts-recommended texlive-fonts-extra texlive-latex-extra
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
RUN chown -R 1001:1001 /app
USER 1001

EXPOSE 8000
CMD ["fastapi", "run", "--host", "0.0.0.0", "--port", "8000"]
