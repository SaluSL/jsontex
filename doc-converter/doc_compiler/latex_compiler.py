import subprocess
from .doc_compiler import DocCompiler
from uuid import uuid4
import os

class LatexCompiler(DocCompiler):
    def __init__(self, output_dir: str = "/tmp"):
        super().__init__(output_dir)
        # Ensure output directory exists
        os.makedirs(self.output_dir, exist_ok=True)

    def compile(self, rendered_template: str) -> str:
        filename_prefix = self._generate_filename_prefix()
        path_to_template_file = self._generate_rendered_template_file(filename_prefix, rendered_template)

        command = ["pdflatex", "-interaction=nonstopmode"]
        if self.output_dir:
            command += ["-output-directory", self.output_dir]
        command.append(path_to_template_file)
        result = subprocess.run(command, capture_output=True, text=True)
        if result.returncode != 0:
            raise Exception(f"ERROR: LaTeX compilation failed! {result.stderr}")
        else:
            self._clean_temp_files(filename_prefix)
            return os.path.join(self.output_dir, f"{filename_prefix}.pdf")

    def _generate_rendered_template_file(self, filename_prefix: str, rendered_template: str) -> str:
        path_to_temp_file = os.path.join(self.output_dir, f"{filename_prefix}.tex")
        with open(path_to_temp_file, "w") as f:
            f.write(rendered_template)
        return path_to_temp_file

    def _generate_filename_prefix(self) -> str:
        return str(uuid4())
        
    def _clean_temp_files(self, filename_prefix: str) -> None:
        for ext in ("tex", "aux", "log"):
            path = os.path.join(self.output_dir, f"{filename_prefix}.{ext}")
            if os.path.exists(path):
                try:
                    os.remove(path)
                except Exception:
                    # Best-effort cleanup; ignore errors
                    pass