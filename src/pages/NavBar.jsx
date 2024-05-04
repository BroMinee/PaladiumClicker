import React from "react";

import { FaBars } from "react-icons/fa";
import { NavLink as Link } from "react-router-dom";
import styled from "styled-components";

export const Nav = styled.nav`
    background: #FF5C00;
    height: 85px;
    display: flex;
    justify-content: space-between;
    padding: 0.2rem calc((100vw - 1000px) / 2);
    z-index: 1;
    position: sticky;
`;

export const NavLink = styled(Link)`
    color: white;
    display: flex;
    align-items: center;
    text-decoration: none;
    padding: 0 1rem;
    height: 100%;
    font-weight: bold;
    cursor: pointer;
    &.active {
        /* Underline text*/
        text-after-overflow: underline;
        color: #4d4dff;
    }
`;

export const Bars = styled(FaBars)`
    display: none;
    color: #808080;
    @media screen and (max-width: 768px) {
        display: block;
        position: absolute;
        top: 0;
        right: 0;
        transform: translate(-100%, 75%);
        font-size: 1.8rem;
        cursor: pointer;
    }
`;

export const NavMenu = styled.div`
    display: flex;
    align-items: center;
    /* Second Nav */
    /* margin-right: 24px; */
    /* Third Nav */
    /* width: 100vw;
white-space: nowrap; */
    @media screen and (max-width: 768px) {
        display: none;
    }
`;


const Navbar = () => {
    return (
        <>
            <Nav>
                <NavMenu>
                    <NavLink to="/Profil" activestyle="true">
                        Profil (Beta)
                    </NavLink>
                    <NavLink to="/PaladiumClicker" activestyle="true">
                        PalaClicker Optimizer
                    </NavLink>
                    <NavLink to="/PalaAnimation" activestyle="true">
                        PalaAnimation Trainer
                    </NavLink>
                    <NavLink to="/About" activestyle="true">
                        About
                    </NavLink>
                    <NavLink to="/Bugs" activestyle="true">
                        Bugs
                    </NavLink>
                </NavMenu>
            </Nav>
        </>
    );
};

export default Navbar;