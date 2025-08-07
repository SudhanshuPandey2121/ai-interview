import Vapi from "@vapi-ai/web"; // ✅ default import

let vapi: Vapi | null = null;

export const getVapi = () => {
  if (typeof window === "undefined") return null;

  if (!vapi) {
    vapi = new Vapi(process.env.NEXT_PUBLIC_VAPI_WEB_TOKEN!); // ✅ just a string
  }

  return vapi;
};
