import React from 'react';
import { ethers } from 'ethers';

import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

import Box from '@material-ui/core/Box';
import CircularProgress from '@material-ui/core/CircularProgress';

import SimpleModal from './SimpleModal'


import {
    useWeb3React,
} from "@web3-react/core";

const useStyles = makeStyles((theme) => ({
    buttonContainer: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: '2.5%',
        width: '50%'
    },
}));

export default function FormButton({ ButtContract, goatContract, inputGoat }) {
    const classes = useStyles();
    const context = useWeb3React();
    const {
        connector,
        library,
        chainId,
        account,
        activate,
        deactivate,
        active,
        error
    } = context;

    const [goatAllowanceAmount, setGoatAllowanceAmount] = React.useState('0');
    const [approvalLoading, setApprovalLoading] = React.useState(false);
    const [mintLoading, setMintLoading] = React.useState(false);
    const [errorMessage, setErrorMessage] = React.useState('');
    const [modalOpen, setModalOpen] = React.useState(false);

    React.useEffect(() => {

        const getAllowanceAmount = async () => {
            const goatAllowance = await goatContract.allowance(account, ButtContract.address);
            const formattedGoatAllowance = ethers.utils.formatUnits(goatAllowance, 18);
            setGoatAllowanceAmount(formattedGoatAllowance);
        }
        if (goatContract)
            getAllowanceAmount();

    }, [ButtContract, goatContract])

    const showError = async (message) => {
        setErrorMessage(message);
        await new Promise(r => setTimeout(r, 5000));
        setErrorMessage('');
    }

    const approveMint = async () => {
        const amountToApprove = ethers.utils.parseUnits(`1000000000000000000000000000000`, 18);
        setApprovalLoading(true);
        try {
            const approvalTx = await goatContract.approve(ButtContract.address, amountToApprove);
            await approvalTx.wait();
            getAllowanceAmount();
        } catch (error) {
            console.error(error)
        }
        setApprovalLoading(false);
    }

    const mint = async () => {
        //const inputGoatToMintWith = inputGoat * 1000000000000000000;

        const inputGoatToMintWith = ethers.utils.parseUnits(inputGoat, 18);

        console.log(inputGoatToMintWith, inputGoat);

        setMintLoading(true);
        try {
            const mintTx = await ButtContract['woof(uint256)'](inputGoatToMintWith);
            setModalOpen(true);
        } catch (error) {
            console.error(error);
            if (error.message.includes('MetaMask Tx Signature: User denied transaction signature.'))
                showError('Transaction cancelled.');
        }
        setMintLoading(false);
    }

    if (account === undefined || account === null) {
        return (
            <Box className={classes.buttonContainer} >
                <Button type="button">Connect wallet to BSC mainnet to continue</Button>
            </Box>
        );
    }

    if (!(parseFloat(inputGoat) > 0) || inputGoat === undefined || inputGoat === '') {
        return (
            <Box className={classes.buttonContainer} >
                <Button type="button">Enter an amount</Button>
            </Box>
        )
    }

    if (approvalLoading) {
        return (
            <Box className={classes.buttonContainer} >
                <Button type="button" variant="contained" color="primary" size="large">
                    <Box paddingRight={2} paddingTop={1}>
                        <CircularProgress color="#ffffff" size={20} />
                    </Box>
                    Approval loading
                </Button>
            </Box>
        )
    }

    if (parseInt(goatAllowanceAmount) === 0) {
        return (
            <Box className={classes.buttonContainer} >
            <Button type="button" variant="contained" color="primary" size="large" onClick={() => {
                approveMint();
                }}> Approve Mint</Button>
            </Box>
        )
    }

    if (mintLoading) {
        return (
            <Box className={classes.buttonContainer} >
                <Button type="button" variant="contained" color="primary" size="large" >
                    <Box paddingRight={2} paddingTop={1}>
                        <CircularProgress color="#ffffff" size={20} />
                    </Box>
                    Minting
                </Button >
            </Box>
        )
    }

    return (
        <Box className={classes.buttonContainer} >
            <Button type="button" variant="contained" color="primary" size="large" onClick={() => {
                    mint();
            }}> Mint</Button>
            {errorMessage && <Typography>{errorMessage}</Typography>}
            <SimpleModal open={modalOpen} setModalOpen={setModalOpen} heading={'Successfully minted BUTT'} bodyText={'Refresh page & check wallet balance :)'} />
        </Box>
    );
};
