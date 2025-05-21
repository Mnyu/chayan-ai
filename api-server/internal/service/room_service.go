package service

import (
	"context"

	"github.com/livekit/protocol/livekit"
	lksdk "github.com/livekit/server-sdk-go/v2"
)

type RoomService struct {
	Client *lksdk.RoomServiceClient
}

func NewRoomService(host string, apiKey string, apiSecret string) *RoomService {
	client := lksdk.NewRoomServiceClient(host, apiKey, apiSecret)
	return &RoomService{Client: client}
}

func (r *RoomService) CreateRoom(name string) (*livekit.Room, error) {
	room, err := r.Client.CreateRoom(context.Background(), &livekit.CreateRoomRequest{
		Name:            name,
		EmptyTimeout:    10 * 60, // 10 minutes
		MaxParticipants: 2,
	})
	if err != nil {
		return nil, err
	}
	return room, nil
}

func (r *RoomService) IsRoomPresent(name string) (bool, error) {
	roomNames := []string{name}
	rooms, err := r.ListRooms(roomNames)
	if err != nil {
		return true, err
	}
	return len(rooms) > 0, nil
}

func (r *RoomService) ListRooms(names []string) ([]*livekit.Room, error) {
	roomsResp, err := r.Client.ListRooms(context.Background(), &livekit.ListRoomsRequest{Names: names})
	if err != nil {
		return nil, err
	}
	return roomsResp.Rooms, nil
}

func (r *RoomService) DeleteRoom(name string) error {
	_, err := r.Client.DeleteRoom(context.Background(), &livekit.DeleteRoomRequest{
		Room: name,
	})
	if err != nil {
		return err
	}
	return nil
}
