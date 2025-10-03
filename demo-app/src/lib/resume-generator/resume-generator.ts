export interface ResumeGenerator {
  // returns a PDF file
  generateToPdf(
    template: string,
    data: Record<string, unknown>
  ): Promise<Blob>;
}
