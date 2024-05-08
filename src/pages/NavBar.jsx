import React from "react";

import {FaBars} from "react-icons/fa";
import {NavLink as Link} from "react-router-dom";
import styled from "styled-components";
import ImportProfil from "./OptimizerClicker/Components/ImportProfil/ImportProfil";

export const Nav = styled.nav`
    background: #FF5C00;
    height: auto;
    max-height: 50px;
    overflow: auto;
    display: flex;
    justify-content: space-between;
    padding: 0.7rem calc((100vw - 1000px) / 2);
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
`;


const Navbar = () => {
    return (
        <>
            <Nav>
                <NavMenu>
                    <img src={process.env.PUBLIC_URL + "/favicon.ico"} alt="image"
                         className={"Building-img"} style={{maxHeight: "99%"}}></img>
                    <NavLink id="profilNavbar" to="/Profil" activestyle="true">
                        Profil (Beta)
                    </NavLink>
                    <NavLink to="/PaladiumClicker" activestyle="true">
                        PalaClicker Optimizer
                    </NavLink>
                    <NavLink to="/PalaAnimation" activestyle="true">
                        PalaAnimation Trainer
                    </NavLink>

                    <ImportProfil resetButton={false} logError={false} idPseudoInput={"pseudoInputNavBar"}/>

                    <NavLink to="/About" activestyle="true">
                        About
                    </NavLink>
                </NavMenu>
            </Nav>
        </>
    );
};

export default Navbar;