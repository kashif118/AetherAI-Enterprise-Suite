import { Table, TableWrapper, Td, Th, Tr } from "@/components/ui/table";
import { formatCompact, formatDate } from "@/lib/utils";
import type { TimeSeries } from "@/types";

/**
 * The table view of the usage chart.
 *
 * Two of the light-mode series colours sit below 3:1 against the surface, so
 * the relief rule applies: the same data must be readable without relying on
 * the fills. This is that relief, and it doubles as the accessible alternative
 * to the chart.
 */
export function UsageTable({ series }: { series: TimeSeries }) {
  return (
    <TableWrapper className="max-h-96 overflow-y-auto">
      <Table>
        <caption className="sr-only">
          Requests per day by model for the selected period
        </caption>
        <thead className="sticky top-0 bg-surface">
          <tr>
            <Th>Date</Th>
            {series.keys.map((key) => (
              <Th key={key} className="text-right">
                {series.labels[key] ?? key}
              </Th>
            ))}
            <Th className="text-right">Total</Th>
          </tr>
        </thead>
        <tbody>
          {[...series.points].reverse().map((point) => {
            const total = series.keys.reduce(
              (sum, key) => sum + (point.series[key] ?? 0),
              0,
            );
            return (
              <Tr key={point.date}>
                <Td className="whitespace-nowrap">{formatDate(point.date)}</Td>
                {series.keys.map((key) => (
                  <Td key={key} className="text-right tabular-nums">
                    {formatCompact(point.series[key] ?? 0)}
                  </Td>
                ))}
                <Td className="text-right font-medium tabular-nums">
                  {formatCompact(total)}
                </Td>
              </Tr>
            );
          })}
        </tbody>
      </Table>
    </TableWrapper>
  );
}
