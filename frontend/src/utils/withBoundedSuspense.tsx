import { JSX, Suspense } from "react";
import Loader from "../components/Loader/Loader";
import ErrorBoundry from "../shared/errorBoundary/ErrorBoundary";
import TransitionPage from "../components/PageTransition/PageTransition";

export const withBoundedSuspense = (
  Component: React.LazyExoticComponent<() => JSX.Element>
) => (
  <ErrorBoundry>
    <Suspense fallback={<Loader />}>
      <TransitionPage>
        <Component />
      </TransitionPage>
    </Suspense>
  </ErrorBoundry>
);
