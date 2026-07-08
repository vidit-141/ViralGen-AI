import { useState, useEffect, useRef } from "react";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export type JobStatus = "idle" | "PENDING" | "STARTED" | "SUCCESS" | "FAILURE";

export interface JobState {
  status: JobStatus;
  progress: number;
  message: string;
  result: any | null;
  error: string | null;
}

export function useJobPoller() {
  const [jobState, setJobState] = useState<JobState>({
    status: "idle",
    progress: 0,
    message: "",
    result: null,
    error: null,
  });

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const jobIdRef = useRef<string | null>(null);

  const stopPolling = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const startPolling = (jobId: string) => {
    jobIdRef.current = jobId;
    stopPolling();

    setJobState({
      status: "PENDING",
      progress: 0,
      message: "Queued...",
      result: null,
      error: null,
    });

    intervalRef.current = setInterval(async () => {
      try {
        const res = await fetch(`${API_BASE}/task/${jobId}/status`);
        const data = await res.json();

        if (data.status === "SUCCESS") {
          stopPolling();
          setJobState({
            status: "SUCCESS",
            progress: 100,
            message: "Asset ready",
            result: data.result,
            error: null,
          });
        } else if (data.status === "FAILURE") {
          stopPolling();
          setJobState({
            status: "FAILURE",
            progress: 0,
            message: "Generation failed",
            result: null,
            error: data.error || "Unknown error",
          });
        } else {
          setJobState({
            status: data.status,
            progress: data.progress || 0,
            message: data.message || "Processing...",
            result: null,
            error: null,
          });
        }
      } catch {
        stopPolling();
        setJobState((prev) => ({
          ...prev,
          status: "FAILURE",
          message: "Lost connection to server",
          error: "Network error",
        }));
      }
    }, 2000);
  };

  useEffect(() => {
    return () => stopPolling();
  }, []);

  const reset = () => {
    stopPolling();
    setJobState({
      status: "idle",
      progress: 0,
      message: "",
      result: null,
      error: null,
    });
  };

  return { jobState, startPolling, reset };
}