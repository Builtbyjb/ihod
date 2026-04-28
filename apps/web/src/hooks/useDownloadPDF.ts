import { useRef } from "react";
import { toBlob } from "html-to-image";
import jsPDF from "jspdf";

export function useDownloadPDF(filename = "document.pdf") {
    const ref = useRef(null);

    const download = async () => {
        const element = ref.current;
        if (!element) return;

        await document.fonts.ready;

        const blob = await toBlob(element, { pixelRatio: 2 });
        if (!blob) {
            console.error("toBlob returned null");
            return;
        }

        const url = URL.createObjectURL(blob);
        const img = new Image();
        img.src = url;
        await new Promise((res) => (img.onload = res));

        const pdf = new jsPDF({ orientation: "portrait", unit: "px", format: "a4" });
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
        pdf.save(filename);
    };

    return { ref, download };
}
