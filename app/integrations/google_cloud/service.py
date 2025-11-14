"""
Unified Google Cloud AI Service
Combines Vision, Translation, and Vertex AI
"""
from typing import Optional, Dict
from .vision_service import VisionService
from .translation_service import TranslationService
from .vertex_service import VertexAIService

class GoogleCloudAIService:
    def __init__(self, 
                 credentials_path: Optional[str] = None,
                 project_id: Optional[str] = None,
                 location: str = 'us-central1'):
        """Initialize all Google Cloud AI services"""
        self.vision = VisionService(credentials_path)
        self.translation = TranslationService(credentials_path)
        if project_id:
            self.vertex = VertexAIService(project_id, location, credentials_path)
        else:
            self.vertex = None
    
    def analyze_retail_image(self, image_path: str, translate_to: str = 'en') -> Dict:
        """Complete retail image analysis with translation"""
        # Analyze image
        vision_result = self.vision.analyze_image(image_path)
        
        # Translate detected text if needed
        if vision_result['text'] and translate_to:
            translation = self.translation.translate_text(
                vision_result['text'], 
                target_language=translate_to
            )
            vision_result['translated_text'] = translation
        
        return vision_result

# Singleton instance
google_ai_service = None

def get_google_ai_service(credentials_path: str = None, project_id: str = None) -> GoogleCloudAIService:
    """Get or create Google AI service instance"""
    global google_ai_service
    if google_ai_service is None:
        google_ai_service = GoogleCloudAIService(credentials_path, project_id)
    return google_ai_service
