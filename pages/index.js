import React from 'react';
import { ethers } from 'ethers'
import { makeStyles, withStyles } from '@material-ui/core/styles';

import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

import {
  useWeb3React,
} from "@web3-react/core";

import BUTT_ABI from '../lib/contract/abi.json';
import GOAT_ABI from '../lib/contract/GOATAbi.json';

import MintForm from '../components/MintForm'
import RedeemForm from '../components/RedeemForm'

import DesktopWalletInfo from '../components/DesktopWalletInfo';
import MobileWalletInfo from '../components/MobileWalletInfo';


const useStyles = makeStyles((theme) => ({
  mintForm: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginTop: '5%',
  },
  inputField: {
    width: '40%',
  },
  tabs: {
    borderRight: `1px solid ${theme.palette.primary}`,
  },
  mobileTabs: {
    display: 'block',
    [theme.breakpoints.up('md')]: {
      display: 'none',
    },
  },
  desktopTabs: {
    display: 'none',
    [theme.breakpoints.up('md')]: {
      display: 'block',
    },
  }
}));

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}


const StyledTabs = withStyles({
  root: {
    '& > *': {
      justifyContent: 'center',
    },
  },
  indicator: {
    display: 'flex',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    '& > span': {
      maxWidth: 90,
      width: '100%',
      backgroundColor: '#6da8ff',
    },
  },
})((props) => <Tabs {...props} TabIndicatorProps={{ children: <span /> }} />);

const StyledTab = withStyles((theme) => ({
  root: {
    textTransform: 'none',
    color: theme.palette.text.primary,
    fontWeight: theme.typography.fontWeightRegular,
    fontSize: theme.typography.pxToRem(22),
    marginRight: theme.spacing(5),
    '&:focus': {
      opacity: 1,
    },
  },
}))((props) => <Tab disableRipple {...props} />);

function a11yProps(index) {
  return {
    id: `vertical-tab-${index}`,
    'aria-controls': `vertical-tabpanel-${index}`,
  };
}


export default function Index() {
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

  const exchangeRate = 0.0000001;

  const [ButtBalance, setButterBalance] = React.useState();
  const [goatBalance, setGoatBalance] = React.useState();

  React.useEffect(() => {
    const getButterValues = async () => {
      const ButtContract = new ethers.Contract('0x552C821D245f6b73f7b50516Af95C20F83118e5A', BUTT_ABI, library.getSigner());
      const ButtBalance = await ButtContract.balanceOf(account);
      const formattedButterBalance = ethers.utils.formatUnits(ButtBalance, 12)
      setButterBalance(formattedButterBalance);
    }

    const getGoatBalance = async () => {
      const goatContract = new ethers.Contract('0x7c67DCCb04b67d4666fd97B2a00bb6D9B8D82E3F', GOAT_ABI, library.getSigner());
      const goatBalance = await goatContract.balanceOf(account);
      const formattedGoatBalance = ethers.utils.formatUnits(goatBalance, 18);
      setGoatBalance(formattedGoatBalance);
    }

    if (library) {
      getButterValues();
      getGoatBalance();
    }
  }, [library, chainId]);


  const classes = useStyles();
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };


  return (
    <Box>
      <DesktopWalletInfo goatBalance={goatBalance} ButtBalance={ButtBalance} exchangeRate={exchangeRate} />
      <Box marginY={3} className={classes.desktopTabs}>
        <StyledTabs centered="true" value={value} onChange={handleChange} aria-label="Navigation tabs">
          <StyledTab label="Mint BUTT" />
          <StyledTab label="Redeem GOAT" />
        </StyledTabs>
        <Typography className={classes.padding} />
      </Box>
      <Box marginY={1} className={classes.mobileTabs}>
        <Tabs
          orientation="vertical"
          value={value}
          onChange={handleChange}
          aria-label="Navigation tabs"
          indicatorColor="primary"
          className={classes.tabs}
          textColor="primary"
          variant="fullWidth"
        >
          <Tab label="Mint BUTT" disableRipple {...a11yProps(0)} />
          <Tab label="Redeem GOAT" disableRipple {...a11yProps(1)} />
        </Tabs>
      </Box>
      <MobileWalletInfo goatBalance={goatBalance} ButtBalance={ButtBalance} exchangeRate={exchangeRate} />

      <TabPanel value={value} index={0}>
        <MintForm />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <RedeemForm />
      </TabPanel>
    </Box>
  );
}
