import type { FetchInstance } from "@/lib/types";
import { useCallback } from "react";
import { toast } from "sonner";

const API_URL = import.meta.env.VITE_API_URL;
const RETRY_INTERVAL = 2000; // 2s

export function useFetch(): FetchInstance {
    const doGET = useCallback(async (url: string): Promise<Response | Error> => {
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
    }, []);

    const doPOST = useCallback(async (url: string, data: any): Promise<Response | Error> => {
        let maxRetries = 3;
        const isFormData = data instanceof FormData;

        while (maxRetries > 0) {
            try {
                const response = await fetch(`${API_URL}${url}`, {
                    method: "POST",
                    credentials: "include",
                    headers: isFormData ? undefined : { "Content-Type": "application/json" },
                    body: isFormData ? data : JSON.stringify(data),
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
    }, []);

    const doPUT = useCallback(async (url: string, data: any): Promise<Response | Error> => {
        let maxRetries = 3;
        const isFormData = data instanceof FormData;

        while (maxRetries > 0) {
            try {
                const response = await fetch(`${API_URL}${url}`, {
                    method: "PUT",
                    credentials: "include",
                    headers: isFormData ? undefined : { "Content-Type": "application/json" },
                    body: isFormData ? data : JSON.stringify(data),
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
    }, []);

    const doDELETE = useCallback(async (url: string): Promise<Response | Error> => {
        let maxRetries = 3;
        while (maxRetries > 0) {
            try {
                const response = await fetch(`${API_URL}${url}`, {
                    method: "DELETE",
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
    }, []);

    return { doGET, doPOST, doPUT, doDELETE };
}
