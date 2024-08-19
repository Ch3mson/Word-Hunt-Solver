import { Inter } from "next/font/google";
import "./globals.css";
import Container from "@/components/container";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Word Hunt Solver",
  description: "Solves the board",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-[#040613]`}>
        <Container>
          {children}
        </Container>
      </body>
    </html>
  );
}
