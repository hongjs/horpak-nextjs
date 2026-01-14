import { GetStaticProps, GetStaticPaths } from "next";
import { Box, Typography } from "@mui/material";
import BankDetail from "components/bank/BankDetail";
import { getIds } from "lib/mongoUtil";

type PageProps = {
  id: string;
};

const EditBank: React.FC<PageProps> = ({ id }) => {
  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Edit bank account
      </Typography>
      <BankDetail id={id} />
    </Box>
  );
};

export const getStaticPaths: GetStaticPaths = async () => {
  const ids = await getIds("bankAccounts");
  const paths = ids.map((id) => {
    return { params: { id: id.toString() } };
  });
  return { paths, fallback: "blocking" };
};

export const getStaticProps: GetStaticProps<{ id: string }> = async (
  context,
) => {
  const id = context.params?.id as string;

  return {
    props: { id },
  };
};

export default EditBank;
