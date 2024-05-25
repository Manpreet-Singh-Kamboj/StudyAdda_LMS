import { useEffect, useState } from "react";
import { AiOutlineMenu, AiOutlineShoppingCart } from "react-icons/ai";
import { BsChevronDown } from "react-icons/bs";
import { useSelector } from "react-redux";
import { Link, matchPath, useLocation } from "react-router-dom";

import logo from "../../assets/Logo/rzp_logo.jpg";
import { NavbarLinks } from "../../data/navbar-links";
import { apiConnector } from "../../services/apiconnector";
import { categories } from "../../services/apis";
import { ACCOUNT_TYPE } from "../../utils/constants";
import ProfileDropdown from "../core/Auth/ProfileDropDown";

function Navbar() {
  const { token } = useSelector((state) => state.auth);
  const { user } = useSelector((state) => state.profile);
  const { totalItems } = useSelector((state) => state.cart);
  const location = useLocation();
  const [showMobileNavbar, setShowMobileNavbar] = useState(false);
  const [subLinks, setSubLinks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showSublistMenu, setShowSublistMenu] = useState(false);

  useEffect(() => {
    const body = document.querySelector("body");
    if (showMobileNavbar) {
      body.style.overflow = "hidden";
    } else {
      body.style.overflow = "unset";
    }
  }, [showMobileNavbar]);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const res = await apiConnector("GET", categories.CATEGORIES_API);
        setSubLinks(res.data.data);
      } catch (error) {
        console.log("Could not fetch Categories.", error);
      }
      setLoading(false);
    })();
  }, []);

  const showMobileNav = () => {
    setShowMobileNavbar((prev) => !prev);
  };

  const showSublist = () => {
    setShowSublistMenu((prev) => !prev);
  };

  const matchRoute = (route) => {
    return matchPath({ path: route }, location.pathname);
  };

  return (
    <div
      className={`flex h-14 items-center justify-center border-b-[1px] border-b-richblack-700 ${
        location.pathname !== "/" ? "bg-richblack-800" : ""
      } transition-all duration-200`}
    >
      <div className="flex w-11/12 max-w-maxContent object-cover items-center justify-between">
        <Link to="/">
          <img src={logo} alt="Logo" width={160} height={32} loading="lazy" />
        </Link>
        <div className="md:hidden">
          <button className="mr-4" onClick={showMobileNav}>
            <AiOutlineMenu fontSize={24} fill="#AFB2BF" />
          </button>
        </div>
        <nav className="hidden md:block">
          <ul className="flex gap-x-6 text-richblack-25">
            {NavbarLinks.map((link, index) => (
              <li key={index}>
                {link.title === "Catalog" ? (
                  <>
                    <div
                      className={`group relative flex cursor-pointer items-center gap-1 ${
                        matchRoute("/catalog/:catalogName")
                          ? "text-yellow-25"
                          : "text-richblack-25"
                      }`}
                    >
                      <p>{link.title}</p>
                      <BsChevronDown />
                      <div
                        className={`absolute left-[50%] top-[50%] z-[1000] flex w-[200px] translate-x-[-50%] translate-y-[3em] flex-col rounded-lg bg-richblack-5 p-4 text-richblack-900 opacity-0 transition-all duration-150 ${
                          showSublistMenu ? "visible" : "invisible"
                        } lg:w-[300px]`}
                      >
                        <div className="absolute left-[50%] top-0 -z-10 h-6 w-6 translate-x-[80%] translate-y-[-40%] rotate-45 select-none rounded bg-richblack-5"></div>
                        {loading ? (
                          <p className="text-center">Loading...</p>
                        ) : subLinks && subLinks.length ? (
                          <>
                            {subLinks
                              ?.filter(
                                (subLink) => subLink?.courses?.length > 0
                              )
                              ?.map((subLink, i) => (
                                <Link
                                  to={`/catalog/${subLink.name
                                    .split(" ")
                                    .join("-")
                                    .toLowerCase()}`}
                                  className="rounded-lg bg-transparent py-4 pl-4 hover:bg-richblack-50"
                                  key={i}
                                >
                                  <p>{subLink.name}</p>
                                </Link>
                              ))}
                          </>
                        ) : (
                          <p className="text-center">No Courses Found</p>
                        )}
                      </div>
                    </div>
                  </>
                ) : (
                  <Link to={link?.path}>
                    <p
                      className={`${
                        matchRoute(link?.path)
                          ? "text-yellow-25"
                          : "text-richblack-25"
                      }`}
                    >
                      {link.title}
                    </p>
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </nav>
        <div className="hidden items-center gap-x-4 md:flex">
          {user && user?.accountType !== ACCOUNT_TYPE.INSTRUCTOR && (
            <Link to="/dashboard/cart" className="relative">
              <AiOutlineShoppingCart className="text-2xl text-richblack-100" />
              {totalItems > 0 && (
                <span className="absolute -bottom-2 -right-2 grid h-5 w-5 place-items-center overflow-hidden rounded-full bg-richblack-600 text-center text-xs font-bold text-yellow-100">
                  {totalItems}
                </span>
              )}
            </Link>
          )}
          {token === null && (
            <Link to="/login">
              <button className="rounded-[8px] border border-richblack-700 bg-richblack-800 px-[12px] py-[8px] text-richblack-100">
                Log in
              </button>
            </Link>
          )}
          {token === null && (
            <Link to="/signup">
              <button className="rounded-[8px] border border-richblack-700 bg-richblack-800 px-[12px] py-[8px] text-richblack-100">
                Sign up
              </button>
            </Link>
          )}
          {token !== null && <ProfileDropdown />}
        </div>
      </div>
      {showMobileNavbar && (
        <div className="md:hidden fixed overflow-y-hidden h-full top-[60px] left-0 right-0 bg-richblack-800 z-10 py-2">
          <ul className="text-richblack-25 text-center py-5">
            {NavbarLinks.map((link, index) => (
              <li key={index} className="py-5">
                <Link
                  to={link?.path}
                  onClick={
                    link.title === "Catalog" ? showSublist : showMobileNav
                  }
                >
                  <p className="py-2 block">{link.title}</p>
                  {link.title === "Catalog" && showSublistMenu && (
                    <>
                      {subLinks
                        ?.filter((subLink) => subLink?.courses?.length > 0)
                        ?.map((subLink, i) => (
                          <Link
                            to={`/catalog/${subLink.name
                              .split(" ")
                              .join("-")
                              .toLowerCase()}`}
                            className="rounded-lg flex justify-center w-full bg-transparent py-4 px-5 hover:bg-richblack-50"
                            onClick={showMobileNav}
                            key={i}
                          >
                            <p className="bg-white text-black px-2 py-2 w-full">
                              {subLink.name}
                            </p>
                          </Link>
                        ))}
                    </>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default Navbar;
