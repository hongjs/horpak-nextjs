import { GetStaticProps, GetStaticPaths } from 'next';
import { Box, Typography } from '@mui/material';
import BranchDetail from 'components/branch/BranchDetail';
import { getIds } from 'lib/mongoUtil';

type PageProps = {
  id: string;
};

const EditBranch: React.FC<PageProps> = ({ id }) => {
  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Edit branch
      </Typography>
      <BranchDetail id={id} />
    </Box>
  );
};

export const getStaticPaths: GetStaticPaths = async () => {
  const ids = await getIds('branches');
  const paths = ids.map((id) => {
    return { params: { id: id.toString() } };
  });
  return { paths, fallback: 'blocking' };
};

export const getStaticProps: GetStaticProps<{ id: string }> = async (
  context
) => {
  const id = context.params?.id as string;

  return {
    props: { id },
  };
};

export default EditBranch;
