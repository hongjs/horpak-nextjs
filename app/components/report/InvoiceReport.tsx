import React, { useCallback, useMemo } from 'react';
import { useTheme } from 'next-themes';
import {
  displayInteger,
  displayUnit,
  displayMoney,
  toFullMonthYear,
  toShortMonthYear,
} from 'lib/textHelper';
import { BankItemState, BranchItemState, ReportItem } from 'types/state';

type Props = {
  items: ReportItem[];
  branch: BranchItemState;
  banks: BankItemState[];
  invoiceMonth: Date;
  dueDate: Date;
  // rooms?: number[]; // filter rooms
  // hasName: boolean;
};

const InvoiceReport = (props: any, ref: any) => {
  const { items, branch, banks, invoiceMonth, dueDate }: Props = props;
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';

  const bgColor = isDark ? '#1e1e1e' : '#fff';
  const textColor = isDark ? '#e0e0e0' : '#000';
  const screenBg = isDark ? '#121212' : '#666';
  const borderColor = isDark ? '#555' : '#555';
  const dashedBorder = isDark ? '#444' : '#A3A3A3';

  const generateRemark = useCallback(
    (bank_id: number) => {
      const bank = banks.find((bank) => bank.bankId == bank_id);

      if (bank) {
        const remark = branch.reportRemark
          ? branch.reportRemark
              .replace('[@BANK]', bank.bankName ? bank.bankName : '')
              .replace('[@ACCOUNT_NO]', bank.accountNo ? bank.accountNo : '')
              .replace(
                '[@ACCOUNT_NAME]',
                bank.accountName ? bank.accountName : ''
              )
          : '';

        return (
          <div>
            {remark.split('|').map((i, index) => {
              return (
                <div key={index}>{`${
                  index === 1 ? 'หมายเหตุ: ' : ''
                }${i}`}</div>
              );
            })}
          </div>
        );
      } else {
        return branch.reportRemark;
      }
    },
    [branch, banks]
  );

  const renderRow = useCallback(
    (row: ReportItem) => {
      return (
        <table id="tb">
          <tbody>
            <tr className="header">
              <td colSpan={5}>{branch.reportHeader}</td>
            </tr>
            <tr className="contact">
              <td colSpan={5}>ที่อยู่: {branch.reportAddress}</td>
            </tr>
            <tr className="contact border-bottom">
              <td colSpan={5}>เบอร์ติดต่อ: {branch.reportContact}</td>
            </tr>
            <tr className="title">
              <td colSpan={3}>
                ใบแจ้งค่าใช้บริการ เดือน {toFullMonthYear(invoiceMonth)}
              </td>
              <td colSpan={2} style={{ textAlign: 'right', fontSize: '10pt' }}>
                ชำระเงินภายในวันที่ {toShortMonthYear(dueDate)}
              </td>
            </tr>
            <tr className="divider">
              <td colSpan={5}></td>
            </tr>
            <tr className="title2">
              <td colSpan={5}>
                คุณ{row.name} ห้อง {row.room}
              </td>
            </tr>
            <tr>
              <td className="space"></td>
              <td>มิเตอร์ไฟ </td>
              <td>
                ครั้งก่อน {displayUnit(row.electric_start, 4)} ครั้งหลัง{' '}
                {displayUnit(row.electric_end, 4)} (
                {displayInteger(row.electric_unit)} น.)
              </td>
              <td className="amount">{displayMoney(row.electric_cost)} บาท</td>
              <td className="space"></td>
            </tr>
            <tr>
              <td className="space"></td>
              <td>มิเตอร์น้ำ </td>
              <td>
                ครั้งก่อน {displayUnit(row.water_start, 4)} ครั้งหลัง{' '}
                {displayUnit(row.water_end, 4)} (
                {displayInteger(row.water_unit)} น.)
              </td>
              <td className="amount">{displayMoney(row.water_cost)} บาท</td>
              <td className="space"></td>
            </tr>
            <tr>
              <td className="space"></td>
              <td>ค่าเช่าห้อง</td>
              <td></td>
              <td className="amount">{displayMoney(row.room_cost)} บาท</td>
              <td className="space"></td>
            </tr>
            {row.share_cost !== 0 && (
              <tr>
                <td className="space"></td>
                <td>ค่าส่วนกลาง</td>
                <td></td>
                <td className="amount">{displayMoney(row.share_cost)} บาท</td>
                <td className="space"></td>
              </tr>
            )}
            {row.internet_cost !== 0 && (
              <tr>
                <td className="space"></td>
                <td>ค่าอินเตอร์เน็ต</td>
                <td></td>
                <td className="amount">
                  {displayMoney(row.internet_cost)} บาท
                </td>
                <td className="space"></td>
              </tr>
            )}
            {row.penalty_cost !== 0 && (
              <tr>
                <td className="space"></td>
                <td>ค่าปรับ</td>
                <td></td>
                <td className="amount">{displayMoney(row.penalty_cost)} บาท</td>
                <td className="space"></td>
              </tr>
            )}
            {row.arrear !== 0 && (
              <tr>
                <td className="space"></td>
                <td>ค้างชำระ</td>
                <td></td>
                <td className="amount">{displayMoney(row.arrear)} บาท</td>
                <td className="space"></td>
              </tr>
            )}
            {row.electric_extra_cost !== 0 && (
              <tr>
                <td className="space"></td>
                <td colSpan={2}>{row.electric_extra}</td>
                <td className="amount">
                  {displayMoney(row.electric_extra_cost)} บาท
                </td>
                <td className="space"></td>
              </tr>
            )}
            {row.water_extra_cost !== 0 && (
              <tr>
                <td className="space"></td>
                <td colSpan={2}>{row.water_extra}</td>
                <td className="amount">
                  {displayMoney(row.water_extra_cost)} บาท
                </td>
                <td className="space"></td>
              </tr>
            )}
            {row.other1_cost !== 0 && (
              <tr>
                <td className="space"></td>
                <td colSpan={2}>{row.other1}</td>
                <td className="amount">{displayMoney(row.other1_cost)} บาท</td>
                <td className="space"></td>
              </tr>
            )}
            {row.other2_cost !== 0 && (
              <tr>
                <td className="space"></td>
                <td colSpan={2}>{row.other2}</td>
                <td className="amount">{displayMoney(row.other2_cost)} บาท</td>
                <td className="space"></td>
              </tr>
            )}
            <tr className="summary">
              <td className="space"></td>
              <td colSpan={2}>รวม</td>
              <td className="amount">{displayMoney(row.total)} บาท</td>
              <td className="space"></td>
            </tr>
            <tr className="remark">
              <td className="space"></td>
              <td colSpan={3}>{generateRemark(row.bank_id)}</td>
              <td className="space"></td>
            </tr>
          </tbody>
        </table>
      );
    },
    [branch, dueDate, invoiceMonth, generateRemark]
  );

  return (
    <div style={{ position: 'relative' }}>
      <div ref={ref}>
        <style>
          {`
            @media print { 
              @page { size: A4 portrait; } 
              #content { padding: 0mm; } 
              footer { page-break-after: always; } 
              .section { background-color: #fff !important; color: #000 !important; }
              #tb { background-color: #fff !important; color: #000 !important; }
              #tb td { border-color: #555 !important; }
            } 
            @media screen { 
              #content { padding: 5mm; text-align: -webkit-center; background-color: ${screenBg}; overflow-x: scroll; } 
              footer { margin-bottom: 5mm; } 
            } 
            #tb { width: 100%; background-color: ${bgColor}; font-size: 10pt; color: ${textColor}; } 
            #tb .space { width: 20mm; } 
            #tb .amount { text-align: right; } 
            #tb .summary { font-weight: bold; } 
            #tb .summary td { padding-bottom: 2mm; } 
            #tb .remark p { font-size: 9pt; } 
            #tb .header td { font-size: 15pt; font-weight: bold; padding: 2mm; border-top: 1px solid ${borderColor}; border-bottom: 1px solid ${borderColor}; } 
            #tb .title td { font-size: 12pt; font-weight: bold; } 
            #tb .divider td { height: 1px; border-bottom: 1px solid ${borderColor}; } 
            #tb .title2 td { font-size: 12pt; padding-bottom: 3mm; } 
            .section { width: 210mm; height: 148mm; padding: 10mm; background-color: ${bgColor}; color: ${textColor}; } 
            .section-first { border-bottom: 1px dashed ${dashedBorder}; } 
            #tb .contact td { font-size: 8pt; } 
            #tb .border-bottom td { border-bottom: 2px solid ${borderColor}; }
          `}
        </style>
        {items && items.length > 0 && (
          <div id="content">
            {items.map((row, index) => {
              return (
                <div key={index}>
                  <div
                    className={`section ${
                      index % 2 === 0 ? 'section-first' : ''
                    }`}
                  >
                    {renderRow(row)}
                  </div>
                  {index % 2 === 1 && <footer />}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

InvoiceReport.displayName = 'InvoiceReport';

export default React.forwardRef(InvoiceReport);
