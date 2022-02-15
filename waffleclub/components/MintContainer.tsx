import {useEffect, useMemo, useState} from "react";

import {Container, Snackbar} from "@material-ui/core";
import Paper from "@material-ui/core/Paper";
import Countdown from "react-countdown";
import Alert from "@material-ui/lab/Alert";
import * as anchor from "@project-serum/anchor";
import {PublicKey} from "@solana/web3.js";
import {GatewayProvider} from "@civic/solana-gateway-react";
import {useWallet} from "@solana/wallet-adapter-react";

import useWalletBalance from "../hooks/useWalletBalance";
import useSplToken from "../hooks/useSplToken";
import ReactCountdown from "./ReactCountdown";
import {AlertState, toDate} from "../helpers/utils";
import {
  awaitTransactionSignatureConfirmation,
  CANDY_MACHINE_PROGRAM,
  CandyMachineAccount,
  getCandyMachineState,
  mintOneToken,
} from "../helpers/candy-machine";
import {MintButton} from "./MintButton";
import {PhaseHeader} from "./PhaseHeader";
import {YellowCream} from "../consts";
import {Progress} from "./Progress";

export interface HomeProps {
  candyMachineId?: anchor.web3.PublicKey;
  connection: anchor.web3.Connection;
  startDate: number;
  txTimeout: number;
  rpcHost: string;
}

