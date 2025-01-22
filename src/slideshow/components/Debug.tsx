import React from "react";

import styles from "./Slideshow.module.scss";

const Debug: React.FC<{
  isDebug: string | number | boolean | null;
  currentIndex: number;
  previousIndex: number;
  isTransitioning: boolean;
  classPrefix: string;
}> = ({
  isDebug,
  currentIndex,
  previousIndex,
  isTransitioning,
  classPrefix,
}) => (
  <>
    {isDebug && (
      <div className={`${styles["debug"]} ${classPrefix}debug`}>
        {`curr: ${currentIndex} prev: ${previousIndex} ` +
          `transitioning: ${isTransitioning}`}
      </div>
    )}
  </>
);

export default Debug;
