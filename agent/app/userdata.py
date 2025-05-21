from dataclasses import dataclass, field
from livekit.agents import JobContext
from livekit.agents.voice import Agent

@dataclass
class Message:
  role: str
  content: str
  created_at: float

@dataclass
class UserData: 
  ctx: JobContext
  agent: Agent
  interview_id: str
  transcription: list[Message] = field(default_factory=list)


