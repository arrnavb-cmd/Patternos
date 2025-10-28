FROM node:18-alpine
WORKDIR /usr/src/frontend

COPY entrypoint.sh /usr/local/bin/entrypoint.sh
COPY ./frontend/entrypoint.sh /usr/local/bin/entrypoint.sh


COPY entrypoint.sh /usr/local/bin/entrypoint.sh
RUN chmod +x /usr/local/bin/entrypoint.sh

ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]
