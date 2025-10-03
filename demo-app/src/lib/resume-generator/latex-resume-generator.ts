"use server";
import { ResumeGenerator } from "./resume-generator";

export class LatexResumeGenerator implements ResumeGenerator {
  async generateToPdf(
    template: string,
    data: Record<string, unknown>
  ): Promise<Blob> {
    const base64Template = this.toBase64(template);
    const response = await fetch("http://localhost:8000/render/LaTeX", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/pdf",
      },
      body: JSON.stringify({ template: base64Template, data }),
    });
    if (!response.ok) {
      const text = await response.text().catch(() => "");
      throw new Error(`Render failed (${response.status}): ${text}`);
    }
    return await response.blob();
  }

  // UTF-8 safe Base64 encoding on the server (Node)
  private toBase64(str: string): string {
    return Buffer.from(str, "utf8").toString("base64");
  }
}
