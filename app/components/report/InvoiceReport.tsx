import React, { useCallback, useMemo } from 'react'
import { useTheme } from 'next-themes'
import {
  displayInteger,
  displayUnit,
  displayMoney,
  toFullMonthYear,
  toShortMonthYear
} from 'lib/textHelper'
import { BankItemState, BranchItemState, ReportItem } from 'types/state'

type Props = {
  items: ReportItem[]
  branch: BranchItemState
  banks: BankItemState[]
  invoiceMonth: Date
  dueDate: Date
  // rooms?: number[]; // filter rooms
  // hasName: boolean;
}

const InvoiceReport = (props: any, ref: any) => {
  const { items, branch, banks, invoiceMonth, dueDate }: Props = props
  const { resolvedTheme } = useTheme()
  const isDark = resolvedTheme === 'dark'

  const bgColor = isDark ? '#1e1e1e' : '#fff'
  const textColor = isDark ? '#e0e0e0' : '#000'
  const screenBg = isDark ? '#121212' : '#666'
  const borderColor = isDark ? '#555' : '#555'
  const dashedBorder = isDark ? '#444' : '#A3A3A3'

  const generateRemark = useCallback(
    (bank_id: number) => {
      const bank = banks.find((bank) => bank.bankId == bank_id)

      if (bank) {
        const remark = branch.reportRemark
          ? branch.reportRemark
              .replace('[@BANK]', bank.bankName ? bank.bankName : '')
              .replace('[@ACCOUNT_NO]', bank.accountNo ? bank.accountNo : '')
              .replace('[@ACCOUNT_NAME]', bank.accountName ? bank.accountName : '')
          : ''

        return (
          <span>{remark.split('|').join(' | ')}</span>
        )
      } else {
        return branch.reportRemark
      }
    },
    [branch, banks]
  )

  const renderRow = useCallback(
    (row: ReportItem) => {
      return (
        <table id="tb">
          <tbody>
            <tr className="header">
              <td colSpan={2}>{branch.reportHeader}</td>
              <td colSpan={2} style={{ fontSize: '7pt', textAlign: 'right' }}>
                ชำระภายในวันที่ {toShortMonthYear(dueDate)}
              </td>
            </tr>
            <tr className="contact">
              <td colSpan={4}>{branch.reportAddress} | {branch.reportContact}</td>
            </tr>
            <tr className="title2">
              <td colSpan={4}>
                ห้อง {row.room} คุณ{row.name}
              </td>
            </tr>
            <tr className="item-row">
              <td className="label">ค่าไฟ</td>
              <td className="meter">
                {displayUnit(row.electric_start, 2)} - {displayUnit(row.electric_end, 2)} ({displayInteger(row.electric_unit)} น.)
              </td>
              <td className="amount">{displayMoney(row.electric_cost)}</td>
              <td className="unit">บาท</td>
            </tr>
            <tr className="item-row">
              <td className="label">ค่าน้ำ</td>
              <td className="meter">
                {displayUnit(row.water_start, 2)} - {displayUnit(row.water_end, 2)} ({displayInteger(row.water_unit)} น.)
              </td>
              <td className="amount">{displayMoney(row.water_cost)}</td>
              <td className="unit">บาท</td>
            </tr>
            <tr className="item-row">
              <td className="label">ค่าห้อง</td>
              <td></td>
              <td className="amount">{displayMoney(row.room_cost)}</td>
              <td className="unit">บาท</td>
            </tr>
            {row.share_cost !== 0 && (
              <tr className="item-row">
                <td className="label">ค่าส่วนกลาง</td>
                <td></td>
                <td className="amount">{displayMoney(row.share_cost)}</td>
                <td className="unit">บาท</td>
              </tr>
            )}
            {row.internet_cost !== 0 && (
              <tr className="item-row">
                <td className="label">ค่าเน็ต</td>
                <td></td>
                <td className="amount">{displayMoney(row.internet_cost)}</td>
                <td className="unit">บาท</td>
              </tr>
            )}
            {row.penalty_cost !== 0 && (
              <tr className="item-row">
                <td className="label">ค่าปรับ</td>
                <td></td>
                <td className="amount">{displayMoney(row.penalty_cost)}</td>
                <td className="unit">บาท</td>
              </tr>
            )}
            {row.arrear !== 0 && (
              <tr className="item-row">
                <td className="label">ค้างชำระ</td>
                <td></td>
                <td className="amount">{displayMoney(row.arrear)}</td>
                <td className="unit">บาท</td>
              </tr>
            )}
            {row.electric_extra_cost !== 0 && (
              <tr className="item-row">
                <td className="label" style={{ fontSize: '7pt' }}>{row.electric_extra}</td>
                <td></td>
                <td className="amount">{displayMoney(row.electric_extra_cost)}</td>
                <td className="unit">บาท</td>
              </tr>
            )}
            {row.water_extra_cost !== 0 && (
              <tr className="item-row">
                <td className="label" style={{ fontSize: '7pt' }}>{row.water_extra}</td>
                <td></td>
                <td className="amount">{displayMoney(row.water_extra_cost)}</td>
                <td className="unit">บาท</td>
              </tr>
            )}
            {row.other1_cost !== 0 && (
              <tr className="item-row">
                <td className="label" style={{ fontSize: '7pt' }}>{row.other1}</td>
                <td></td>
                <td className="amount">{displayMoney(row.other1_cost)}</td>
                <td className="unit">บาท</td>
              </tr>
            )}
            {row.other2_cost !== 0 && (
              <tr className="item-row">
                <td className="label" style={{ fontSize: '7pt' }}>{row.other2}</td>
                <td></td>
                <td className="amount">{displayMoney(row.other2_cost)}</td>
                <td className="unit">บาท</td>
              </tr>
            )}
            <tr className="summary">
              <td colSpan={2}>รวม</td>
              <td className="amount">{displayMoney(row.total)}</td>
              <td className="unit">บาท</td>
            </tr>
            <tr className="remark">
              <td colSpan={4}>{generateRemark(row.bank_id)}</td>
            </tr>
          </tbody>
        </table>
      )
    },
    [branch, dueDate, invoiceMonth, generateRemark]
  )

  return (
    <div style={{ position: 'relative' }}>
      <div ref={ref}>
        <style>
          {`
            @media print {
              @page { size: A4 portrait; margin: 5mm 15mm; }
              #content { padding: 0mm; background-color: #fff !important; }
              footer { page-break-after: always; }
              .section { background-color: #fff !important; color: #000 !important; }
              #tb { background-color: #fff !important; color: #000 !important; }
              #tb td { border-color: #555 !important; color: #000 !important; }
            }
            @media screen {
              #content { padding: 5mm; text-align: -webkit-center; background-color: ${screenBg}; overflow-y: scroll; }
              footer { margin-bottom: 5mm; }
            }
            /* PDF export specific - applied via class */
            .pdf-export #content { background-color: #fff !important; padding: 0 !important; }
            .pdf-export .section { background-color: #fff !important; color: #000 !important; }
            .pdf-export #tb { background-color: #fff !important; color: #000 !important; }
            .pdf-export #tb td { border-color: #555 !important; color: #000 !important; }
            .pdf-export .section-border-right { border-color: #A3A3A3 !important; }
            .pdf-export .section-border-bottom { border-color: #A3A3A3 !important; }
            #tb { width: 100%; background-color: ${bgColor}; font-size: 8.5pt; color: ${textColor}; line-height: 1.2; border-collapse: collapse; }
            #tb .label { width: 22%; font-weight: 500; padding: 2px 2px; }
            #tb .meter { width: 38%; padding: 2px 2px; font-size: 8pt; }
            #tb .amount { text-align: right; width: 25%; padding: 2px 2px; }
            #tb .unit { width: 15%; padding: 2px 2px; }
            #tb .summary { font-weight: bold; border-top: 1px solid ${borderColor}; border-bottom: 1px solid ${borderColor}; }
            #tb .summary td { padding: 2px 2px; }
            #tb .remark { font-size: 7.5pt; padding: 2px 2px; }
            #tb .header td { font-size: 9pt; font-weight: bold; padding: 2px 2px; }
            #tb .title2 td { font-size: 8.5pt; font-weight: bold; padding: 2px 2px; }
            #tb .contact td { font-size: 7pt; padding: 1px 2px; border-bottom: 1px solid ${borderColor}; }
            #tb td { padding: 1px 2px; }
            #tb .item-row td { padding-left: 8mm; padding-right: 2px; }
            .page-container { display: flex; flex-direction: column; width: 202mm; }
            .section { width: 202mm; height: 57.8mm; padding: 1.5mm; background-color: ${bgColor}; color: ${textColor}; box-sizing: border-box; overflow: hidden; border-bottom: 1px solid ${dashedBorder}; }
            .section-border-right { border-right: none; }
            .section-border-bottom { border-bottom: none; }
          `}
        </style>
        {items && items.length > 0 && (
          <div id="content">
            {Array.from({ length: Math.ceil(items.length / 5) }).map((_, pageIndex) => {
              const pageItems = items.slice(pageIndex * 5, (pageIndex + 1) * 5)
              return (
                <React.Fragment key={pageIndex}>
                  <div className="page-container">
                    {pageItems.map((row, idx) => {
                      return (
                        <div
                          key={idx}
                          className="section"
                        >
                          {renderRow(row)}
                        </div>
                      )
                    })}
                  </div>
                  <footer />
                </React.Fragment>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

InvoiceReport.displayName = 'InvoiceReport'

export default React.forwardRef(InvoiceReport)
