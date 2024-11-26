import { FunctionComponent } from "react";
import { AdminIcon, PersonelIcon, ManagerIcon, FinanceOfficer, ItSupport } from "./Icons";

interface RoleIconsProps {
  selectedIcon: number;
  setSelectedIcon: (iconIndex: number) => void;
}

const RoleIcons: FunctionComponent<RoleIconsProps> = ({ selectedIcon, setSelectedIcon }) => {
  const icons = [
    { id: 0, Icon: AdminIcon },
    { id: 1, Icon: PersonelIcon },
    { id: 2, Icon: ManagerIcon },
    { id: 3, Icon: FinanceOfficer },
    { id: 4, Icon: ItSupport },
  ];

  return (
    <div className="flex gap-6">
      {icons?.map((icon) => {
        const fillColor = selectedIcon === icon.id ? "#33C173" : "#ABAFB1"; // Green if selected, grey if not

        return (
          <div
            key={icon.id}
            onClick={() => setSelectedIcon(icon.id)}
            className={`cursor-pointer p-2  rounded-md ${
              selectedIcon === icon.id ? "border-[#33C173]" : "border-[#ABAFB1]"
            }`}
          >
            <icon.Icon fillColor={fillColor} />
          </div>
        );
      })}
    </div>
  );
};

export default RoleIcons;
