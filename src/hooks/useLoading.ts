import { useState } from "react";

export const useLoading = () => {
  const [loading, setLoading] = useState(false);
  return { loading, showLoader: () => setLoading(true), hideLoader: () => setLoading(false) };
};
