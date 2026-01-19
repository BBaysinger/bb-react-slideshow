import React from "react";
import clsx from "clsx";

import styles from "./Slideshow.module.scss";

const Vignette: React.FC<{
  classPrefix: string;
}> = ({ classPrefix }) => (
  <div className={clsx(styles["vignette"], `${classPrefix}vignette`)}></div>
);

export default Vignette;
