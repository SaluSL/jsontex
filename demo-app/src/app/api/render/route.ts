import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { template, data } = (await req.json()) as {
      template: string;
      data: unknown;
    };

    // Encode template to base64 on the server (Node)
    const templateB64 = Buffer.from(template, "utf8").toString("base64");

    if (!process.env.LATEX_RENDERER_URL) {
      console.warn(
        "LATEX_RENDERER_URL is not set. It might not work at given endpoint"
      );
    }
    const apiRes = await fetch(process.env.LATEX_RENDERER_URL || "", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/pdf",
      },
      body: JSON.stringify({ template: templateB64, data }),
    });

    if (!apiRes.ok) {
      const text = await apiRes.text().catch(() => "");
      return new Response(text || "Upstream error", { status: apiRes.status });
    }

    const pdf = await apiRes.arrayBuffer();
    return new Response(pdf, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": 'attachment; filename="resume.pdf"',
        "Cache-Control": "no-store",
      },
    });
  } catch (e: unknown) {
    console.error(e);
    return new Response(e instanceof Error ? e.message : String(e), {
      status: 400,
    });
  }
}
