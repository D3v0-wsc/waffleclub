import {JSXElementConstructor, ReactElement, ReactNodeArray} from "react";
import styled from "styled-components";
import {OffWhite} from "../consts";

export const Details = (props: { question: string; content: string | ReactElement<any, string | JSXElementConstructor<any>> | ReactNodeArray; }) => (
  <CustomDetails>
    <summary><h3 style={{display: 'inline'}}>{props.question}</h3></summary>
    <div className="details">
      {props.content}
    </div>
  </CustomDetails>
);

const CustomDetails = styled.details`
  background: ${OffWhite};
  border-radius: 20px;
  padding: 15px 15px 15px 45px;

  summary {
    h3 {
      display: inline;
    }
  }

  .details {
    margin-top: 1rem;
  }
`
