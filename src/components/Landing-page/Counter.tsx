import { useEffect, useRef, useState } from "react";
import { useMotionValue, useSpring, animate } from "framer-motion";

interface CounterProps {
    value: number;
    restartTrigger: number;
    className?: string;
}

export default function Counter({
    value,
    restartTrigger,
    className,
}: CounterProps) {
    const ref = useRef<HTMLSpanElement>(null);
    const [key, setKey] = useState(0); // Key to force complete component reset
    
    useEffect(() => {
        // Force a complete reset of the component
        setKey(prev => prev + 1);
        
        if (ref.current) {
            // First set to 0
            ref.current.textContent = "0";
            
            // Then start animation after a brief delay
            const timer = setTimeout(() => {
                let startValue = 0;
                animate(startValue, value, {
                    duration: 3,
                    onUpdate: (latest) => {
                        if (ref.current) {
                            ref.current.textContent = Math.round(latest).toLocaleString();
                        }
                    },
                });
            }, 50);

            return () => clearTimeout(timer);
        }
    }, [restartTrigger, value]);

    return <span key={key} ref={ref} className={className}>0</span>;
}