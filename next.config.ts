import type { NextConfig } from "next";
import { withPayload } from "@payloadcms/next/withPayload";

const nextConfig: NextConfig = {
  /* The floating dev-tools badge sits over the bottom-left of the design. */
  devIndicators: false,
};

export default withPayload(nextConfig);
