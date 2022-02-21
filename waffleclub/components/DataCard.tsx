import Image from "next/image";
import Chantilly from "../public/chantilly.png";
import Eggs from "../public/ingredients/Eggs.png";
import Butter from "../public/ingredients/Butter.png";
import Milk from "../public/ingredients/Milk.png";
import Water from "../public/ingredients/Water.png";
import Flour from "../public/ingredients/Flour.png";
import Yeast from "../public/ingredients/Yeast.png";
import styled from "styled-components";
import {useMemo} from "react";

const StyledDataCard = styled.div`
  display: grid;
  grid-template-columns: auto auto;
  align-items: center;
  justify-content: center;
  gap: 10px;
  margin-top: 3rem;

  div {
    grid-column: 1 / span 2;
    width: 110px;
    margin: auto;
  }
`;
export const DataCard = ({label, value}: { label: string; value: string; }) => {
  const icon = useMemo(() => {
    switch (label) {
      case 'Waffles':
        return Eggs;
      case 'Available':
        return Water;
      case 'Milk':
        return Milk;
      case 'Solana':
        return Butter;
      case 'Mint Date':
        return Flour;
      case 'Unique Traits':
        return Yeast;
      default:
        return Chantilly;
    }
  }, [label])
  return <StyledDataCard>
    <div>
      <Image src={icon} alt=""/>

    </div>
    <b>{value}</b>
    <span>{label}</span>
  </StyledDataCard>;
}
