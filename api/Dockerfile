FROM golang:1.21-alpine

WORKDIR /app

COPY . .

RUN go build -o api main.go

EXPOSE 8080

CMD ["./api"]