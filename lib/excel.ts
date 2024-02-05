import { BorderStyle, Worksheet } from "exceljs";

export const createOuterBorder = (
  worksheet: Worksheet,
  [startCol, startRow]: [number, number],
  [endCol, endRow]: [number, number],
  style: BorderStyle = "thin"
) => {
  for (let i = startRow; i <= endRow; i++) {
    const leftBorderCell = worksheet.getCell(i, startCol);
    const rightBorderCell = worksheet.getCell(i, endCol);

    leftBorderCell.border = {
      ...leftBorderCell.border,
      left: {
        style,
      },
    };

    rightBorderCell.border = {
      ...rightBorderCell.border,
      right: {
        style,
      },
    };
  }

  for (let i = startCol; i <= endCol; i++) {
    const topBorderCell = worksheet.getCell(startRow, i);
    const bottomBorderCell = worksheet.getCell(endRow, i);

    topBorderCell.border = {
      ...topBorderCell.border,
      top: {
        style,
      },
    };

    bottomBorderCell.border = {
      ...bottomBorderCell.border,
      bottom: {
        style,
      },
    };
  }
};
