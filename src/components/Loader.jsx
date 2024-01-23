import { Progress } from "@chakra-ui/react";
import React from 'react';

const Loader = () => {
  return (
    <Progress margin={10} colorScheme="gray" size="xs" isIndeterminate />
  );
};

export default Loader;
