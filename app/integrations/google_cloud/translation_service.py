"""
Google Cloud Translation API Integration
- Translate text across 100+ languages
- Detect language automatically
"""
from google.cloud import translate_v2 as translate
from typing import List, Dict, Optional

class TranslationService:
    def __init__(self, credentials_path: Optional[str] = None):
        """Initialize Translation API client"""
        if credentials_path:
            self.client = translate.Client.from_service_account_json(credentials_path)
        else:
            self.client = translate.Client()
    
    def translate_text(self, text: str, target_language: str = 'en', source_language: str = None) -> Dict:
        """Translate text to target language"""
        result = self.client.translate(
            text,
            target_language=target_language,
            source_language=source_language
        )
        
        return {
            'original_text': text,
            'translated_text': result['translatedText'],
            'detected_language': result.get('detectedSourceLanguage', source_language),
            'target_language': target_language
        }
    
    def detect_language(self, text: str) -> Dict:
        """Detect the language of text"""
        result = self.client.detect_language(text)
        
        return {
            'language': result['language'],
            'confidence': result['confidence']
        }
    
    def batch_translate(self, texts: List[str], target_language: str = 'en') -> List[Dict]:
        """Translate multiple texts"""
        results = self.client.translate(texts, target_language=target_language)
        
        return [{'original': text, 'translated': r['translatedText'], 
                'detected_language': r.get('detectedSourceLanguage')}
                for text, r in zip(texts, results)]
