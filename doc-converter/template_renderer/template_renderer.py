from abc import ABC, abstractmethod

class TemplateRenderer(ABC):
    @abstractmethod
    def render(self, template: str, data: dict) -> str:
        pass
    