import type { NextConfig } from "next";
import { withPayload } from "@payloadcms/next/withPayload";

const nextConfig: NextConfig = {
  /* The floating dev-tools badge sits over the bottom-left of the design. */
  devIndicators: false,
  images: {
    /* The Ember & Oak demo (/demo/cafe) sources its photography from Unsplash. */
    remotePatterns: [{ protocol: "https", hostname: "images.unsplash.com" }],
  },
};

export default withPayload(nextConfig);
