import React from "react";
import { Flex, Box, Text } from 'rimble-ui';
import { Link } from "react-router-dom";
import { EthereumComponent } from '../EthereumComponent';
import { AvatarList, AvatarListData } from "../AvatarList";
import {
  Card,
  CardHeader,
  CardTitle,
  CardImg,
  CardBody,
  CardFooter,
  Button,
  Progress
} from "shards-react";
import { string, number } from "prop-types";
import { UserData } from "./UserProfile";
import { LoanMetadata, TokenMetadata, UserMetadata, database } from '../../data/database';

enum VerifiedIdTypes {
  'BLOOM',
  '3BOX'
}

var LoanRequest = require("../../contractabi/LoanRequest.json");
var LoanRequestFactory = require("../../contractabi/LoanRequestFactory.json");
var UserStaking = require("../../contractabi/UserStaking.json");

interface RepaymentData {
  days: number;
  date: Date;
  principalDue: number;
  loanBalance: number;
  interest: number;
  fees: number;
  penalties: number;
  due: number;
}

interface StakerMetadata {
  img: string;
  name: string;
  relationship: string;
  verifiedIds: VerifiedIdTypes[];
}

interface ContributerMetadata {
  img: string;
  text: string;
}

interface LoanParams {
  principal: number;
  fundsRaised: number;
  interestRate: number;
  tenor: number;
  gracePeriod: number;
  repayments: number;
  repaymentSchedule: [];
  loanCurrency: string;
}

type MyState = {
  web3: any;
  contributors: AvatarListData[];
  loanParams: LoanParams;
  loanMetadata: LoanMetadata;
  userData: UserData;
  tokenMetadata: TokenMetadata;
  isLoaded: boolean;
};

export class Loan extends EthereumComponent {

  state: MyState

  constructor(props) {
    super(props);
    this.state = {
      contributors: [] as AvatarListData[],
      loanParams: {} as LoanParams,
      loanMetadata: {} as LoanMetadata,
      userData: {} as UserData,
      tokenMetadata: {} as TokenMetadata,
      isLoaded: false,
      web3: null
    }
  }

  // @dev Get icons and names of contributors if they have shared their data, or ethereum blockie and address if not
  async getContributors(): Promise<AvatarListData[]> {
    return [] as AvatarListData[];
  }

  async getStakers(userAddress: string): Promise<string[]> {
    return [] as string[];
  }

  /* 
    Get a list of attestations, and the relevant data for each parsed down to what we need. The user gives these to the app via bloom when they create their account, or later. We then store the attestations in our datastore and display them to the potential lenders. Some information may be kept private which the lenders and borrower can communicate directly about
  */
  async getAttestations(userAddress: string): Promise<any> {
    return {};
  }

  // @dev Web3 call to get loan parameters from chain
  async getLoanParameters(): Promise<LoanParams> {
    return {} as LoanParams;
  }

  // @dev Get loan metadata from our servers or possibly IPFS
  async getLoanMetadata(): Promise<LoanMetadata> {
    return {} as LoanMetadata;
  }

  async getTokenMetadata(tokenAddress: string): Promise<TokenMetadata> {
    console.log(database.tokens.get(tokenAddress));
    return database.tokens.get(tokenAddress);
  }

  async getUserMetadata(userId: number): Promise<UserMetadata> {
    return database.users.get(userId);
  }

  async componentDidMount() {
    //Dummy Data
    this.setState({
      contributors: [
        {
          img: "https://airswap-token-images.s3.amazonaws.com/DAI.png",
          text: "Dai"
        },
        {
          img: "https://airswap-token-images.s3.amazonaws.com/DAI.png",
          text: "USDC"
        }
      ],
      loanParams: {
        principal: 60000,
        fundsRaised: 48000,
        interestRate: 6,
        tenor: 120,
        gracePeriod: 24,
        repayments: 100,
        repaymentSchedule: [],
        loanCurrency: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48"
      },
      loanMetadata: {
        country: "Jakarta, Indonesia",
        purpose: "University",
        description: "Student loan for Masters Degree in Human Resources at Cornell University, with the intention to work in the US HR sector post-graduation.",
        userStory: "Student loan for Masters Degree in Human Resources at Cornell University, with the intention to work in the US HR sector post-graduation.",
        imgSrc: "",
      },
      userData: {
        name: "Ines",
      },
      isLoaded: true
    });

    //Contract Instances
    if(!this.state.web3) {
      //Connect ot infura - at the previous component
    }

    var MyContract = contract({
      abi: ...,
      unlinked_binary: ...,
      address: ..., // optional
      // many more
    })

    //Will get real data
    const contributors = await this.getContributors();
    const loanParams = await this.getLoanParameters();
    const tokenMetadata = await this.getTokenMetadata(this.state.loanParams.loanCurrency);

    this.setState({
      tokenMetadata: tokenMetadata
    })
  }

  render() {
    const { contributors, loanParams, loanMetadata, userData, isLoaded, tokenMetadata } = this.state;
    const percentFunded = loanParams.fundsRaised / loanParams.principal * 100;

    return (
      <div>

        // First Row
        <Flex>
          <Box p={3} width={1 / 2} color="black" bg="white">
            <Card>
              <CardBody>
                "User Image"
              </CardBody>
            </Card>
          </Box>
          <Box p={3} width={1 / 2} color="black" bg="white">
            <Card>
              <CardBody>
                <h2>{percentFunded}% Funded</h2>
                <Progress theme="primary" value={percentFunded} />
                <Text>Total Amount ${loanParams.principal}</Text>
                <Text>Powered by {contributors.length} lenders</Text>
                <h3>{userData.name}</h3>
                <Text>{loanMetadata.country} | {loanMetadata.purpose}</Text>
                <Text>"Default Amount + Call to action"</Text>
              </CardBody>
            </Card>
          </Box>
        </Flex>

        // Second Row
        <Flex>
          <Box p={3} width={1 / 2} color="black" bg="white">
            Loan Summary
          </Box>
        </Flex>

        // Third Row
        <Flex>
          <Box p={3} width={1 / 2} color="black" bg="white">
            <h3>{userData.name}'s Story</h3>

            <h3>Contributors</h3>
            <AvatarList data={contributors}></AvatarList>
          </Box>
          <Box p={3} width={1 / 2} color="black" bg="white">

            <Card>
              <CardBody>
                <h3>Loan Details</h3>
                <Text>Principal ${loanParams.principal} {tokenMetadata.name}</Text>
                <Text>Interest {loanParams.interestRate}% Effective Annual</Text>
                <Text>Tenor {loanParams.tenor / 12} Years</Text>
                <Text>Grace Period {loanParams.gracePeriod / 12} Years</Text>
                <Text>Expected Return {36}%</Text>
              </CardBody>
            </Card>
            <h3>Repayment Schedule</h3>
          </Box>
        </Flex>
      </div>
    );
  }
}