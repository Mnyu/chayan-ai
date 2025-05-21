from pydantic import BaseModel

class EvaluateInterviewMsg(BaseModel):
  interview_id: str