from livekit.agents import Agent
from livekit.agents.llm import function_tool
from prompts import SYSTEM_PROMPT_2

class Interviewer(Agent):
  def __init__(self, context_vars=None) -> None:
    self.context_vars = context_vars
    self.transcription = {}
    instructions = SYSTEM_PROMPT_2
    if context_vars:
      instructions = instructions.format(**context_vars)
    super().__init__(instructions=instructions)
  
  # @function_tool
  # async def add_evaluation(self, topic: str, question: str, answer_by_candidate: str, rating: int, guidelines_for_answering: str):
  #   if topic not in self.transcription:
  #     self.transcription[topic] = []
  #   self.transcription[topic].append({question, answer_by_candidate, rating, guidelines_for_answering})
  #   return "Evalutaion for this question done"