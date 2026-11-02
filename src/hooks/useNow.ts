import { useEffect, useState } from "react";

/** Re-renders on an interval so countdowns tick. */
const useNow = (ms = 250) => {
    const [now, setNow] = useState(Date.now);
    useEffect(() => {
        const id = setInterval(() => setNow(Date.now()), ms);
        return () => clearInterval(id);
    }, [ms]);
    return now;
};

export default useNow;
