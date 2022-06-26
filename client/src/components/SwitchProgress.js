import { indigo } from '@mui/material/colors';
import CircularProgress from '@mui/material/CircularProgress';

const SwitchProgress = () => {
    return (
        <CircularProgress
            size={30}
            sx={{
                color: indigo[500],
                position: 'absolute',
                top: '50%',
                left: '50%',
                marginTop: '-15px',
                marginLeft: '-15px',
            }}
        />
    )
}

export default SwitchProgress