from abc import ABC, abstractmethod

class DocCompiler(ABC):
    def __init__(self, output_dir: str = "/tmp"):
        self.output_dir = output_dir

    @abstractmethod
    def compile(self, rendered_template: str) -> str:
        pass
