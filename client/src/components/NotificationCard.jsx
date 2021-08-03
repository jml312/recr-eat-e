import { Box, Link } from "@chakra-ui/react";
import React from "react";
import { Link as RouterLink } from "react-router-dom";

function NotificationCard({
  notificationType,
  recipeTitle,
  username,
  dispatch,
  clearNotifications,
  setIsModalOpen,
  setNotificationsNumber,
}) {
  return notificationType === "Like" ? (
    <Box>
      <Link
        fontWeight={700}
        color="#4299e1"
        as={RouterLink}
        to={`/profile/${username}`}
        onClick={() => {
          setIsModalOpen(false);
          setNotificationsNumber(0);
          dispatch(clearNotifications());
        }}
      >
        @{username}
      </Link>
      {"  "}
      liked your recipe titled "{recipeTitle}"
    </Box>
  ) : (
    <Box>
      <Link
        fontWeight={700}
        color="#4299e1"
        as={RouterLink}
        to={`/profile/${username}`}
        onClick={() => {
          setIsModalOpen(false);
          setNotificationsNumber(0);
          dispatch(clearNotifications());
        }}
      >
        @{username}
      </Link>
      {"  "}
      followed you
    </Box>
  );
}

export default NotificationCard;
