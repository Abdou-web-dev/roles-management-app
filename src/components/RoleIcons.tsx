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
    <>
      <label
        htmlFor="roleIcon"
        className=""
      >
        Select Role Icon
      </label>
      <div className="role-icons-inner flex gap-0">
        {icons?.map((icon) => {
          const fillColor = selectedIcon === icon.id ? "#33C173" : "#ABAFB1"; // Green if selected, grey if not

          return (
            <div
              key={icon.id}
              onClick={() => setSelectedIcon(icon.id)}
              className={`single__icon cursor-pointer p-2  ${
                selectedIcon === icon.id ? "border-[#33C173]" : "border-[#ABAFB1]"
              }`}
            >
              <icon.Icon fillColor={fillColor} />
            </div>
          );
        })}
      </div>
    </>
  );
};

export default RoleIcons;
