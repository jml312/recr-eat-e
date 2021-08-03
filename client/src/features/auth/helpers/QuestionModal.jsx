import React from "react";
import { AiOutlineQuestionCircle, AiFillQuestionCircle } from "react-icons/ai";
import {
  IconButton,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Box,
  useDisclosure,
} from "@chakra-ui/react";

function QuestionModal({ colorMode }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <Box pos="fixed" bottom="4" right="4">
      <IconButton
        bg="#E1E1E1"
        isRound
        icon={
          colorMode === "light" ? (
            <AiOutlineQuestionCircle fontSize="3rem" />
          ) : (
            <AiFillQuestionCircle fontSize="3rem" />
          )
        }
        size="lg"
        color="black"
        onClick={onOpen}
        _hover={{
          transform: "scale(1.25)",
        }}
      />

      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>What is Recr-eat-e?</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            Recr-eat-e (recreate) is a website that allows you to share your
            recipes that you have made with other users. It is called Recr-eat-e
            because the goal is to cook (recreate) the recipes that you find
            from others with just the ingredients.
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              Ok
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}

export default QuestionModal;