const MintContainer = (props: HomeProps) => {
  // const [balance, setYourSOLBalance] = useState<number | null>(null);
  const rpcUrl = props.rpcHost;
  const [isMinting, setIsMinting] = useState(false); // true when user got to press MINT
  const [itemsAvailable, setItemsAvailable] = useState(0);
  const [itemsRedeemed, setItemsRedeemed] = useState(0);
  const [itemsRemaining, setItemsRemaining] = useState(0);
  const wallet = useWallet();
  const [candyMachine, setCandyMachine] = useState<CandyMachineAccount>();
  const [isLoading, isSPLExists] = useSplToken();
  // const [refresh, setRefresh] = useState(false);
  const balance = useWalletBalance();
  const anchorWallet = useMemo(() => {
    if (
      !wallet ||
      !wallet.publicKey ||
      !wallet.signAllTransactions ||
      !wallet.signTransaction
    ) {
      return;
    }

    return {
      publicKey: wallet.publicKey,
      signAllTransactions: wallet.signAllTransactions,
      signTransaction: wallet.signTransaction,
    } as anchor.Wallet;
  }, [wallet]);

  const [alertState, setAlertState] = useState<AlertState>({
    open: false,
    message: "",
    severity: undefined,
  });


  const onMint = async () => {
    try {
      setIsMinting(true);
      document.getElementById("#identity")?.click();
      if (wallet.connected && candyMachine?.program && wallet.publicKey) {
        const mintTxId = (await mintOneToken(candyMachine, wallet.publicKey))[0];

        let status: any = {err: true};
        if (mintTxId) {
          status = await awaitTransactionSignatureConfirmation(
            mintTxId,
            props.txTimeout,
            props.connection,
            "singleGossip",
            true
          );
        }

        if (!status?.err) {
          setAlertState({
            open: true,
            message: "Congratulations! Mint succeeded!",
            severity: "success",
          });
        } else {
          setAlertState({
            open: true,
            message: "Mint failed! Please try again!",
            severity: "error",
          });
        }
      }
    } catch (error: any) {
      console.log("err ", error);
      // TODO: blech:
      let message = error.msg || "Minting failed! Please try again!";
      if (!error.msg) {
        if (!error.message) {
          message = "Transaction Timeout! Please try again.";
        } else if (error.message.indexOf("0x138")) {
        } else if (error.message.indexOf("0x137")) {
          message = `SOLD OUT!`;
        } else if (error.message.indexOf("0x135")) {
          message = `Insufficient funds to mint. Please fund your wallet.`;
        }
      } else {
        if (error.code === 311) {
          message = `SOLD OUT!`;
          window.location.reload();
        } else if (error.code === 312) {
          message = `Minting period hasn't started yet.`;
        }
      }

      setAlertState({
        open: true,
        message,
        severity: "error",
      });
    } finally {
      setIsMinting(false);
    }
  };


  useEffect(() => {
    (async () => {
      if (!anchorWallet) {
        return;
      }

      // const balance = await props.connection.getBalance(anchorWallet.publicKey);
      // setYourSOLBalance(balance);


      if (props.candyMachineId) {
        try {
          const cndy = await getCandyMachineState(
            anchorWallet,
            props.candyMachineId,
            props.connection
          )
          // setItemsAvailable(test);
          const itemsAvailable = await cndy.state.itemsAvailable
          const itemsRedeemed = await cndy.state.itemsRedeemed
          const itemsRemaining = await cndy.state.itemsRemaining
          // console.log(cndy)
          setCandyMachine(cndy);
          setItemsAvailable(itemsAvailable);
          setItemsRemaining(itemsRemaining);
          setItemsRedeemed(itemsRedeemed);
        } catch (e) {
          console.log("Problem getting candy machine state");
          console.log(e);
        }
      } else {
        console.log("No candy machine detected in configuration.");
      }
    })();
  }, [anchorWallet, props.candyMachineId, props.connection]);

  const renderer = ({
                      days,
                      hours,
                      minutes,
                      seconds,
                      completed,
                    }: {
    days: any;
    hours: any;
    minutes: any;
    seconds: any;
    completed: any;
  }) => {
    if (completed) {
      return (
        <div className="flex flex-col mt-32 justify-center" style={{color: YellowCream}}>
          <Container maxWidth="sm" style={{position: "relative"}}>
            <Paper
              style={{
                padding: 24,
                backgroundColor: "#B8202E",
                borderRadius: 6,
              }}
            >
              <div className="justify-center">
                <img
                  style={{width: '100%'}}
                  src="/avatar_1.png"
                  className="justify-center"
                />
              </div>

              <div>
                <PhaseHeader
                  candyMachine={candyMachine}
                  rpcUrl={rpcUrl}
                  whiteList={isSPLExists}
                />

                <>
                  {candyMachine?.state.isActive &&
                  candyMachine?.state.gatekeeper &&
                  wallet.publicKey &&
                  wallet.signTransaction ? (
                    <GatewayProvider
                      wallet={{
                        publicKey:
                          wallet.publicKey ||
                          new PublicKey(CANDY_MACHINE_PROGRAM),
                        //@ts-ignore
                        signTransaction: wallet.signTransaction,
                      }}
                      // // Replace with following when added
                      // gatekeeperNetwork={candyMachine.state.gatekeeper_network}
                      gatekeeperNetwork={
                        candyMachine?.state?.gatekeeper?.gatekeeperNetwork
                      } // This is the ignite (captcha) network
                      /// Don't need this for mainnet
                      clusterUrl={rpcUrl}
                      options={{autoShowModal: false}}
                    >
                      <MintButton
                        candyMachine={candyMachine}
                        isMinting={isMinting}
                        onMint={onMint}
                      />
                    </GatewayProvider>
                  ) : (
                    <MintButton
                      candyMachine={candyMachine}
                      isMinting={isMinting}
                      onMint={onMint}
                    />
                  )}
                </>
                <Progress max={itemsAvailable}  value={itemsRemaining}/>
                {wallet.connected && <p> Balance : {balance || 0}SOL</p>}
                {wallet.connected && <p>Total Available: {itemsAvailable}</p>}
                {wallet.connected && <p>Redeemed: {itemsRedeemed}</p>}
                {wallet.connected && <p>Remaining: {itemsRemaining}</p>}
              </div>
            </Paper>
          </Container>
        </div>
      );
    } else {
      return (
        <ReactCountdown
          days={days}
          minutes={minutes}
          hours={hours}
          seconds={seconds}
        />
      );
    }
  };

  const candyMachineGoLive = toDate(candyMachine?.state.goLiveDate)?.getTime();

  return (
    <div className="bg-container">
      <Container style={{marginTop: 100}}>
        {candyMachineGoLive && wallet.connected && (
          <Countdown
            date={isSPLExists ? 1640199600000 : candyMachineGoLive}
            renderer={renderer}
          />
        )}
        {!candyMachine && wallet.connected && (
          <div className="text-white text-center mt-36 mb-6 text-2xl">
            Loading
          </div>
        )}
        {!wallet.connected && (
          <div className="text-white font-sans text-center text-4xl mt-36">
            Connect Wallet <br/> To Initiate Countdown
          </div>
        )}
        <Snackbar
          open={alertState.open}
          autoHideDuration={6000}
          onClose={() => setAlertState({...alertState, open: false})}
        >
          <Alert
            onClose={() => setAlertState({...alertState, open: false})}
            severity={alertState.severity}
          >
            {alertState.message}
          </Alert>
        </Snackbar>
      </Container>
    </div>
  );
};

export default MintContainer;
