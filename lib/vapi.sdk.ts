import Vapi from "@vapi-ai/web";

let vapi: Vapi | null = null;

export const getVapi = () => {
  if (typeof window === 'undefined') {
    return null;
  }
  
  if (!vapi) {
    vapi = new Vapi(process.env.NEXT_PUBLIC_VAPI_WEB_TOKEN!);
  }
  
  return vapi;
};
