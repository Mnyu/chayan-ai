package model

type DisconnectRequest struct {
	RoomName string `json:"roomName"`
	UserId   string `json:"userId"`
}
