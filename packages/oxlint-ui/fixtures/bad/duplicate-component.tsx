export function Card({ children }: { children: string }) {
  // expect: uislash/duplicate-component
  return <section>{children}</section>;
}
export const Badge = ({ label }: { label: string }) => <b>{label}</b>; // expect: uislash/duplicate-component
