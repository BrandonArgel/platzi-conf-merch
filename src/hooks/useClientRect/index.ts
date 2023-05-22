import { useCallback, useState } from 'react';

export const useClientRect = () => {
  const [rect, setRect] = useState(null);
  const [node, setNode] = useState(null);
  const ref = useCallback((node: any) => {
    if (node !== null) {
      setNode(node);
      setRect(node.getBoundingClientRect());
    }
  }, []);
  return [rect, node, ref];
}
