import React, { useContext, useEffect, useRef, useState } from "react";
import useSuccessToast from "../../hooks/useSuccessToast";
import FiilledSuccessButton from "../Shared/FilledSuccessButton/FillSuccessButton";
import HighlightedTextWithArray, { SearchTerm } from "../Shared/HighlightedTextWithArray/HighlightedTextWithArray";
import DatabaseContext from "../../context/database";
import { Character, Element, Extra, Note } from "../../interfaces/scenesTypes";
import removeAccents from "../../utils/removeAccents";
import getUniqueValuesFromNestedArray from "../../utils/getUniqueValuesFromNestedArray";
import ElementForm from "./ElementForm";
import NoteForm from "./NoteForm";
import CharacterForm from "./CharacterForm";
import ExtraForm from "./ExtraForm";
import useTextSelection from "../../hooks/useSelectedText";
import useFormTypeLogic from "../../hooks/useFormTypeLogic";
import OutlineLightButton from "../Shared/OutlineLightButton/OutlineLightButton";
import { IonButton } from "@ionic/react";

interface SceneParagraphProps {
  type: string;
  content: string;
  searchTermsArray?: SearchTerm[];
}

const SceneParagraph: React.FC<SceneParagraphProps> = ({
  type,
  content,
  searchTermsArray,
}) => {

  let className = '';

  switch (type) {
    case 'scene':
      className = 'scene-paragraph';
      break;
    case 'description':
      className = 'description-paragraph';
      break;
    case 'character':
      className = 'character-paragraph';
      break;
    case 'dialog':
      className = 'dialog-paragraph';
      break;
    case 'action':
      className = 'action-paragraph';
      break;
    default:
      className = 'default-paragraph';
  }
  
  return (
    <>
      <p
        className={`${className} script-paragraph`}
      >
        {searchTermsArray && <HighlightedTextWithArray text={content} searchTerms={searchTermsArray} />}
      </p>
    </>
  );
};

export default SceneParagraph;
 