import { useRef } from "react";
import { toBlob } from "html-to-image";
import jsPDF from "jspdf";

export function useDownloadPDF(filename = "invoice.pdf") {
    const ref = useRef<HTMLDivElement>(null);

    const generatePDF = async (): Promise<jsPDF | null> => {
        const element = ref.current;
        if (!element) return null;

        await document.fonts.ready;

        const images = element.querySelectorAll("img");

        await Promise.all(
            Array.from(images).map((img) => {
                if (img.complete) return Promise.resolve();
                return new Promise((resolve) => {
                    img.onload = resolve;
                    img.onerror = resolve;
                });
            }),
        );

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

        const pdfBlob = pdf.output("blob") as Blob;
        return URL.createObjectURL(pdfBlob);
    };

    return { ref, download, preview };
}
