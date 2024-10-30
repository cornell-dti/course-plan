# PDF Generation

This document provides an overview of the PDF generation process for CoursePlan. In general, client-side PDF generation is a finnicky thing, but one that is commonly needed in modern web apps, and so this documentation was created to serve as a reference for later developers and possibly others on the project team.

## Infrastructure

The recommended way to go about generating PDFs is through [the `jspdf` library](https://github.com/parallax/jsPDF). `jspdf` is powerful, well-tested, and has a good plugin ecosystem (e.g. `jspdf-autotable`), plus you can already see how it is used in the existing `pdf-generator.ts` & `pdf-schedule-generator.ts` files.

## High-Level Overview

Constructing a PDF (in CoursePlan) generally follows this workflow:

1. Set up global document constants such as font size, line height, etc. and apply these to a new `JsPDF` object.
   - This can be accomplished by creating a new `JsPDF` object with the desired settings. For example, `new JsPDF({ unit: 'pt', format: 'letter' }) in `pdf-schedule-generator.ts`. For more details, see `pdf-schedule-generator.ts` or `pdf-generator.ts`.
2. Add any images as needed, in particular a logo often for CoursePlan / DTI products.
3. Fill out the document with text, tables, etc. using the `addPage` & `text` methods.
4. Optionally, use `jspdf-autotable` to automatically build tables. Or other plugins for other functionality.
5. Expose the entire generating function which ends with `doc.save('filename.pdf')`, where `filename.pdf` is the desired name of the output file.

There is already significant inline documentation in the `pdf-schedule-generator.ts` file, and so we won't repeat it here. A read through that file is recommended.

## Particulars

There are a few particular things to note:

- For custom fonts, you will need to load them into JsPDF using their dedicated [functions](https://github.com/parallax/jsPDF). If you use web-safe fonts like e.g. Times New Roman, you can skip this step.
- To generate images, there are two options:
  - Use image urls — this is recommended for icons / logos, etc. You call `loadImage(url)` and then can use the returned image in `doc.addImage(imgData, 'PNG', x, y, width, height, type, link)` (example).
      - Here is the `loadImage` function for reference; it is not provided by `jspdf`.
         ```ts
         /**
         * Asynchronously load an image
         *
         * @param src the source URL of the image to load
         * @returns a promise wrapping the loaded image
         */
         export const loadImage = (src: string): Promise<HTMLImageElement> =>
         new Promise((resolve, reject) => {
            const img = new Image();
            img.src = src;
            img.onload = () => resolve(img);
            img.onerror = err => reject(err);
         });
         ```
   - For more complicated use cases, such as when you do not have a URL, you can use base64 encoding. For example, this is done for the calendar created in `pdf-schedule-generator.ts`.
      - For this, we recommend defining a helper function that converts the HTML of the component to a canvas and then to a base64 string. Here is an example of how to do this:
         ```ts
         async generatePdfData(): Promise<string> {
            // Get the HTML of the Vue component
            const element = this.$el;

            // Use html2canvas to convert the HTML to a canvas
            const canvas = await html2canvas(element);

            const imgData = canvas.toDataURL('image/png');

            return imgData;
         },
         ```
         Note that you will need to install `html2canvas` to use this function.
- For table generation, things are actually pretty straightforward thanks to `jspdf-autotable`'s `autoTable` function. With it, you can just pass in the document, some options, and the data you want to build the table with. The plugin will take care of the rest. See [documentation here](https://github.com/simonbengtsson/jsPDF-AutoTable).
