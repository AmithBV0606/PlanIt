import { useState } from "react";
import { toast } from "sonner";

// Define the structure of form data
interface FormData {
  name: string;
  key: string;
  description?: string;
}

// Define the type for the callback function
type Callback<T> = (...args: any[]) => Promise<T>;

const useFetch = <T>(cb: Callback<T>) => {
  const [data, setData] = useState<T | undefined>(undefined);
  const [loading, setLoading] = useState<boolean | null>(null);
  const [error, setError] = useState<Error | null>(null);

  const fn = async (...args: any[]): Promise<void> => {
    setLoading(true);
    setError(null);

    try {
      const response = await cb(...args);
      setData(response);
      setError(null);
    } catch (error: any) {
      setError(error);
      toast.error(error?.message);
    } finally {
      setLoading(false);
    }
  };
  return { data, loading, error, fn, setData };
};

export default useFetch;