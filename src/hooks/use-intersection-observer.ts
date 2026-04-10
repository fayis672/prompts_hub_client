import { useEffect, useRef, useState, useCallback } from "react";

interface UseIntersectionObserverProps extends IntersectionObserverInit {
    freezeOnceVisible?: boolean;
}

export function useIntersectionObserver({
    threshold = 0,
    root = null,
    rootMargin = "0%",
    freezeOnceVisible = false,
}: UseIntersectionObserverProps = {}) {
    const [entry, setEntry] = useState<IntersectionObserverEntry>();
    const nodeRef = useRef<HTMLElement | null>(null);

    const updateEntry = ([entry]: IntersectionObserverEntry[]): void => {
        setEntry(entry);
    };

    useEffect(() => {
        const node = nodeRef.current;
        const hasIOSupport = !!window.IntersectionObserver;

        if (!hasIOSupport || !node || (freezeOnceVisible && entry?.isIntersecting)) return;

        const observerParams = { threshold, root, rootMargin };
        const observer = new IntersectionObserver(updateEntry, observerParams);

        observer.observe(node);

        return () => observer.disconnect();
    }, [threshold, root, rootMargin, freezeOnceVisible, entry?.isIntersecting]);

    return { ref: nodeRef, entry };
}
