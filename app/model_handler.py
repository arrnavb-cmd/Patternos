import os
import logging
try:
    import joblib
except Exception:
    joblib = None

from .config import settings
logger = logging.getLogger("model_handler")

# app/model_handler.py
class ModelHandler:
    def __init__(self):
        self.version = "0.0.1"

    


    def load_model(self):
        if joblib and os.path.exists(self.path):
            try:
                self.model = joblib.load(self.path)
                self.version = getattr(self.model, "version", "v1")
                logger.info(f"Loaded model from {self.path}")
            except Exception as e:
                logger.error("Error loading model: %s", e)
                self.model = None
        else:
            logger.warning("Model not loaded (joblib missing or file not found). Using dummy predictor.")
            self.model = None

    def predict(self, features):
        # simple deterministic dummy: average of numeric features
        try:
            nums = [float(x) for x in features]
            return float(sum(nums) / len(nums)) if nums else 0.5
        except Exception:
            return 0.5
        """
        feature_dict: {feature_name: float, ...}
        returns float probability between 0 and 1
        """
        if self.model is None:
            # simple deterministic dummy mapping: average of features scaled
            if not feature_dict:
                return 0.01
            vals = list(feature_dict.values())
            s = sum(v for v in vals if isinstance(v, (int, float)))
            avg = s / max(1, len(vals))
            prob = max(0.001, min(0.999, (avg / (avg + 10.0))))
            return float(prob)
        try:
            # if model expects a vector, create deterministic ordering by sorted keys
            vec = [feature_dict[k] for k in sorted(feature_dict.keys())]
            import numpy as np
            prob = self.model.predict_proba([vec])[0][1]
            return float(prob)
        except Exception as e:
            logger.error("Prediction failed: %s", e)
            return 0.0

model_handler = ModelHandler()
