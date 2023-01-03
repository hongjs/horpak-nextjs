import { Box, Typography } from '@mui/material';
import BranchDetail from 'components/branch/BranchDetail';

const AddNewBranch: React.FC = () => {
  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Add new branch
      </Typography>

      <BranchDetail id={null} />
    </Box>
  );
};

export default AddNewBranch;
