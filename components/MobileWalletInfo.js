import React from 'react';

import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';

import {
    useWeb3React,
} from "@web3-react/core";


const useStyles = makeStyles((theme) => ({
    mobileContainer: {
        display: 'flex',
        [theme.breakpoints.up('md')]: {
            display: 'none',
        },
        justifyContent: 'space-evenly'
    },
}));

export default function MobileWalletInfo({ goatBalance, ButtBalance, exchangeRate }) {

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
        <Box className={classes.mobileContainer}>
            <Box textAlign='center'>
                <Typography color="primary" variant="body2">GOAT in wallet</Typography>
                {
                    account === undefined
                        ?
                        <Typography color="textPrimary" variant="caption" style={{ paddingTop: '10px' }}>{'...'}</Typography>
                        :
                        account === null
                            ?
                            <Typography color="textPrimary" variant="caption" style={{ paddingTop: '10px' }}>{None}</Typography>
                            :
                            <Box>
                                <Typography color="textPrimary" variant="caption" style={{ paddingTop: '10px' }}>{`${parseFloat(goatBalance).toFixed(4)} GOAT`}</Typography>
                            </Box>
                }
            </Box>
            <Box textAlign='center'>
                <Typography color="primary" variant="body2">BUTT in wallet</Typography>
                {
                    account === undefined
                        ?
                        <Typography color="textPrimary" variant="caption" style={{ paddingTop: '10px' }}>{'...'}</Typography>
                        :
                        account === null
                            ?
                            <Typography color="textPrimary" variant="caption" style={{ paddingTop: '10px' }}>{None}</Typography>
                            :
                            <Box>
                                <Typography color="textPrimary" variant="caption" style={{ paddingTop: '10px' }}>{`${parseFloat(ButtBalance).toFixed(4)} BUTT`}</Typography>
                            </Box>
                }
            </Box>
            <Box textAlign='center'>
                <Typography color="primary" variant="body2">Exchange rate</Typography>
                {
                    <Box>
                        <Typography color="textPrimary" variant="caption" style={{ paddingTop: '10px' }}>{`1mil $BUTT`}</Typography>
                        <br />
                        <Typography color="textPrimary" variant="caption" style={{ paddingTop: '2px' }}>{`1 $GOAT`}</Typography>
                    </Box>
                }
            </Box>
        </Box>
    );
};
