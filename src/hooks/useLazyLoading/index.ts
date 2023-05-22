import { useEffect, RefObject } from "react";

export const useLazyLoading = (imgRef: RefObject<HTMLImageElement>) => {
  useEffect(() => {
    const { current: imgNode } = imgRef;
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const currentImg = entry.target as HTMLImageElement;
        const newImgSrc = currentImg.dataset.src;
        if (!newImgSrc || !imgNode) return;

        currentImg.src = newImgSrc;

        imgNode.onload = () => {
          currentImg.classList.remove("hide");
          currentImg.parentElement?.classList.remove("skeleton");
        };
      });
    });

    if (imgNode) observer.observe(imgNode);

    return () => {
      if (imgNode) observer.unobserve(imgNode);
    };
  }, [imgRef]);
};

