import React from 'react';
import { ethers } from 'ethers';
import { debounce } from 'debounce';

import { makeStyles, withStyles } from '@material-ui/core/styles';

import Box from '@material-ui/core/Box'
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';
import InputAdornment from '@material-ui/core/InputAdornment';
import TextField from '@material-ui/core/TextField';
import CircularProgress from '@material-ui/core/CircularProgress';

import {
    useWeb3React,
    UnsupportedChainIdError
} from "@web3-react/core";

import BUTT_ABI from '../lib/contract/abi.json'
import GOAT_ABI from '../lib/contract/GOATAbi.json'

import MintButton from './MintButton';


const useStyles = makeStyles((theme) => ({
    mintForm: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        marginTop: '10%',
        [theme.breakpoints.up('md')]: {
            marginTop: '2.5%'
        },
    },
    inputField: {
        width: '95%',
        [theme.breakpoints.up('md')]: {
            width: '40%'
        },
    }
}));

const StyledTextField = withStyles((theme) => ({
    root: {
        '& input:valid': {
            borderColor: theme.palette.text.primary,
            borderWidth: 2,
        },
    },
}))(TextField);



export default function MintForm() {
    const classes = useStyles();

    const [goatInput, setGoatInput] = React.useState();
    const [goatBalance, setGoatBalance] = React.useState('0');
    const [ButtOutput, setButterOutput] = React.useState(0);
    const [ButtContract, setButterContract] = React.useState();
    const [goatContract, setGoatContract] = React.useState();
    const [outputEstimateLoading, setOutputEstimateLoading] = React.useState(false);

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

    React.useEffect(() => {
        const getButterContract = async () => {
            const newButterContract = new ethers.Contract('0x552C821D245f6b73f7b50516Af95C20F83118e5A', BUTT_ABI, library.getSigner());
            setButterContract(newButterContract);
        }

        const getGoatBalance = async () => {
            const goatContract = new ethers.Contract('0x7c67DCCb04b67d4666fd97B2a00bb6D9B8D82E3F', GOAT_ABI, library.getSigner());
            setGoatContract(goatContract)
            const goatBalance = await goatContract.balanceOf(account);
            const formattedGoatBalance = ethers.utils.formatUnits(goatBalance, 18);
            setGoatBalance(formattedGoatBalance);
        }

        if (library) {
            getButterContract();
            getGoatBalance();
        }

    }, [library, chainId]);

    const getButterMintOutput = (input) => {
        //let mintOutput;
        //setOutputEstimateLoading(true);
        try {
            //mintOutput = input * 1000000;
            //mintOutput = await ButtContract.getMintAmount(input);
            setButterOutput(ethers.utils.formatUnits(input, 12));
        } catch (error) {
            console.error(error);
        }
        //setOutputEstimateLoading(false);
    }

    const handleInputChange = (inputValue) => {
        if (inputValue === '' || inputValue === undefined) {
            setButterOutput(0);
        }
        else {
            const inputGoat = ethers.utils.parseUnits(inputValue, 18);
            getButterMintOutput(inputGoat);
        }
    }

    const calculateButterMintOutput = debounce((inputValue) => handleInputChange(inputValue), 500);

    return (
        <form className={classes.mintForm} noValidate autoComplete="off">
            <StyledTextField
                id="mint-amount-input"
                className={classes.inputField}
                label="Amount of GOAT to mint with"
                variant="outlined"
                color="primary"
                type="number"
                disabled={
                    (account === undefined || account === null)
                }
                value={goatInput}
                onChange={(e) => {
                    setGoatInput(e.target.value);
                    calculateButterMintOutput(e.target.value);
                }}
                InputLabelProps={{ shrink: true }}
                inputProps={{
                    min: 0,
                }}
                InputProps={{
                    endAdornment:
                        <InputAdornment position="end">
                            <Button
                                disabled={
                                    (account === undefined || account === null || parseFloat(goatBalance) === 0)
                                }
                                onClick={() => {
                                    setGoatInput(goatBalance);
                                    calculateButterMintOutput(goatBalance);
                                }}>
                                Max
                            </Button>
                            <Typography>GOAT</Typography>
                        </InputAdornment>,
                }} />
            <ArrowDownwardIcon color="primary" style={{ fontSize: 70, marginTop: '5px', marginBottom: '5px' }} />
            <StyledTextField
                id="butter-amount-output"
                className={classes.inputField}
                label="Receive"
                variant="outlined"
                color="primary"
                value={ButtOutput}
                InputProps={{
                    readOnly: true,
                    endAdornment:
                        <InputAdornment position="start">
                            {outputEstimateLoading ?
                                <Box paddingRight={5}>
                                    <CircularProgress color="primary" size={20} />
                                </Box>
                                : null}
                            <Typography>BUTT</Typography>
                        </InputAdornment>,
                }} />
            <MintButton goatContract={goatContract} ButtContract={ButtContract} inputGoat={goatInput} />
        </form>
    );
};
