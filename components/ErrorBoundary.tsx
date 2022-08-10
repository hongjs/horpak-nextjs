import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Grid, Typography } from '@mui/material';
import { MoodBad as MoodBadIcon } from '@mui/icons-material';

interface Props {
  children?: ReactNode;
}

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
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <Grid
          spacing={3}
          container
          style={{ height: '80vh', alignItems: 'center', textAlign: 'center' }}
        >
          <Grid item xs={12}>
            <MoodBadIcon />
            <Typography variant="h4" gutterBottom>
              Oops! Something went wrong.
            </Typography>
            <Grid item xs={12}>
              <Typography>{JSON.stringify(this.state)}</Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="h6">
                For more information please contact sompote.r@gmail.com
              </Typography>
            </Grid>
          </Grid>
        </Grid>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
