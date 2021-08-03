import {
  Avatar,
  Box,
  Button,
  CloseButton,
  Drawer,
  DrawerContent,
  Flex,
  Heading,
  HStack,
  Icon,
  IconButton,
  Link,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spacer,
  Stack,
  StackDivider,
  Text,
  Tooltip,
  useColorMode,
  useColorModeValue,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import Logo from "components/Logo";
import NotificationCard from "components/NotificationCard";
import { logoutUser } from "features/auth/auth.slice";
import { clearNotifications } from "features/user/user.slice";
import React, { useEffect, useState } from "react";
import { BsFillBellFill } from "react-icons/bs";
import { FaMoon, FaSun } from "react-icons/fa";
import {
  FiChevronDown,
  FiHeart,
  FiHome,
  FiMenu,
  FiTrendingUp,
} from "react-icons/fi";
import { IoCreateOutline, IoNewspaperOutline } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { Link as RouterLink, NavLink, useLocation } from "react-router-dom";
import { getPageHeading } from "utils/getPageHeading";

const LinkItems = [
  { name: "Home", to: "/home", icon: FiHome },
  { name: "Top 3", to: "/top-3", icon: FiTrendingUp },
  { name: "My Likes", to: "/my-likes", icon: FiHeart },
  { name: "My Recipes", to: "/my-recipes", icon: IoNewspaperOutline },
  { name: "Create", to: "/create", icon: IoCreateOutline },
];

function HomeNav({ children }) {
  const {
    user: { fullName, username, selectedAvatar, notifications },
  } = useSelector((state) => state.auth);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [notificationsNumber, setNotificationsNumber] = useState(
    localStorage.hasReadNotifications ? 0 : notifications?.length
  );
  const dispatch = useDispatch();
  const { colorMode } = useColorMode();
  const { pathname } = useLocation();

  useEffect(() => {
    setNotificationsNumber(
      localStorage.hasReadNotifications ? 0 : notifications?.length
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [notifications]);

  return (
    <Box minH="100vh" bg={useColorModeValue("gray.100", "gray.900")}>
      <SidebarContent
        onClose={onClose}
        display={{ base: "none", md: "block" }}
      />
      <Drawer
        autoFocus={false}
        isOpen={isOpen}
        placement="left"
        onClose={onClose}
        returnFocusOnClose={false}
        onOverlayClick={onClose}
        blockScrollOnMount
        size="full"
      >
        <DrawerContent>
          <SidebarContent onClose={onClose} />
        </DrawerContent>
      </Drawer>
      <MobileNav
        dispatch={dispatch}
        fullName={fullName}
        username={username}
        selectedAvatar={selectedAvatar}
        onOpen={onOpen}
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        colorMode={colorMode}
        notifications={notifications}
        notificationsNumber={notificationsNumber}
        setNotificationsNumber={setNotificationsNumber}
        pathname={pathname}
      />
      {children}
    </Box>
  );
}

const SidebarContent = ({ onClose, ...rest }) => {
  const { colorMode, toggleColorMode } = useColorMode();
  return (
    <Box
      transition="3s ease"
      bg={useColorModeValue("white", "gray.900")}
      borderRight="1px"
      borderRightColor={useColorModeValue("gray.200", "gray.700")}
      w={{ base: "full", md: 52 }}
      pos="fixed"
      h="full"
      {...rest}
    >
      <Flex
        justify="center"
        align="center"
        height="20"
        style={{ width: "3.5rem", marginLeft: "14rem" }}
        display={{ base: "none", md: "flex" }}
      >
        <Logo />
      </Flex>

      <Flex
        justify="space-between"
        align="center"
        display={{ base: "flex", md: "none" }}
        direction={"row-reverse"}
        w={"full"}
        mt={"4"}
      >
        <Flex
          justify="center"
          align="center"
          style={{ width: "3.5rem" }}
          display="flex"
          mr={"4"}
        >
          <Logo />
        </Flex>
        <CloseButton
          ml={"4"}
          display={{ base: "flex", md: "none" }}
          onClick={onClose}
        />
      </Flex>

      <Box mt={{ base: "4", md: "-6" }}>
        {LinkItems.map((link) => (
          <NavItem
            key={link.name}
            icon={link.icon}
            to={link.to}
            colorMode={colorMode}
            onClose={onClose}
          >
            {link.name}
          </NavItem>
        ))}
      </Box>
      <Stack
        align="center"
        justify="center"
        direction="row"
        pos="absolute"
        style={{ bottom: "3%" }}
        w="full"
        spacing="6"
      >
        <Tooltip
          hasArrow
          placement="bottom"
          label={
            colorMode === "light" ? "Toggle Dark Mode" : "Toggle Light Mode"
          }
        >
          <Box>
            <IconButton
              isRound
              size="2xl"
              p={2}
              onClick={toggleColorMode}
              fontSize="2.5rem"
              icon={
                colorMode === "light" ? (
                  <FaSun color="black" />
                ) : (
                  <FaMoon color="white" />
                )
              }
              colorScheme="twitter"
              variant="ghost"
            />
          </Box>
        </Tooltip>
      </Stack>
    </Box>
  );
};

const NavItem = ({ to, icon, children, colorMode, onClose, ...rest }) => {
  return (
    <Link
      as={NavLink}
      to={to}
      style={{ textDecoration: "none" }}
      activeStyle={{
        color: colorMode === "light" ? "#007bff" : "#ADD8E6",
        fontWeight: "900",
      }}
      onClick={onClose}
    >
      <Flex
        align="center"
        p="4"
        mx="4"
        borderRadius="lg"
        role="group"
        cursor="pointer"
        _hover={{
          bg: colorMode === "light" ? "gray.700" : "gray.50",
          color: colorMode === "light" ? "white" : "black",
        }}
        {...rest}
      >
        {icon && (
          <Icon
            mr="4"
            fontSize="16"
            _groupHover={{
              color: colorMode === "light" ? "white" : "black",
            }}
            as={icon}
          />
        )}
        {children}
      </Flex>
    </Link>
  );
};

const MobileNav = ({
  dispatch,
  username,
  fullName,
  selectedAvatar,
  onOpen,
  isModalOpen,
  setIsModalOpen,
  colorMode,
  notifications,
  notificationsNumber,
  setNotificationsNumber,
  pathname,
  ...rest
}) => {
  return (
    <Flex
      ml={{ base: 0, md: 52 }}
      px={{ base: 4, md: 4 }}
      height="20"
      alignItems="center"
      bg={useColorModeValue("white", "gray.900")}
      borderBottomWidth="1px"
      borderBottomColor={useColorModeValue("gray.200", "gray.50")}
      justifyContent={{ base: "space-between", md: "flex-end" }}
      position={{ base: "fixed", md: "unset" }}
      w={{ base: "full", md: "auto" }}
      zIndex={4}
      {...rest}
    >
      <IconButton
        display={{ base: "flex", md: "none" }}
        variant="outline"
        aria-label="open menu"
        icon={<FiMenu />}
        onClick={onOpen}
      />
      <Spacer />
      <Heading fontSize={{ base: "lg", md: "4xl" }} textAlign="center">
        {getPageHeading(pathname)}
      </Heading>
      <Spacer />
      <HStack spacing={{ base: "6", md: "7" }}>
        <Tooltip
          hasArrow
          label={
            notificationsNumber === 0
              ? "No new notifications"
              : "View your notifications"
          }
          color="white"
          bg="black"
        >
          <IconButton
            size="lg"
            variant="ghost"
            isRound
            aria-label="open menu"
            icon={<BsFillBellFill />}
            colorScheme="blackAlpha"
            color={useColorModeValue("black", "white")}
            fontSize="x-large"
            onClick={() => {
              if (notificationsNumber > 0) {
                setIsModalOpen(true);
              }
            }}
            _after={
              notificationsNumber > 0
                ? {
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    fontSize: "calc(1vh + 0.2em)",
                    content: `'${
                      notificationsNumber < 999 ? notificationsNumber : 999
                    }${notificationsNumber <= 999 ? "" : "+"}'`,
                    w: "auto",
                    minWidth: "6",
                    h: "6",
                    bg: "red.300",
                    border: "0.25px solid black",
                    rounded: "full",
                    padding: "0.4rem",
                    pos: "absolute",
                    top: -1,
                    left: 6,
                  }
                : ""
            }
          />
        </Tooltip>
        <Modal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setNotificationsNumber(0);
            dispatch(clearNotifications());
          }}
          isCentered
        >
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Here are your notifications</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <VStack
                divider={<StackDivider borderColor="gray.200" />}
                spacing={4}
                align="stretch"
                maxH={"200px"}
                overflowY={"scroll"}
              >
                {notifications?.map((notification, i) => (
                  <NotificationCard
                    key={i}
                    {...notification}
                    setIsModalOpen={setIsModalOpen}
                    setNotificationsNumber={setNotificationsNumber}
                    dispatch={dispatch}
                    clearNotifications={clearNotifications}
                  />
                ))}
              </VStack>
            </ModalBody>
            <ModalFooter>
              <Button
                colorScheme="blue"
                onClick={() => {
                  setIsModalOpen(false);
                  setNotificationsNumber(0);
                  dispatch(clearNotifications());
                }}
              >
                Close
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
        <Flex alignItems={"center"}>
          <Menu>
            <MenuButton
              py={2}
              transition="all 0.3s"
              _focus={{ boxShadow: "none" }}
            >
              <HStack>
                {selectedAvatar && (
                  <Avatar
                    border="1px"
                    borderColor="gray.200"
                    size={"md"}
                    src={`/avatars/${selectedAvatar.replace(/\s+/g, "")}.png`}
                  />
                )}
                <VStack
                  display={{ base: "none", md: "flex" }}
                  alignItems="flex-start"
                  spacing="1px"
                  ml="2"
                  color={useColorModeValue("black", "white")}
                  fontWeight="normal"
                >
                  <Text fontSize="sm">{username}</Text>
                  <Text fontSize="xs">{fullName}</Text>
                </VStack>
                <Box display={{ base: "none", md: "flex" }}>
                  <FiChevronDown />
                </Box>
              </HStack>
            </MenuButton>
            <MenuList
              bg={useColorModeValue("white", "gray.900")}
              borderColor={useColorModeValue("gray.200", "gray.700")}
            >
              <RouterLink to="/profile/me">
                <MenuItem>My Profile</MenuItem>
              </RouterLink>
              <MenuDivider />
              <MenuItem onClick={() => dispatch(logoutUser())}>
                Sign out
              </MenuItem>
            </MenuList>
          </Menu>
        </Flex>
      </HStack>
    </Flex>
  );
};

export default HomeNav;
