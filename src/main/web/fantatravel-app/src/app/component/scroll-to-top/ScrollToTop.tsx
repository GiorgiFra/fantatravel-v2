import React, { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTopContainer = ({ children }: { children: React.ReactNode }) => {
    const location = useLocation();
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (containerRef.current) {
            containerRef.current.scrollTop = 0;
        }
    }, [location.pathname]); // esegue lo scroll ogni volta che cambia il path

    return (
        <div ref={containerRef} style={{ height: "100%", overflowY: "auto" }}>
            {children}
        </div>
    );
};

export default ScrollToTopContainer;
