import { motion } from "framer-motion";
import { ComponentType, FC } from "react";

export function withTransition<T extends object>(
  WrappedComponent: ComponentType<T>
): FC<T> {
  return (props: T) => (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      style={{ height: "100%" }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
    >
      <WrappedComponent {...props} />
    </motion.div>
  );
}
