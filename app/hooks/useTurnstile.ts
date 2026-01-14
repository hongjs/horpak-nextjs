import { useCallback, useState } from "react";
import axios from "axios";

const useUser = () => {
  const [valid, setValid] = useState(false);

  const handleValidateToken = useCallback(async (token: string) => {
    const res = await axios.post("/api/turnstile/validate", { token });
    setValid(res.data.success);
  }, []);

  const handleFailure = useCallback(() => {
    setValid(false);
  }, []);

  return { valid, validateToken: handleValidateToken, failure: handleFailure };
};

export default useUser;
