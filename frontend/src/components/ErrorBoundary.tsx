import React, { PropsWithChildren } from "react";
import "@welliver-me/frontend/style/ErrorBoundary.scss";

type ErrorBoundaryProps = PropsWithChildren<{}>;
interface ErrorBroundaryState {
  error: string | null;
}

export default class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBroundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { error: null };
  }

  componentDidCatch() {
    this.setState({ error: "Error loading links." });
  }

  _handleUnhandledRejection = () => {
    this.setState({ error: "Error loading links." });
  };

  componentDidMount() {
    window.addEventListener(
      "unhandledrejection",
      this._handleUnhandledRejection
    );
  }

  componentWillUnmount() {
    window.removeEventListener(
      "unhandledrejection",
      this._handleUnhandledRejection
    );
  }

  render() {
    const { error } = this.state;
    return (
      <>
        <ErrorDisplay error={error} />
        {this.props.children}
      </>
    );
  }
}

function ErrorDisplay({ error }: { error: string | null }) {
  if (!error) return null;

  return (
    <div className="error-container">
      <span className="error-header">&#x2620;</span>
      <span className="error-msg">{error}</span>
      <span className="error-msg">Try reloading the page.</span>
    </div>
  );
}
