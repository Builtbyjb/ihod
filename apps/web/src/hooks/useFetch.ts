import type { FetchInstance } from "@/lib/types";
import { toast } from "sonner";

const API_URL = import.meta.env.VITE_API_URL;
const RETRY_INTERVAL = 2000; // 2s
export function useFetch(): FetchInstance {
    const doGET = async (url: string): Promise<Response | Error> => {
        let maxRetries = 3;
        while (maxRetries > 0) {
            try {
                const response = await fetch(`${API_URL}${url}`, {
                    method: "GET",
                    credentials: "include",
                });

                return response;
            } catch (error) {
                console.error(error);
                maxRetries -= 1;

                if (maxRetries > 0) {
                    toast.error("Network Error: Retrying...");
                    await new Promise((resolve) => setTimeout(resolve, RETRY_INTERVAL));
                    continue;
                }
            }
        }
        return new Error("Request failed due to a network error");
    };

    const doPOST = async (url: string, data: any, contentType = "application/json"): Promise<Response | Error> => {
        let maxRetries = 3;
        while (maxRetries > 0) {
            try {
                const response = await fetch(`${API_URL}${url}`, {
                    method: "POST",
                    credentials: "include",
                    headers: { "Content-Type": contentType },
                    body: contentType === "application/json" ? JSON.stringify(data) : data,
                });

                return response;
            } catch (error) {
                console.error(error);
                maxRetries -= 1;

                if (maxRetries > 0) {
                    toast.error("Network Error: Retrying...");
                    await new Promise((resolve) => setTimeout(resolve, RETRY_INTERVAL));
                    continue;
                }
            }
        }
        return new Error("Request failed due to a network error");
    };

    const doDELETE = () => {};

    const doPUT = () => {};

    return { doGET, doPOST, doDELETE, doPUT };
}
