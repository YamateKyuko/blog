import type { Metadata } from "next";
import "./globals.css";
import styles from "./page.module.css"

export const metadata: Metadata = {
  title: "Yamakyu.Log",
  description: "Loging Daily Activities...   By Yamakyu",
};

const baseurl = process.env.GH_BASEURL || ''

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <head>
        
      </head>
      <body>
        <header className={styles.header}>
          <a href={baseurl}></a>
          <img className="light" src={`${baseurl}YamakyuLog.svg`} alt="Yamakyu.Log" />
          <img className="dark" src={`${baseurl}YamakyuLogDark.svg`} alt="Yamakyu.Log" />
        </header>
        {children}
        <footer>(c) Yamakyu All Rights Reserved.</footer>
      </body>
    </html>
  );
}
