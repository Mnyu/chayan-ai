from dataclasses import asdict
from sqlalchemy import create_engine, Column, String
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import declarative_base, sessionmaker 
from userdata import Message
# from interview import Interview

Base = declarative_base()

class Interview(Base):
    __tablename__ = "interview"
    interview_id = Column(String, primary_key=True)
    transcript = Column(JSONB)
    status = Column(String)

class DB:
    def __init__(self, connection_string: str):
        self.engine = create_engine(connection_string)
        
    def add_transcipt_to_interview(self, interview_id: str, transcript: list[Message]):
        Session = sessionmaker(bind=self.engine)
        session = Session()

        interview = session.query(Interview).filter_by(interview_id=interview_id).first()

        if interview:
            transcript_dict = [asdict(msg) for msg in transcript]
        else:
            transcript_dict = [{"error": f"No interview found with id : {interview_id}"}]
        
        interview.transcript = transcript_dict
        interview.status = "PENDING_EVALUATION"
        session.commit()
        session.close()
        