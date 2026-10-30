from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional
import uuid
from datetime import datetime

class SuggestedAction(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    label: str
    action_type: str  # add_activity, replace_activity, adjust_pace, add_budget_item
    description: str
    payload: Dict[str, Any]

class ChatMessage(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    role: str = Field(..., description="user or assistant")
    content: str
    timestamp: str = Field(default_factory=lambda: datetime.utcnow().isoformat())
    trip_id: Optional[str] = None
    suggested_actions: List[SuggestedAction] = Field(default_factory=list)
    is_mock: bool = False

class ChatRequest(BaseModel):
    message: str
    trip_id: Optional[str] = None
    conversation_history: List[ChatMessage] = Field(default_factory=list)

class ApplyActionRequest(BaseModel):
    trip_id: str
    action_type: str
    payload: Dict[str, Any]

class ApplyActionResponse(BaseModel):
    success: bool
    message: str
    updated_trip_id: str

