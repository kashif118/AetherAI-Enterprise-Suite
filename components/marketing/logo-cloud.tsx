const CUSTOMERS = [
  "Northwind",
  "Halcyon Bank",
  "Meridian Health",
  "Foxglove Retail",
  "Aldridge Energy",
  "Portside Logistics",
];

/**
 * Wordmarks rather than images: these are fictional customers, and set type
 * reads as deliberate at every breakpoint without shipping six SVGs.
 */
export function LogoCloud() {
  return (
    <section className="border-y border-border bg-surface py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="text-center text-[13px] font-medium text-fg-subtle">
          Running in production at platform teams across regulated industries
        </h2>
        <ul className="mt-6 grid grid-cols-2 items-center gap-x-6 gap-y-5 sm:grid-cols-3 lg:grid-cols-6">
          {CUSTOMERS.map((customer) => (
            <li
              key={customer}
              className="text-center text-[15px] font-semibold tracking-tight text-fg-subtle/80"
            >
              {customer}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
