import "@/styles/globals.css";
import { Hanken_Grotesk, JetBrains_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
const hanken = Hanken_Grotesk({ subsets: ["latin"], weight: ["400","500","600","700","800"], variable: "--font-hanken" });
const mono = JetBrains_Mono({ subsets: ["latin"], weight: ["400","500","600"], variable: "--font-jetbrains" });
export const metadata = { title: "algo notes", description: "LeetCode notes viewer" };
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja" className={`${hanken.variable} ${mono.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html:
          `try{var t=localStorage.getItem('theme');if(t==='dark')document.documentElement.classList.add('dark')}catch(e){}` }} />
      </head>
      <body className="bg-canvas font-sans text-fg antialiased">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
