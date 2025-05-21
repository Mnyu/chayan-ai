import logging
import json
from livekit.agents import (JobContext, WorkerOptions, cli, ConversationItemAddedEvent)
from livekit.plugins import openai, silero
from livekit.agents.voice import AgentSession, RunContext
from db.database import DB
from interviewer import Interviewer
from userdata import UserData, Message
from model.evaluate_interview_msg import EvaluateInterviewMsg
from q import publisher
from config import config


logger = logging.getLogger(__name__)
logger.setLevel(logging.INFO)

connStr = f"postgresql://{config.POSTGRES_USER}:{config.POSTGRES_PASSWORD}@{config.POSTGRES_HOST}/{config.POSTGRES_DB}"
db = DB(connection_string=connStr)

async def entrypoint(ctx: JobContext):
    await ctx.connect()

    metadata = json.loads(ctx.job.metadata)
    resume = metadata["resume"]
    interview_id = metadata["interviewId"]
    questions =  metadata["questions"]
    context_variables = {
        "resume": resume,
        "interview_id" : interview_id,
        "questions" : questions
    }
    interviewer = Interviewer(context_vars=context_variables)
    userdata = UserData(ctx=ctx, agent=interviewer, interview_id=interview_id)

    agent_session = AgentSession[UserData](
        userdata = userdata,
        vad=silero.VAD.load(),
        stt=openai.STT(model="gpt-4o-transcribe"),
        llm=openai.LLM(model="gpt-4-turbo"),
        tts=openai.TTS(
            model="gpt-4o-mini-tts",
            voice="ash",
            instructions="Speak in a friendly and conversational tone.",
        ),
    )

    await agent_session.start(agent=interviewer, room=ctx.room)
    
    @agent_session.on("conversation_item_added")
    def on_conversation_item_added(event: ConversationItemAddedEvent):
        # logger.info(agent_session.userdata.agent.chat_ctx.items) Can help in truncation
        if event.item.text_content:
            logger.info(event.item.text_content)
            agent_session.userdata.transcription.append(Message(role=event.item.role, content=event.item.text_content, created_at=event.item.created_at))

    await agent_session.say("Hello and Welcome to your interview. To start off, could you please introduce yourself? Tell me about your experience levels and technical background")

    async def my_shutdown_hook():
        transcription = agent_session.userdata.transcription
        interview_id = agent_session.userdata.interview_id
        db.add_transcipt_to_interview(interview_id, transcription)
        logger.info(f"Added transcription to database for {interview_id}")
        msg = EvaluateInterviewMsg(interview_id=interview_id)
        publisher.send_evaluate_interview_msg(message=msg)
        logger.info("Published evaluation message")
        
    ctx.add_shutdown_callback(my_shutdown_hook)

if __name__ == "__main__":
    cli.run_app(WorkerOptions(entrypoint_fnc=entrypoint, agent_name="interviewer"))