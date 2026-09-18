from pydantic import BaseModel, Field, field_validator
from typing import List, Dict, Any, Optional

class ChatRequest(BaseModel):
    merchant_id: int = Field(..., gt=0)
    message: str = Field(..., min_length=1)
    language: str = Field("hinglish")

    @field_validator("language")
    @classmethod
    def validate_language(cls, v: str) -> str:
        v_lower = v.lower().strip()
        if v_lower not in ["english", "hindi", "hinglish"]:
            raise ValueError("Language must be one of: 'english', 'hindi', 'hinglish'")
        return v_lower

class VisualElement(BaseModel):
    type: str  # line_chart, bar_chart, pie_chart, metric_card
    data_source: str
    payload: Optional[Dict[str, Any]] = None

class ChatResponse(BaseModel):
    message: str
    language: str
    visuals: List[VisualElement] = Field(default_factory=list)
    suggestions: List[str] = Field(default_factory=list)
    workers: List[str] = Field(default_factory=list)
