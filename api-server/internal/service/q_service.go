package service

import (
	"encoding/json"
	"fmt"
	"log/slog"

	"github.com/mnyu/interviewer-api-server/internal/model"
	amqp "github.com/rabbitmq/amqp091-go"
)

type QService struct {
}

func NewQService() *QService {
	return &QService{}
}

func (q *QService) SetupQueue(host string, port string, user string, password string, queueName string) (*amqp.Connection, *amqp.Channel, error) {
	rabbitMQUrl := fmt.Sprintf("amqp://%s:%s@%s:%s/", user, password, host, port)
	conn, err := amqp.Dial(rabbitMQUrl)
	if err != nil {
		slog.Error("Cannot create connection with rabbitmq url : " + rabbitMQUrl + " due to : " + err.Error())
		return nil, nil, err
	}

	ch, err := conn.Channel()
	if err != nil {
		slog.Error("Cannot get channel from rabbitmq connection : " + err.Error())
		return conn, nil, err
	}

	_, err = ch.QueueDeclare(queueName, true, false, false, false, nil)
	if err != nil {
		slog.Error("Cannot declare queue " + queueName + " : " + err.Error())
		return conn, ch, err
	}
	return conn, ch, nil
}

func (q *QService) SendMessage(channel *amqp.Channel, queueName string, message *model.ResumeSummaryMsg) error {
	messageBytes, err := json.Marshal(message)
	if err != nil {
		return err
	}
	msg := amqp.Publishing{
		DeliveryMode: amqp.Persistent,
		ContentType:  "text/plain",
		Body:         messageBytes,
	}
	return channel.Publish("", queueName, false, false, msg)
}
