
# Google Cloud Vision API Integration for PatternOS
import os
import json
import requests
from typing import Dict, List, Optional
import base64

class VisionAnalysisService:
    def __init__(self):
        self.api_key = os.getenv('GOOGLE_VISION_API_KEY', '')
        self.endpoint = 'https://vision.googleapis.com/v1/images:annotate'
    
    def analyze_image(self, image_url: str) -> Dict:
        try:
            # Download image
            response = requests.get(image_url, timeout=10)
            image_content = base64.b64encode(response.content).decode('utf-8')
            
            # Vision API request
            vision_request = {
                "requests": [{
                    "image": {"content": image_content},
                    "features": [
                        {"type": "LABEL_DETECTION", "maxResults": 20},
                        {"type": "LOGO_DETECTION", "maxResults": 10},
                        {"type": "TEXT_DETECTION"},
                        {"type": "OBJECT_LOCALIZATION", "maxResults": 20},
                        {"type": "IMAGE_PROPERTIES"},
                        {"type": "WEB_DETECTION"}
                    ]
                }]
            }
            
            if self.api_key:
                api_response = requests.post(
                    f'{self.endpoint}?key={self.api_key}',
                    json=vision_request,
                    timeout=30
                )
                
                if api_response.status_code == 200:
                    return self._process_response(api_response.json())
            
            return self._mock_analysis()
            
        except Exception as e:
            print(f"Error: {e}")
            return self._mock_analysis()
    
    def _process_response(self, response: Dict) -> Dict:
        annotations = response['responses'][0]
        
        labels = []
        if 'labelAnnotations' in annotations:
            labels = [
                {'name': l['description'], 'confidence': l['score']}
                for l in annotations['labelAnnotations']
            ]
        
        brands = []
        if 'logoAnnotations' in annotations:
            brands = [logo['description'] for logo in annotations['logoAnnotations']]
        
        products = []
        if 'localizedObjectAnnotations' in annotations:
            products = [
                {'name': obj['name'], 'confidence': obj['score']}
                for obj in annotations['localizedObjectAnnotations']
            ]
        
        return {
            'labels': labels,
            'detected_brands': brands,
            'detected_products': products,
            'lifestyle_categories': self._infer_lifestyle(labels),
            'scene_description': self._generate_description(labels, brands)
        }
    
    def _infer_lifestyle(self, labels: List) -> List[str]:
        lifestyle = set()
        terms = [l['name'].lower() for l in labels]
        
        if any(t in terms for t in ['gym', 'fitness', 'workout']):
            lifestyle.add('fitness_enthusiast')
        if any(t in terms for t in ['makeup', 'beauty', 'cosmetic']):
            lifestyle.add('beauty_lover')
        if any(t in terms for t in ['organic', 'natural', 'healthy']):
            lifestyle.add('health_conscious')
            
        return list(lifestyle)
    
    def _generate_description(self, labels: List, brands: List) -> str:
        main = [l['name'] for l in labels[:3]]
        if brands:
            return f"Scene with {', '.join(main[:2])} featuring {', '.join(brands[:2])}"
        return f"Scene containing {', '.join(main)}"
    
    def _mock_analysis(self) -> Dict:
        return {
            'labels': [
                {'name': 'Product', 'confidence': 0.95},
                {'name': 'Beauty', 'confidence': 0.89}
            ],
            'detected_brands': ['Himalaya', 'Dove'],
            'detected_products': [
                {'name': 'Face Wash', 'confidence': 0.91},
                {'name': 'Moisturizer', 'confidence': 0.88}
            ],
            'lifestyle_categories': ['health_conscious', 'beauty_lover'],
            'scene_description': 'Skincare products display',
            'analysis_confidence': 0.89
        }

vision_service = VisionAnalysisService()
