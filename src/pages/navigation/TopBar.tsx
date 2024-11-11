import logout from "../../assets/logout.svg";
import "./navigationStyles.scss";

export const TopBar = () => {
  return (
    <div className="topbar-component ">
      <div className="topbar-component__inner flex justify-end">
        <span className="text">Mathew Keller</span>
        <button
          style={{ background: "initial" }}
          className="text-sm border-0 outline-none p-0 py-1 rounded"
        >
          <img
            src={logout}
            alt=""
          />
        </button>
      </div>
    </div>
  );
};
