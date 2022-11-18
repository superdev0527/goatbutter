import React from 'react';

import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';

import {
    useWeb3React,
} from "@web3-react/core";


const useStyles = makeStyles((theme) => ({
    desktopContainer: {
        display: 'none',
        [theme.breakpoints.up('md')]: {
            display: 'flex',
        }
    },
}));

export default function DesktopWalletInfo({ goatBalance, ButtBalance, exchangeRate }) {

    const classes = useStyles();
    const context = useWeb3React();
    const {
        library,
        chainId,
        account,
        activate,
        deactivate,
        active,
        error
    } = context;

    return (
        <Box className={classes.desktopContainer} position="absolute" top="25%" right="7.5%" display="flex" flexDirection="column" alignItems="center">
            <Typography color="primary" variant="h6">GOAT in wallet</Typography>
            {
                account === undefined
                    ?
                    <Typography color="textPrimary" variant="body2" style={{ paddingTop: '10px' }}>{'...'}</Typography>
                    :
                    account === null
                        ?
                        <Typography color="textPrimary" variant="body2" style={{ paddingTop: '10px' }}>{None}</Typography>
                        :
                        <Box textAlign='center'>
                            <Typography color="textPrimary" variant="body2" style={{ paddingTop: '10px' }}>{`${parseFloat(goatBalance).toFixed(4)} GOAT`}</Typography>
                        </Box>

            }
            <Typography color="primary" variant="h6" style={{ paddingTop: '40px' }}>BUTT in wallet</Typography>
            {
                account === undefined
                    ?
                    <Typography color="textPrimary" variant="body2" style={{ paddingTop: '10px' }}>{'...'}</Typography>
                    :
                    account === null
                        ?
                        <Typography color="textPrimary" variant="body2" style={{ paddingTop: '10px' }}>{None}</Typography>
                        :
                        <Box textAlign='center'>
                            <Typography color="textPrimary" variant="body2" style={{ paddingTop: '10px' }}>{`${parseFloat(ButtBalance).toFixed(4)} BUTT`}</Typography>
                        </Box>


            }
            <Typography color="primary" variant="h6" style={{ paddingTop: '40px' }}>Exchange rate</Typography>
            {
                <Typography color="textPrimary" variant="body2" style={{ paddingTop: '10px' }}>{`1mil $BUTT = 1 $GOAT`}</Typography>
            }
        </Box>
    );
};
