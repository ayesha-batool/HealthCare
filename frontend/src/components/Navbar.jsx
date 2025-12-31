import { Button, Container, Flex, HStack, Text, useColorMode } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { CalendarIcon } from "@chakra-ui/icons";
import { IoMoon } from "react-icons/io5";
import { LuSun } from "react-icons/lu";

const Navbar = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  return (
    <Container maxW="1140px" px={4}>
      <Flex h={16} alignItems="center" justifyContent="space-between" flexDir={{ base: "column", sm: "row" }} py={{ base: 4, sm: 0 }}>
        <Text fontSize={{ base: "xl", sm: "2xl" }} bgGradient="linear(to-r,cyan.400,blue.500)" bgClip="text" fontWeight="bold">
          <Link to="/">🏥 Healthcare</Link>
        </Text>
        <HStack spacing={2}>
          <Link to="/book"><Button colorScheme="blue" leftIcon={<CalendarIcon />} size="sm">Book</Button></Link>
          <Link to="/providers"><Button variant="outline" colorScheme="blue" size="sm">Providers</Button></Link>
          <Button onClick={toggleColorMode} variant="ghost" size="sm">{colorMode === "light" ? <IoMoon /> : <LuSun />}</Button>
        </HStack>
      </Flex>
    </Container>
  );
};

export default Navbar;
