"""
Google Cloud Vision API Integration
- Image analysis, object detection, label detection, OCR, face detection
"""
from google.cloud import vision
from typing import List, Dict, Optional
import io

class VisionService:
    def __init__(self, credentials_path: Optional[str] = None):
        """Initialize Vision API client"""
        if credentials_path:
            self.client = vision.ImageAnnotatorClient.from_service_account_json(credentials_path)
        else:
            # Will use GOOGLE_APPLICATION_CREDENTIALS env variable
            self.client = vision.ImageAnnotatorClient()
    
    def analyze_image(self, image_path: str) -> Dict:
        """Comprehensive image analysis"""
        with io.open(image_path, 'rb') as image_file:
            content = image_file.read()
        
        image = vision.Image(content=content)
        
        # Perform multiple detection types
        response = self.client.annotate_image({
            'image': image,
            'features': [
                {'type_': vision.Feature.Type.LABEL_DETECTION, 'max_results': 10},
                {'type_': vision.Feature.Type.OBJECT_LOCALIZATION, 'max_results': 10},
                {'type_': vision.Feature.Type.TEXT_DETECTION},
                {'type_': vision.Feature.Type.LOGO_DETECTION},
                {'type_': vision.Feature.Type.FACE_DETECTION},
                {'type_': vision.Feature.Type.IMAGE_PROPERTIES},
            ],
        })
        
        return {
            'labels': [{'description': label.description, 'score': label.score} 
                      for label in response.label_annotations],
            'objects': [{'name': obj.name, 'confidence': obj.score,
                        'bounding_box': [(v.x, v.y) for v in obj.bounding_poly.normalized_vertices]}
                       for obj in response.localized_object_annotations],
            'text': response.text_annotations[0].description if response.text_annotations else '',
            'logos': [logo.description for logo in response.logo_annotations],
            'faces': len(response.face_annotations),
            'colors': [{'color': f'rgb({c.color.red},{c.color.green},{c.color.blue})', 
                       'score': c.score, 'pixel_fraction': c.pixel_fraction}
                      for c in response.image_properties_annotation.dominant_colors.colors[:5]]
        }
    
    def detect_product(self, image_path: str) -> List[Dict]:
        """Detect products in retail/shelf images"""
        with io.open(image_path, 'rb') as image_file:
            content = image_file.read()
        
        image = vision.Image(content=content)
        response = self.client.product_search(image=image)
        
        return [{'product_id': result.product.name, 'score': result.score}
                for result in response.results]
