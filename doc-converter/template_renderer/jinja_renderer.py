from jinja2 import Environment, BaseLoader
from .template_renderer import TemplateRenderer

class JinjaRenderer(TemplateRenderer):
    def __init__(self):
        self.env = Environment(loader=BaseLoader(), comment_start_string="<><><>",
                           comment_end_string="</><></>")

    def render(self, template: str, data: dict) -> str:
        template = self.env.from_string(template)
        rendered_str = template.render(data)
        return rendered_str
    