package service

import (
	"encoding/json"
	"os"

	"github.com/google/uuid"
	"github.com/livekit/protocol/auth"
	"github.com/livekit/protocol/livekit"
	"github.com/mnyu/interviewer-api-server/internal/model"
)

type ConnectionService struct {
	RoomService      *RoomService
	InterviewService *InterviewService
}

func NewConnectionService(roomService *RoomService, interviewService *InterviewService) *ConnectionService {
	return &ConnectionService{RoomService: roomService, InterviewService: interviewService}
}

func (c *ConnectionService) Connect(interviewId string) (string, error) {
	LIVEKIT_API_KEY := os.Getenv("LIVEKIT_API_KEY")
	LIVEKIT_API_SECRET := os.Getenv("LIVEKIT_API_SECRET")
	LIVEKIT_ROOM_NAME := os.Getenv("LIVEKIT_ROOM_NAME")

	// isRoomPresent, err := c.RoomService.IsRoomPresent(roomName)
	// if err != nil {
	// 	return "", err
	// }
	// if !isRoomPresent {
	// 	room, err := c.RoomService.CreateRoom(roomName)
	// 	if err != nil {
	// 		return "", err
	// 	}
	// 	roomName = room.Name
	// }

	interview, err := c.InterviewService.GetInterview(interviewId)
	if err != nil {
		return "", err
	}
	jobMetadata := &model.JobMetadata{
		InterviewId:   interviewId,
		ResumeSummary: interview.ResumeSummary,
		Questions:     interview.Questions,
	}
	jobMetadataBytes, err := json.Marshal(jobMetadata)
	if err != nil {
		return "", err
	}
	trueValue := true
	at := auth.NewAccessToken(LIVEKIT_API_KEY, LIVEKIT_API_SECRET).
		SetIdentity(uuid.NewString()).
		SetName(interview.UserName).
		SetVideoGrant(&auth.VideoGrant{
			Room:           LIVEKIT_ROOM_NAME,
			RoomJoin:       true,
			CanPublish:     &trueValue,
			CanSubscribe:   &trueValue,
			CanPublishData: &trueValue,
		}).
		SetRoomConfig(&livekit.RoomConfiguration{
			Agents: []*livekit.RoomAgentDispatch{
				{
					AgentName: "interviewer",
					// Metadata:  "{\"resume\": \"" + resumeSummary + "\", \"interviewId\": \"" + interviewId + "\"}",
					Metadata: string(jobMetadataBytes),
				},
			},
		})
	return at.ToJWT()
}

func (c *ConnectionService) Disconnect(roomName string, userId string) error {
	return c.RoomService.DeleteRoom(roomName)
}
