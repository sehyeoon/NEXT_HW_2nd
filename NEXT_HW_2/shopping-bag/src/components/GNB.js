"use client"; 

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation"; // Next.js 13에서 useRouter는 next/navigation에서 가져옴
import styled from "@emotion/styled";
import { css } from "@emotion/react";
import { GNB_TYPE, PAGE } from "../constants/common";

const GNB = ({ type, pageName, onClick, ...rest }) => {
  const router = useRouter(); // useRouter 훅 사용
  const [selectedMenu, setSelectedMenu] = useState(null);

  useEffect(() => {
    if (type !== GNB_TYPE.MAIN) return;

    if (router.pathname.includes("/cart")) {
      setSelectedMenu(1);
    } else {
      setSelectedMenu(0);
    }
  }, [router.pathname, type]);

  const handleClickBack = () => {
    router.back(); // router.push 대신 router.back() 사용
  };

  return (
    <Base onClick={(e) => e.stopPropagation()} {...rest}>
      {type === GNB_TYPE.MAIN && (
        <Inner type={type}>
          <NavBar>
            <NavButton onClick={() => router.push(PAGE.HOME)}>홈</NavButton>
            <NavButton onClick={() => router.push(PAGE.CART)}>장바구니</NavButton>
          </NavBar>
        </Inner>
      )}
      {type === GNB_TYPE.BACK && (
        <Inner type={type}>
          <img src="/images/svg/arrow-back.svg" alt="back" onClick={handleClickBack} />
          <p>{pageName}</p>
          <div style={{ width: 36 }} />
        </Inner>
      )}
    </Base>
  );
};

export default GNB;

// Styled Components (변경 사항 없음)
const Base = styled.div`
  width: 100%;
  max-width: 500px;
  position: fixed;
  top: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 100;
  background-color: #f8f9fa;
`;

const Inner = styled.div`
  ${({ type }) => css`
    width: 100%;
    height: 52px;
    padding: ${type === GNB_TYPE.MAIN ? "0 12px 0 16px" : "0 12px"};
    display: flex;
    flex-direction: row;
    justify-content: ${type === GNB_TYPE.MAIN ? "flex-start" : "space-between"};
    align-items: center;
  `}
`;

const NavBar = styled.div`
  width: 100%;
  height: 100%;
  margin-left: 4px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
`;

const NavButton = styled.div`
  ${({ isActive }) => css`
    font-family: "Pretendard Variable", sans-serif;
    font-size: 20px;
    font-weight: 550;
    line-height: 135%;
    color: ${isActive ? "black" : "grey"};
    height: 100%;
    display: flex;
    align-items: center;
    cursor: pointer;
  `}
`;
