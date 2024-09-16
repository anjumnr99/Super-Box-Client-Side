import { AiOutlineProduct } from "react-icons/ai";
import { FaRegQuestionCircle } from "react-icons/fa";
import { GrAtm, GrResources } from "react-icons/gr";
import { HiChatBubbleLeftRight, HiUserGroup } from "react-icons/hi2";
import { MdAddBusiness } from "react-icons/md";
import { TbLogs } from "react-icons/tb";
import { NavLink, Outlet } from "react-router-dom";
import useRole from "../../hooks/useRole";

const DHome = () => {
  const { isAdmin, isSeller } = useRole();
  const sellerNavLinks = (
    <>
      <li>
        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            `p-2 text-lg rounded-sm ${isActive ? " bg-gray-600/30" : ""}`
          }
          end // Makes sure this matches exactly for /dashboard
        >
          <AiOutlineProduct className="text-3xl" />
          Edit your site
        </NavLink>
      </li>
      <li>
        <NavLink
          to="/dashboard/productManagement"
          className={({ isActive }) =>
            `p-2 text-lg rounded-sm ${isActive ? " bg-gray-600/30" : ""}`
          }
        >
          <AiOutlineProduct className="text-3xl" />
          Product Management
        </NavLink>
      </li>
      <li>
        <NavLink
          to="/dashboard/blogs"
          className={({ isActive }) =>
            `p-2 text-lg rounded-sm ${isActive ? "bg-gray-600/30" : ""}`
          }
        >
          <TbLogs className="text-3xl" />
          Blogs
        </NavLink>
      </li>
      <li>
        <NavLink
          to="/dashboard/pos"
          className={({ isActive }) =>
            `p-2 text-lg rounded-sm ${isActive ? "bg-gray-600/30" : ""}`
          }
        >
          <GrAtm className="text-3xl" />
          POS
        </NavLink>
      </li>

      <li>
        <NavLink
          to="/dashboard/chat-us"
          className={({ isActive }) =>
            `p-2 text-lg rounded-sm ${isActive ? "bg-gray-600/30" : ""}`
          }
        >
          <HiChatBubbleLeftRight className="text-3xl" />
          Chat with us
        </NavLink>
      </li>
      <li>
        <NavLink
          to="/dashboard/business-revenue"
          className={({ isActive }) =>
            `p-2 text-lg rounded-sm ${isActive ? "bg-gray-600/30" : ""}`
          }
        >
          <GrResources className="text-3xl" />
          Business Revenue
        </NavLink>
      </li>
      <li>
        <NavLink
          to="/dashboard/bm-resources"
          className={({ isActive }) =>
            `p-2 text-lg rounded-sm ${isActive ? "bg-gray-600/30" : ""}`
          }
        >
          <GrResources className="text-3xl" />
          Business and Marketing Resources
        </NavLink>
      </li>
    </>
  );

  const userNavLinks = (
    <li>
      <NavLink to="/" className={`p-2 text-lg rounded-sm`}>
        <MdAddBusiness className="text-3xl" />
        Create a website
      </NavLink>
    </li>
  );
  const adminNavLinks = (
    <>
      <li className="menu p-0">
        <details>
          <summary className="px-3 rounded-sm">
            <NavLink
              to="/dashboard/welcome-page"
              className={` text-lg flex flex-row justify-between items-center gap-2`}
            >
              <HiUserGroup className="text-3xl" />
              All Users
            </NavLink>
          </summary>
          <ul className="text-lg">
            <li>
              <NavLink to={"/dashboard/seller-panel"}>Seller Panel</NavLink>
            </li>
            <li>
              <NavLink to={"/dashboard/customer-panel"}>Customer Panel</NavLink>
            </li>
          </ul>
        </details>
      </li>
      <li>
        <NavLink
          to="/dashboard/all-products"
          className={`p-2 text-lg rounded-sm`}
        >
          <AiOutlineProduct className="text-3xl" />
          All Products
        </NavLink>
      </li>
      <li>
        <NavLink to="/dashboard/blogs" className={`p-2 text-lg rounded-sm`}>
          <TbLogs className="text-3xl" />
          Selling details
        </NavLink>
      </li>
      <li>
        <NavLink to="/dashboard/pos" className={`p-2 text-lg rounded-sm`}>
          <GrAtm className="text-3xl" />
          Wallet
        </NavLink>
      </li>

      <li>
        <NavLink
          to="/dashboard/seller-request"
          className={`p-2 text-lg rounded-sm`}
        >
          <FaRegQuestionCircle className="text-3xl" />
          Seller Request
        </NavLink>
      </li>
      <li>
        <NavLink
          to="/dashboard/bm-resources"
          className={`p-2 text-lg rounded-sm`}
        >
          <GrResources className="text-3xl" />
          Reports And Issues
        </NavLink>
      </li>
    </>
  );
  return (
    <div>
      <div className="drawer lg:drawer-open">
        <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
        <div className="drawer-content ">
          <div>
            <Outlet />
          </div>
          <label
            htmlFor="my-drawer-2"
            className="btn btn-primary drawer-button lg:hidden"
          >
            Open drawer
          </label>
        </div>
        <div className="drawer-side">
          <label
            htmlFor="my-drawer-2"
            aria-label="close sidebar"
            className="drawer-overlay"
          ></label>
          <ul className="menu bg-base-200 text-base-content min-h-full w-80 p-4">
            {isAdmin ? adminNavLinks : isSeller ? sellerNavLinks : userNavLinks}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default DHome;
