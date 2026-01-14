import React, { Component, ErrorInfo } from "react";
import { MoodBad as MoodBadIcon } from "@mui/icons-material";
import { Typography } from "@mui/material";
import { Props } from "types";

interface State {
  hasError: boolean;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(_: Error): State {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="flex items-center justify-center text-center h-[80vh] gap-6">
          <div className="w-full">
            <MoodBadIcon className="text-6xl text-gray-400" />
            <Typography variant="h4" className="mb-4">
              Oops! Something went wrong.
            </Typography>
            <div className="mt-4">
              <Typography>{JSON.stringify(this.state)}</Typography>
            </div>
            <div className="mt-4">
              <Typography variant="h6">
                For more information please contact sompote.r@gmail.com
              </Typography>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
