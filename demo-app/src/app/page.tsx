"use client";

import { useCallback, useEffect, useState } from "react";
import Editor from "@monaco-editor/react";
import { useTemplateStore } from "@/lib/stores/template/template.store";
import { Button } from "@/components/ui/button";
import { Pencil, Plus, Trash2 } from "lucide-react";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { Input } from "@/components/ui/input";
import { ThemeToggle } from "@/components/theme-toggle";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

export default function Home() {
  const {
    template,
    setTemplate,
    dataSources,
    setDataSource,
    addNewDataSource,
    changeDataSourceName,
    deleteDataSource,
  } = useTemplateStore();
  const [dataJsonIndex, setDataJsonIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  // Keep a JSON string the user edits in the right-hand editor
  const [dataString, setDataString] = useState<string>(() =>
    JSON.stringify(dataSources?.[dataJsonIndex]?.data ?? {}, null, 2)
  );

  const [dataSourceEditMode, setDataSourceEditMode] = useState(false);

  // When the selected example changes, update the editor to show that JSON
  useEffect(() => {
    const next = dataSources?.[dataJsonIndex]?.data ?? {};
    setDataString(JSON.stringify(next, null, 2));
  }, [dataSources, dataJsonIndex]);

  const handleAddNewDataSource = useCallback(() => {
    addNewDataSource();
    setDataJsonIndex(dataSources.length - 1);
  }, [addNewDataSource, dataSources.length]);

  const options = {
    scrollBeyondLastLine: false,
    minimap: { enabled: false },
    fontSize: 14,
  };

  // Helper to trigger a download of a Blob in the browser
  const downloadBlob = useCallback((blob: Blob, filename: string) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }, []);

  const handleRender = useCallback(async () => {
    let data: Record<string, unknown>;
    try {
      // Parse as unknown first, then narrow to an object
      const parsed: unknown = JSON.parse(dataString);
      if (
        parsed === null ||
        typeof parsed !== "object" ||
        Array.isArray(parsed)
      ) {
        alert("Data JSON must be a JSON object at the top level.");
        return;
      }
      data = parsed as Record<string, unknown>;
    } catch (e: unknown) {
      alert("Data JSON is invalid");
      return;
    }
    setLoading(true);
    // Send template as UTF-8 text; server will base64-encode safely

    try {
      const res = await fetch("/api/render", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ template, data }),
      });
      if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(text || `Request failed (${res.status})`);
      }
      const pdfBlob = await res.blob();
      downloadBlob(pdfBlob, dataSources[dataJsonIndex].name + ".pdf");
    } catch (err: unknown) {
      console.error(err);
      alert("Failed to render PDF");
    } finally {
      setLoading(false);
    }
  }, [dataString, template, downloadBlob]);
  return (
    <div className="font-sans flex flex-col items-center min-h-screen p-8 pb-20 gap-16 w-full">
      <header className="flex justify-between w-full">
        <span className="text-xl font-extrabold font-mono">jsontex</span>
        <ThemeToggle />
      </header>
      <main className="flex flex-col gap-[32px] items-center w-full">
        <div className="flex flex-col gap-4 w-full">
          <div className="flex gap-4 w-full">
            <ResizablePanelGroup direction="horizontal">
              <ResizablePanel minSize={15}>
                <div className="flex-1 min-w-0 pe-2">
                  <div className="mb-2 font-semibold">
                    LaTeX Template (.tex)
                  </div>
                  <Editor
                    height="50vh"
                    defaultLanguage="latex"
                    theme="vs-dark"
                    value={template}
                    options={options}
                    onChange={(v) => setTemplate(v ?? "")}
                  />
                  <p className="text-muted-foreground mt-2">
                    Fill in your LaTeX template with jinja2 placeholders like{" "}
                    {"{{ "}
                    name{" }}"}. It will be replaced with the corresponding
                    value from the data source JSON.
                  </p>
                </div>
              </ResizablePanel>
              <ResizableHandle withHandle />
              <ResizablePanel minSize={15}>
                <div className="flex-1 min-w-0 ps-2">
                  <div className="mb-2 font-semibold">Data source JSON</div>

                  <div className="mb-2">
                    <Editor
                      height="50vh"
                      defaultLanguage="json"
                      theme="vs-dark"
                      value={dataString}
                      options={options}
                      onChange={(v) => {
                        if (v) {
                          setDataSource(JSON.parse(v), dataJsonIndex);
                        }
                      }}
                    />
                  </div>
                  <div className="flex gap-2 justify-between">
                    <ToggleGroup
                      type="single"
                      variant="outline"
                      value={dataJsonIndex.toString()}
                      onValueChange={(v) => setDataJsonIndex(Number(v))}
                      className="overflow-x-auto"
                    >
                      {dataSources.map((ds, i) => (
                        <ToggleGroupItem
                          key={i}
                          value={i.toString()}
                          className="min-w-fit"
                        >
                          {ds.name}
                        </ToggleGroupItem>
                      ))}
                    </ToggleGroup>
                    <div>
                      <Button
                        onClick={() => handleAddNewDataSource()}
                        variant="outline"
                      >
                        <Plus />
                        Add new data source
                      </Button>
                    </div>
                  </div>
                </div>
                <div className="mt-2 flex items-center gap-2 p-2">
                  {dataSourceEditMode ? (
                    <form onSubmit={() => setDataSourceEditMode(false)}>
                      <Input
                        className="flex-1"
                        autoFocus
                        value={dataSources[dataJsonIndex].name}
                        onChange={(e) =>
                          changeDataSourceName(e.target.value, dataJsonIndex)
                        }
                      />
                      <Button type="submit">OK</Button>
                    </form>
                  ) : (
                    <>
                      <span>{dataSources[dataJsonIndex]?.name} </span>
                      <Button
                        variant={"ghost"}
                        size={"icon"}
                        onClick={() => setDataSourceEditMode(true)}
                      >
                        <Pencil />
                        <span className="sr-only">Change name</span>
                      </Button>
                      <Button
                        onClick={() => {
                          deleteDataSource(dataJsonIndex);
                          setDataJsonIndex(0);
                        }}
                        variant={"ghost"}
                        size={"icon"}
                        disabled={dataSources.length === 1}
                        className="disabled:opacity-50 text-destructive hover:text-destructive/90"
                      >
                        <Trash2 />
                        <span className="sr-only">Delete data source</span>
                      </Button>
                    </>
                  )}
                </div>
              </ResizablePanel>
            </ResizablePanelGroup>
          </div>
          <div>
            <Button
              onClick={handleRender}
              disabled={loading}
              // className="rounded px-4 py-2 bg-blue-600 text-white disabled:opacity-50"
              variant="default"
              size="lg"
            >
              {loading ? "Rendering…" : "Render to PDF"}
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
