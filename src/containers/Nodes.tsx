import React, { useState, useEffect } from "react";
import { Node as NodeType } from "../types/Node";
import Node from "../components/Node";
import { Typography, Box } from "@mui/material";
import { useDispatch } from "react-redux";
import { useAppSelector } from "../store/configureStore";
import { checkNodesStatus, selectNodes } from "../reducers/nodes";
import { checkBlockStatus } from "../reducers/blocks";

export const Nodes: React.FC = () => {
  const [expandedNodeURL, setExpandedNodeURL] = useState<null | string>(null);
  const dispatch = useDispatch();
  const nodes = useAppSelector(selectNodes);

  useEffect(() => {
    dispatch(checkNodesStatus(nodes));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const ToggleNodeExpanded = (node: NodeType) => {
    const isNotExpanded = node.url === expandedNodeURL;
    setExpandedNodeURL(isNotExpanded ? null : node.url);
    if (!isNotExpanded) dispatch(checkBlockStatus(node.url));
  };

  return (
    <Box paddingTop={7}>
      <Typography variant="h4" component="h1">
        <strong style={{ color: "#000" }}>Nodes</strong>
      </Typography>
      {nodes.map((node) => (
        <Node
          node={node}
          key={node.url}
          expanded={node.url === expandedNodeURL}
          toggleNodeExpanded={ToggleNodeExpanded}
        />
      ))}
    </Box>
  );
};

export default Nodes;
