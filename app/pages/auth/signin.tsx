import React, { useCallback } from "react";
import type { GetServerSideProps } from "next";
import { getProviders, getSession, signIn } from "next-auth/react";
import { Box, Button, Card, Divider, Stack, Typography } from "@mui/material";
import { Turnstile } from "@marsidev/react-turnstile";
import { SignInProps } from "types/auth";
import constants from "config/constants";
import { useTurnstile } from "hooks";
import FlowFieldBackground from "components/auth/FlowFieldBackground";
import styles from "./signin.module.css";

const SignIn: React.FC<SignInProps> = ({ providers }) => {
  const { valid, validateToken, failure } = useTurnstile();

  const handleSignin = useCallback(() => {
    if (valid) {
      signIn("google");
    }
  }, [valid]);

  const handleTurnstileSuccess = (token: string) => {
    validateToken(token);
  };

  const handleTurnstileFail = () => {
    failure();
  };

  return (
    <Box className={styles.splitContainer}>
      {/* Left Section - Branding */}
      <Box className={styles.leftSection}>
        <Box className={styles.brandingContent}>
          <Box className={styles.illustrationContainer}>
            <Box
              sx={{
                width: 420,
                height: 420,
                maxWidth: "100%",
                position: "relative",
              }}
            >
              <FlowFieldBackground />
            </Box>
          </Box>
          <Typography variant="h3" className={styles.brandTitle}>
            Hong.JS
          </Typography>
          <Typography variant="body1" className={styles.brandSubtitle}>
            Your next-generation application platform
          </Typography>
        </Box>
      </Box>

      {/* Right Section - Sign In Form */}
      <Box className={styles.rightSection}>
        <Box className={styles.formContainer}>
          <Stack spacing={3}>
            {/* Header */}
            <Box>
              <Typography variant="h4" className={styles.formTitle}>
                Sign in to Hong.JS
              </Typography>
              <Typography variant="body2" className={styles.formSubtitle}>
                Enter your details below
              </Typography>
            </Box>

            {/* Social Login Buttons */}
            <Stack spacing={2}>
              <Button
                variant="outlined"
                size="large"
                startIcon={<i className="fa-brands fa-google" />}
                className={`${styles.socialButton} ${styles.googleButton}`}
                onClick={handleSignin}
                disabled={!valid}
              >
                Continue with Google
              </Button>
              <Button
                disabled
                variant="outlined"
                size="large"
                startIcon={<i className="fa-brands fa-facebook" />}
                className={styles.socialButton}
              >
                Continue with Facebook
              </Button>
            </Stack>

            <Divider>
              <Typography variant="body2" sx={{ color: "text.secondary" }}>
                OR
              </Typography>
            </Divider>

            {/* Turnstile */}
            <Box className={styles.turnstileContainer}>
              <Turnstile
                options={{
                  theme: "light",
                  size: "normal",
                }}
                siteKey={constants.TURNSTILE_PUBLIC_KEY}
                onError={handleTurnstileFail}
                onExpire={handleTurnstileFail}
                onSuccess={handleTurnstileSuccess}
              />
            </Box>

            {/* Footer Text */}
            <Typography variant="body2" className={styles.footerText}>
              Powered by HongJS • sompote.r@gmail.com
            </Typography>
          </Stack>
        </Box>
      </Box>
    </Box>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { req, res } = context;
  const providers = await getProviders();
  const session = await getSession({ req });
  if (session && res) {
    res.statusCode = 302;
    res.setHeader("Location", "/");
    return { props: { session, providers } };
  }
  return {
    props: { providers },
  };
};

export default SignIn;
