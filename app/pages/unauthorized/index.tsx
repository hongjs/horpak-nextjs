import type { GetServerSideProps } from "next";
import Image from "next/image";
import { signOut, getSession } from "next-auth/react";
import { Box, Button, Grid, Typography } from "@mui/material";
import styles from "styles/Home.module.css";
import React from "react";

type Props = {
  user: any;
};

const Unauthorized: React.FC<Props> = ({ user }) => {
  return (
    <>
      <main>
        <Box className={styles.container}>
          <Box className={styles.main}>
            <Grid container>
              <Grid size={{ xs: 12 }}>
                <Box sx={{ textAlign: "center" }}>
                  <Typography variant="h3" gutterBottom>
                    Unauthorized
                  </Typography>
                </Box>
              </Grid>
              {user && (
                <Grid size={{ xs: 12 }}>
                  <Box sx={{ textAlign: "center" }}>
                    <Image
                      src={user.image || ""}
                      alt={"user-pic"}
                      width={50}
                      height={50}
                    />
                    <Typography gutterBottom>{user.name}</Typography>
                    <Button
                      variant="contained"
                      onClick={async () => {
                        const data = await signOut({
                          redirect: true,
                          callbackUrl: "/auth/signin",
                        });
                      }}
                    >
                      Sign out
                    </Button>
                  </Box>
                </Grid>
              )}
            </Grid>
          </Box>
        </Box>
      </main>
      <footer className={styles.footer}>
        <p>
          Powered by HongJS
          <br />
          sompote.r@gmail.com
        </p>
      </footer>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);
  if (session && session.user) {
    return { props: { user: session.user } };
  }
  return { props: { user: null } };
};

export default Unauthorized;
