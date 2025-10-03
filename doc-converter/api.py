from fastapi import FastAPI, HTTPException, Body
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from .doc_compiler.latex_compiler import LatexCompiler
from .template_renderer.jinja_renderer import JinjaRenderer
from pydantic import BaseModel
import base64
from .config import Settings

app = FastAPI()
settings = Settings()

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_allow_origins,
    allow_credentials=settings.cors_allow_credentials,
    allow_methods=settings.cors_allow_methods,
    allow_headers=settings.cors_allow_headers,
)

class RenderDocRequest(BaseModel):
    template: str
    data: dict

@app.post(
 "/render/LaTeX",
    response_class=FileResponse,
    responses={
        200: {
            "description": "Compiled PDF",
            "content": {
                "application/pdf": {
                    "schema": {"type": "string", "format": "binary"}
                }
            },
        }
    },
)
def render_resume(
    request: RenderDocRequest
) -> FileResponse:
    template_renderer = JinjaRenderer()
    try:
        template_text = base64.b64decode(request.template).decode("utf-8")
    except Exception as e:
        raise HTTPException(status_code=400, detail="Invalid base64 in template") from e
    rendered_template = template_renderer.render(template_text, request.data)
    compiler = LatexCompiler()
    output_path = compiler.compile(rendered_template)
    
    return FileResponse(
        output_path,
        media_type="application/pdf",
        filename="resume.pdf",
    )
