export type PdfTextItem = {
  readonly str: string;
  readonly transform: readonly number[];
};

const itemsToLines = (items: readonly PdfTextItem[]): string[] => {
  const rows: { y: number; items: PdfTextItem[] }[] = [];
  [...items]
    .sort((a, b) => b.transform[5] - a.transform[5])
    .forEach(item => {
      const y = item.transform[5];
      const row = rows.find(r => Math.abs(r.y - y) <= 2);
      if (row) row.items.push(item);
      else rows.push({ y, items: [item] });
    });
  return rows.map(row =>
    row.items
      .sort((a, b) => a.transform[4] - b.transform[4])
      .map(item => item.str)
      .join(' ')
  );
};

export const pageTextItemsToLines = (
  items: readonly PdfTextItem[],
  pageWidth: number
): string[] => {
  const upright = items.filter(item => item.transform[1] === 0 && item.str.trim().length > 0);
  const middle = pageWidth / 2;
  return [
    ...itemsToLines(upright.filter(item => item.transform[4] < middle)),
    ...itemsToLines(upright.filter(item => item.transform[4] >= middle)),
  ];
};

export const extractPdfLines = async (data: ArrayBuffer): Promise<string[]> => {
  const [pdfjs, { default: workerSrc }] = await Promise.all([
    import('pdfjs-dist'),
    // eslint-disable-next-line import/extensions, import/no-unresolved
    import('pdfjs-dist/build/pdf.worker.min.js?url'),
  ]);
  pdfjs.GlobalWorkerOptions.workerSrc = workerSrc;
  const doc = await pdfjs.getDocument({ data: new Uint8Array(data) }).promise;
  try {
    const pages = await Promise.all(
      Array.from({ length: doc.numPages }, async (_, i) => {
        const page = await doc.getPage(i + 1);
        const { items } = await page.getTextContent();
        const textItems = items.filter((item): item is PdfTextItem & typeof item => 'str' in item);
        return pageTextItemsToLines(textItems, page.getViewport({ scale: 1 }).width);
      })
    );
    return pages.flat();
  } finally {
    await doc.destroy();
  }
};
