import { sumBy } from "lodash";
import React, { useMemo, useCallback } from "react";
import { useTheme } from "next-themes";
import { format as dateFormat } from "date-fns";
import { BranchItemState, ReportItem } from "types/state";
import { displayInteger, displayUnit } from "lib/textHelper";

type Props = {
  branch: BranchItemState;
  items: ReportItem[];
  sheet: any;
  displaySummary: boolean;
};

const DataSourceReport = (props: any, ref: any) => {
  const { branch, items, sheet, displaySummary }: Props = props;
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  // Theme-based colors
  const bgColor = isDark ? "#1e1e1e" : "#fff";
  const textColor = isDark ? "#e0e0e0" : "#000";
  const borderColor = isDark ? "#444" : "#A3A3A3";
  const screenBg = isDark ? "#121212" : "#666";

  const getSummaryRow = useCallback((rows: ReportItem[]) => {
    return {
      water_unit: sumBy(rows, "water_unit"),
      water_cost: sumBy(rows, "water_cost"),
      electric_unit: sumBy(rows, "electric_unit"),
      electric_cost: sumBy(rows, "electric_cost"),
      room_cost: sumBy(rows, "room_cost"),
      share_cost: sumBy(rows, "share_cost"),
      internet_cost: sumBy(rows, "internet_cost"),
      penalty_cost: sumBy(rows, "penalty_cost"),
      arrear: sumBy(rows, "arrear"),
      electric_extra_cost: sumBy(rows, "electric_extra_cost"),
      water_extra_cost: sumBy(rows, "water_extra_cost"),
      other1_cost: sumBy(rows, "other1_cost"),
      other2_cost: sumBy(rows, "other2_cost"),
      total: sumBy(rows, "total"),
    };
  }, []);

  const renderHeaderText = useCallback(() => {
    return (
      <p style={{ color: textColor }}>
        <span style={{ fontSize: "14pt", fontWeight: "bold" }}>
          {branch && branch.reportHeader}
        </span>{" "}
        <span style={{ fontSize: "12pt" }}>
          {sheet && sheet.title ? sheet.title : "N/A"}
        </span>{" "}
        <span id="printDate" style={{ fontSize: "9pt" }}>
          {`(date: ${dateFormat(new Date(), "dd-MM-yyyy HH:mm")})`}
        </span>
      </p>
    );
  }, [branch, sheet, textColor]);

  const generateAdditionalText = useCallback((row: ReportItem) => {
    let additionalText = "";
    if (
      row.electric_extra_cost !== 0 ||
      row.water_cost !== 0 ||
      row.other1_cost !== 0 ||
      row.other2_cost !== 0
    ) {
      if (row.electric_extra_cost !== 0) {
        additionalText += `${row.electric_extra}=${displayInteger(
          row.electric_extra_cost,
        )}, `;
      }
      if (row.water_extra_cost !== 0) {
        additionalText += `${row.water_extra}=${displayInteger(
          row.water_extra_cost,
        )}, `;
      }
      if (row.other1_cost !== 0) {
        additionalText += `${row.other1}=${displayInteger(row.other1_cost)}, `;
      }
      if (row.other2_cost !== 0) {
        additionalText += `${row.other2}=${displayInteger(row.other2_cost)}, `;
      }
      additionalText = additionalText.slice(0, -2);
    }
    return additionalText === "" ? undefined : additionalText;
  }, []);

  const summaryRow = useMemo(() => {
    return displaySummary === true ? getSummaryRow(items) : undefined;
  }, [displaySummary, items, getSummaryRow]);

  const hasInternetCost = useMemo(() => {
    return sumBy(items, "internet_cost") > 0;
  }, [items]);

  return (
    <div ref={ref}>
      <style>
        {`
          @media all {
            .page-break { display: none; }
          }
          @media print {
            @page { size: A4 landscape; margin-top: 5mm; margin-bottom: 5mm; }
            #content { padding: 5mm; }
            #printDate { display: inline; }
            /* Force white background for print if desired, or keep screen colors */
            /* Usually print should be white paper */
            #tb { background-color: #fff !important; color: #000 !important; border-color: #A3A3A3 !important; }
            #tb th, #tb td { border-color: #A3A3A3 !important; color: #000 !important; }
            #tb .header { border-color: #A3A3A3 !important; }
            #tb .header p, #tb .header span { color: #000 !important; }
          }
          @media screen {
            #content { padding: 5mm; text-align: -webkit-center; background-color: ${screenBg}; overflow-x: scroll; }
            #printDate { display: none; }
          }
          #tb {
            width: 100%;
            min-width: 900px;
            border: 1px solid ${borderColor};
            border-collapse: collapse;
            border-spacing: 0px;
            background-color: ${bgColor};
            color: ${textColor};
            font-size: 10pt;
          }
          #tb thead {
            border: 1px solid ${borderColor};
          }
          #tb th:first-child {
            border-right: 1px solid ${borderColor};
          }
          #tb th {
            border-right: 1px solid ${borderColor};
            border-bottom: 1px solid ${borderColor};
          }
          #tb thead { text-align: center; }
          #tb tbody { text-align: right; }
          #tb .text { text-align: left; }
          .additionalText { text-align: left; }
          #tb td { padding-right: 5px; border-top: 1px solid ${borderColor}; }
          #tb .last { border-left: 1px solid ${borderColor}; }
          #tb .summary { font-weight: bold; }
          #tb .header {
            border-top: 1px solid ${borderColor};
            border-left: 1px solid ${borderColor};
            border-right: 1px solid ${borderColor} !important;
            text-align: left;
            padding-left: 10mm;
          }
        `}
      </style>
      {items && items.length > 0 && (
        <div id="content">
          <table id="tb">
            <thead>
              <tr>
                <th className="header" colSpan={hasInternetCost ? 17 : 16}>
                  {renderHeaderText()}
                </th>
              </tr>
              <tr>
                <th rowSpan={2}>ห้อง</th>
                <th rowSpan={2}>ชื่อ</th>
                <th rowSpan={2}>รวม</th>
                <th colSpan={4}>น้ำ</th>
                <th colSpan={4}>ไฟ</th>
                <th rowSpan={2}>ห้อง</th>
                <th rowSpan={2}>กลาง</th>
                {hasInternetCost && <th rowSpan={2}>เน็ต</th>}
                <th rowSpan={2}>ปรับ</th>
                <th rowSpan={2}>ค้าง</th>
                <th rowSpan={2}>ลงชื่อ</th>
              </tr>
              <tr>
                <th>ก่อน</th>
                <th>หลัง</th>
                <th>หน่วย</th>
                <th>บาท</th>
                <th>ก่อน</th>
                <th>หลัง</th>
                <th>หน่วย</th>
                <th>บาท</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item: any) => {
                let additionalText = generateAdditionalText(item);
                return (
                  <React.Fragment key={item.room}>
                    <tr>
                      <td className="text">{item.room}</td>
                      <td className="text">{item.name}</td>
                      <td>{displayInteger(item.total, "-")}</td>
                      <td>{displayUnit(item.water_start, 4)}</td>
                      <td>{displayUnit(item.water_end, 4)}</td>
                      <td>{displayInteger(item.water_unit, "-")}</td>
                      <td>{displayInteger(item.water_cost, "-")}</td>
                      <td>{displayUnit(item.electric_start, 4)}</td>
                      <td>{displayUnit(item.electric_end, 4)}</td>
                      <td>{displayInteger(item.electric_unit, "-")}</td>
                      <td>{displayInteger(item.electric_cost, "-")}</td>
                      <td>{displayInteger(item.room_cost, "-")}</td>
                      <td>{displayInteger(item.share_cost, "-")}</td>
                      {hasInternetCost && (
                        <td>{displayInteger(item.internet_cost, "-")}</td>
                      )}
                      <td>{displayInteger(item.penalty_cost, "-")}</td>
                      <td>{displayInteger(item.arrear, "-")}</td>
                      <td className="last"></td>
                    </tr>
                    {additionalText && (
                      <tr>
                        <td colSpan={1}></td>
                        <td
                          className="additionalText"
                          colSpan={hasInternetCost ? 15 : 14}
                        >
                          {additionalText}
                        </td>
                        <td className="last"></td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
              {summaryRow && (
                <tr className="summary">
                  <td colSpan={2}></td>
                  <td>{displayInteger(summaryRow.total, "-")}</td>
                  <td colSpan={2}></td>
                  <td>{displayInteger(summaryRow.water_unit)}</td>
                  <td>{displayInteger(summaryRow.water_cost, "-")}</td>
                  <td colSpan={2}></td>
                  <td>{displayInteger(summaryRow.electric_unit)}</td>
                  <td>{displayInteger(summaryRow.electric_cost, "-")}</td>
                  <td>{displayInteger(summaryRow.room_cost, "-")}</td>
                  <td>{displayInteger(summaryRow.share_cost, "-")}</td>
                  {hasInternetCost && (
                    <td>{displayInteger(summaryRow.internet_cost, "-")}</td>
                  )}
                  <td>{displayInteger(summaryRow.penalty_cost, "-")}</td>
                  <td>{displayInteger(summaryRow.arrear, "-")}</td>
                  <td className="last"></td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

DataSourceReport.displayName = "DataSourceReport";

export default React.forwardRef(DataSourceReport);
