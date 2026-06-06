import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";

import "~/assets/Cairo-Medium-normal";
import { logoBase64 } from "~/assets/logo.js";

var doc = new jsPDF();

export default async (orderDetails: any) => {
  doc.setFont("Cairo-Medium", "normal");
  doc.setFontSize(16);

  const pageWidth = doc.internal.pageSize.getWidth();
  const logoWidth = 40;
  const logoHeight = 20;
  const logoX = (pageWidth - logoWidth) / 2;
  doc.addImage(logoBase64, "PNG", logoX, 10, logoWidth, logoHeight);

  doc.text(orderDetails.guestName, 105, 40, { align: "center" });

  doc.setFontSize(12);
  doc.text(`Email: ${orderDetails?.guestEmail}`, 20, 50);
  doc.text(`Mobile: ${orderDetails?.guestMobile}`, pageWidth - 20, 50, {
    align: "right",
  });

  doc.text(`VAT: ${orderDetails?.VAT}`, 20, 60);
  doc.text(`Total: ${orderDetails?.total}`, pageWidth - 20, 60, {
    align: "right",
  });

  doc.text(`Status: ${orderDetails?.status}`, 20, 70);
  doc.text(
    `Payment Status: ${orderDetails?.payment_status}`,
    pageWidth - 20,
    70,
    {
      align: "right",
    }
  );

  const tableContainer = document.createElement("div");
  tableContainer.style.position = "fixed";
  tableContainer.style.top = "-9999px"; // Hide the element

  let tableHTML = `
        <style>
            table {
                font-family: 'Arabic';
                width: 100%;
                border-collapse: collapse;
                font-size: 8px;
            }
            th {
                background-color: #52B788;
                color: white;
                font-size: 8px;
                padding: 0 8px 8px 8px;
                text-align: left;
            }
            td {
                font-size: 10px;
                padding: 0 8px 8px 8px;
                border: 1px solid #ccc
            }
        </style>
        <table>
            <thead>
                <tr>
                    <th>Item Code</th>
                    <th>Item Price</th>
                    <th>Required QTY</th>
                    <th>Total Price</th>
                    <th>Status</th>
                </tr>
            </thead>
            <tbody>`;
  for (let item of orderDetails?.items) {
    tableHTML += `<tr>
            <td>${item.item_code}</td>
            <td>${item.item_price}</td>
            <td>${item.required_QTY}</td>
            <td>${item.total_price}</td>
            <td>${item.status}</td>
        </tr>`;
  }
  tableHTML += "</tbody></table>";

  tableContainer.innerHTML = tableHTML;
  document.body.appendChild(tableContainer);

  // Capture the table with html2canvas
  let canvas = await html2canvas(tableContainer, {
    scale: 2, // Increase scale for better resolution
    useCORS: true,
  });

  // Remove the table element from the DOM
  document.body.removeChild(tableContainer);

  // Add the captured image to the PDF
  const imgWidth = 180; // Adjust the width as needed
  const imgHeight = (canvas.height * imgWidth) / canvas.width;
  doc.addImage(
    canvas.toDataURL("image/png"),
    "PNG",
    15,
    90,
    imgWidth,
    imgHeight
  );

  doc.save(`${orderDetails?.id}-invoice.pdf`);
};
