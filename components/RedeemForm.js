import React from 'react';
import { ethers } from 'ethers'
import { debounce } from 'lodash';

import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';
import InputAdornment from '@material-ui/core/InputAdornment';
import TextField from '@material-ui/core/TextField';

import {
    useWeb3React,
    UnsupportedChainIdError
} from "@web3-react/core";

import BUTT_ABI from '../lib/contract/abi.json';
import GOAT_ABI from '../lib/contract/GOATAbi.json';

import RedeemButton from '../components/RedeemButton';

const useStyles = makeStyles((theme) => ({
    redeemForm: {
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

export default function RedeemForm() {
    const classes = useStyles();

    const [ButtContract, setButterContract] = React.useState();
    const [goatContract, setGoatContract] = React.useState();
    const [inputButter, setInputButter] = React.useState();
    const [ButtBalance, setButterBalance] = React.useState('0');
    const [goatOutput, setGoatOutput] = React.useState(0);

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
        const getButterValues = async () => {
            const newButterContract = new ethers.Contract('0x552C821D245f6b73f7b50516Af95C20F83118e5A', BUTT_ABI, library.getSigner());
            const latestButterBalance = await newButterContract.balanceOf(account);
            const formattedButterBalance = ethers.utils.formatUnits(latestButterBalance, 12);
            setButterBalance(formattedButterBalance);
            setButterContract(newButterContract);
        }

        const getGoatContract = async () => {
            const newGoatContract = new ethers.Contract('0x7c67DCCb04b67d4666fd97B2a00bb6D9B8D82E3F', GOAT_ABI, library.getSigner());
            setGoatContract(newGoatContract);
        }

        if (library) {
            getButterValues();
            getGoatContract();
        }

    }, [library, chainId]);

    const getGoatRedeemOutput = async (input) => {
        //const redeemOutput = input / 1000000;
        //console.log(redeemOutput);
        //setGoatOutput(redeemOutput);
        setGoatOutput(ethers.utils.formatUnits(input, 18));
    }

    const handleInputChange = (inputValue) => {
        if (inputValue === '' || inputValue === undefined) {
            setGoatOutput(0);
        }
        else {
            const inputButter = ethers.utils.parseUnits(inputValue, 12);
            getGoatRedeemOutput(inputButter);
        }
    }

    const calculateGoatRedeemOutput = debounce((inputValue) => handleInputChange(inputValue), 500);


    return (
        <form className={classes.redeemForm} noValidate autoComplete="off">
            <TextField
                id="redeem-amount-input"
                className={classes.inputField}
                label="Amount of BUTT to redeem from"
                variant="outlined"
                color="primary"
                value={inputButter}
                onChange={(e) => {
                    setInputButter(e.target.value);
                    calculateGoatRedeemOutput(e.target.value);
                }}
                type="number"
                disabled={
                    (account === undefined || account === null)
                }
                InputLabelProps={{ shrink: true }}
                inputProps={{
                    min: 0,
                }}
                InputProps={{
                    endAdornment: <InputAdornment position="start">
                        <Button
                            disabled={
                                (account === undefined || account === null || parseFloat(ButtBalance) === 0)
                            }
                            onClick={() => {
                                setInputButter(ButtBalance);
                                calculateGoatRedeemOutput(ButtBalance);
                            }}>
                            Max
                            </Button>
                        <Typography>BUTT</Typography>
                    </InputAdornment>,
                }} />
            <ArrowDownwardIcon color="primary" style={{ fontSize: 70, marginTop: '5px', marginBottom: '5px' }} />
            <TextField
                id="goat-amount-ouput"
                className={classes.inputField}
                label="Receive"
                variant="outlined"
                value={goatOutput}
                color="primary"
                InputProps={{
                    readOnly: true,
                    endAdornment: <InputAdornment position="start"><Typography>GOAT</Typography></InputAdornment>,
                }}
            />
            <RedeemButton ButtContract={ButtContract} goatContract={goatContract} inputButter={inputButter} />
        </form>
    );
};
