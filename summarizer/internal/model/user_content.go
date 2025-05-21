package model

type UserTextContent struct {
	Type string `json:"type"`
	Text string `json:"text"`
}

type UserImageContent struct {
	Type     string `json:"type"`
	ImageUrl string `json:"image_url"`
}
