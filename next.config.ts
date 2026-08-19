import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

const nextConfig: NextConfig = {
  // pdfjs-dist hardcodes `require("canvas")` in its NodeCanvasFactory, which
  // Turbopack eagerly resolves at build time; @napi-rs/canvas ships native
  // binaries. Keep both as runtime externals and inject @napi-rs/canvas via a
  // custom canvasFactory (see src/app/api/pdf-loader/route.ts).
  serverExternalPackages: ["pdfjs-dist", "@napi-rs/canvas"],
};

export default withNextIntl(nextConfig);
