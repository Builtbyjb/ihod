import { useRef } from "react";
import { toBlob } from "html-to-image";
import jsPDF from "jspdf";

export function useDownloadPDF(filename = "invoice.pdf") {
    const ref = useRef<HTMLDivElement>(null);

    async function waitForImages(element: HTMLElement): Promise<void> {
        const images = Array.from(element.querySelectorAll("img"));
        await Promise.all(
            images.map((img) => {
                if (img.complete && img.naturalWidth > 0) return Promise.resolve();
                return new Promise<void>((resolve) => {
                    img.onload = () => resolve();
                    img.onerror = () => resolve();
                });
            }),
        );
    }

    const generatePDF = async (): Promise<jsPDF | null> => {
        const element = ref.current;
        if (!element) return null;

        await document.fonts.ready;
        await waitForImages(element);

        const blob = await toBlob(element, { pixelRatio: 2, cacheBust: true });
        if (!blob) {
            console.error("toBlob returned null");
            return null;
        }

        const url = URL.createObjectURL(blob);
        const img = new Image();
        img.src = url;
        await new Promise((res) => (img.onload = res));

        const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const imgHeight = (img.height * pdfWidth) / img.width;

        const pdfHeight = pdf.internal.pageSize.getHeight();
        let heightLeft = imgHeight;
        let yOffset = 0;

        pdf.addImage(url, "PNG", 0, yOffset, pdfWidth, imgHeight);
        heightLeft -= pdfHeight;

        while (heightLeft > 0) {
            yOffset -= pdfHeight;
            pdf.addPage();
            pdf.addImage(url, "PNG", 0, yOffset, pdfWidth, imgHeight);
            heightLeft -= pdfHeight;
        }

        URL.revokeObjectURL(url);
        return pdf;
    };

    const download = async () => {
        const pdf = await generatePDF();
        if (pdf) pdf.save(filename);
    };

    const preview = async (): Promise<string | null> => {
        const pdf = await generatePDF();
        if (!pdf) return null;
        return pdf.output("bloburl").toString();
    };

    return { ref, download, preview };
}
