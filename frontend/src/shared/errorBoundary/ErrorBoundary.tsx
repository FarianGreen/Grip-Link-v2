import React, { ReactNode } from "react";
import ErrorIndicator from "./errorIndicator";

interface Props {
  children: ReactNode;
}

class ErrorBoundry extends React.Component<Props> {
  state = {
    hasError: false,
  };

  componentDidCatch() {
    this.setState({ hasError: true });
  }

  render() {
    if (this.state.hasError) {
      return <ErrorIndicator />;
    }

    return this.props.children;
  }
}

export default ErrorBoundry;
