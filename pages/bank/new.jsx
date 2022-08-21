import { Box, Typography } from '@mui/material';
import BankDetail from 'components/bank/BankDetail';

const AddNewBank = () => {
  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Add new bank account
      </Typography>
      <BankDetail id={null} />;
    </Box>
  );
};

export default AddNewBank;
