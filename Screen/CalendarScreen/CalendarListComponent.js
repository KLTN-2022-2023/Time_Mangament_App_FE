import {
  Box,
  Heading,
  VStack,
  FormControl,
  Input,
  Button,
  Center,
  HStack,
  Text,
  Link,
} from "native-base";

export default () => {
  return (
    <Center w="100%">
      <Box safeArea w="100%" maxW="290">
        <Heading
          mt="1"
          color="coolGray.600"
          _dark={{
            color: "warmGray.200",
          }}
          fontWeight="medium"
          size="xs"
        >
          Calendar
        </Heading>
      </Box>
    </Center>
  );
};
