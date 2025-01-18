import React from "react";

import styles from "./Slideshow.module.scss";

const Vignette: React.FC<{
  classPrefix: string;
}> = ({ classPrefix }) => (
  <div className={`${styles["vignette"]} ${classPrefix}vignette`}></div>
);

export default Vignette;
