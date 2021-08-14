import React from "react";
import styled from "styled-components";
import Modal, { BaseModalBackground } from "styled-react-modal";

const StyledModal = Modal.styled`
  width: 20rem;
  height: 20rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: white;
  opacity: ${(props) => props.opacity};
  transition : all 0.3s ease-in-out;`;

const FadingBackground = styled(BaseModalBackground)`
  opacity: ${(props) => props.opacity};
  transition: all 0.3s ease-in-out;
`;

const CustomModal = (props) => {
  return (
    <StyledModal
      isOpen={props.isOpen}
      afterOpen={props.afterOpen}
      beforeClose={props.beforeClose}
      onBackgroundClick={props.onBackgroundClick}
      onEscapeKeydown={props.onEscapeKeydown}
      opacity={props.opacity ? props.opacity : 1}
      backgroundProps={{ opacity: props.opacity }}
    >
      {props.children}
    </StyledModal>
  );
};

export default CustomModal;

export { FadingBackground };
