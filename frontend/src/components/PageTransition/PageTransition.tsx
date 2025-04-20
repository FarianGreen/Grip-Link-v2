import { motion } from "framer-motion";
import { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

const pageVariants = {
  initial: { opacity: 0, x: 20 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, y: -20 },
};

export default function TransitionPage({ children }: Props) {
  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageVariants}
      transition={{ duration: 0.4, ease: "easeInOut" }}
      style={{ height: "100%" }}
    >
      {children}
    </motion.div>
  );
}
