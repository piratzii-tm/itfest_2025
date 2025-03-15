import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faBell, faHouse, faPlus } from "@fortawesome/free-solid-svg-icons";
import {Colors} from "react-native-ui-lib";

export const KTabBarIcon = ({ label, isFocused }: { label: string, isFocused:boolean }) =>
  label === "HomeScreen" ? (
    <FontAwesomeIcon icon={faHouse} size={32} color={isFocused ? "white": Colors.darkBlue} />
  ) : label === "ScanScreen" ? (
    <FontAwesomeIcon icon={faPlus} size={32} color={isFocused ? "white": Colors.darkBlue}  />
  ) : (
    <FontAwesomeIcon icon={faBell} size={32} color={isFocused ? "white": Colors.darkBlue} />
  );
