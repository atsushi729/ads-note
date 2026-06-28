import "@/styles/globals.css";
export const metadata = { title: "algo notes", description: "LeetCode notes viewer" };
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}
