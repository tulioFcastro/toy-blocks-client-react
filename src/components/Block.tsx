import React from "react";
import { Block as BlockType } from "../types/Block";
import { styled } from "@mui/material/styles";
import colors from "../constants/colors";

import { Box, Typography } from "@mui/material";
type Props = {
  block: BlockType;
};

const BoxSummaryContent = styled(Box)({
  display: "flex",
  flexDirection: "column",
  backgroundColor: "#e0e0e0",
  paddingLeft: 8,
  paddingTop: 8,
  paddingRight: 8,
  paddingBottom: 4,
  marginBottom: 4,
});

const TypographyHeading = styled(Typography)({
  fontFamily: "Roboto",
  fontStyle: "normal",
  fontWeight: "bold",
  fontSize: "10px",
  letterSpacing: "1.5px",
  textTransform: "uppercase",
  color: colors.primary,
});

const TypographySecondaryHeading = styled(Typography)({
  fontFamily: "Roboto",
  fontStyle: "normal",
  fontWeight: "normal",
  fontSize: "14px",
  lineHeight: "20px",
  letterSpacing: "0.25px",
  color: colors.text,
});

const Block: React.FC<Props> = ({ block }) => {
  function formatCount() {
    return block.attributes.index.toLocaleString("en-US", {
      minimumIntegerDigits: 3,
      useGrouping: false,
    });
  }

  return (
    <BoxSummaryContent>
      <TypographyHeading>{formatCount()}</TypographyHeading>
      <TypographySecondaryHeading>
        {block.attributes?.data}
      </TypographySecondaryHeading>
    </BoxSummaryContent>
  );
};

export default Block;
