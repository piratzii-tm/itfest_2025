import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faBell, faHouse, faPlus } from "@fortawesome/free-solid-svg-icons";

export const KTabBarIcon = ({ label }: { label: string }) =>
  label === "HomeScreen" ? (
    <FontAwesomeIcon icon={faHouse} size={32} color="blue" />
  ) : label === "ScanScreen" ? (
    <FontAwesomeIcon icon={faPlus} size={32} color="blue" />
  ) : (
    <FontAwesomeIcon icon={faBell} size={32} color="orange" />
  );
